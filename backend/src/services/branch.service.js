const Branch = require("../models/branch.model");
const Business = require("../models/business.model");
const BusinessOwner = require("../models/businessOwner.model");
const { fail } = require("../utils/errors");
const surveyStats = require("./surveyStats.service");
const { requireBusinessId } = require("./surveyAccess");

const escapeRegex = (text) => text.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");

const toLocation = (b) => [b.address, b.city, b.country].filter(Boolean).join(", ");

const toBranchDTO = (b, responseCount = 0) => ({
  id: b._id,
  name: b.name,
  slug: b.slug || null,
  country: b.country || "",
  city: b.city || "",
  address: b.address || "",
  location: toLocation(b),
  status: b.status,
  responseCount,
  archivedAt: b.archivedAt || null,
  createdAt: b.createdAt,
});

const getOwnedBranch = async (businessId, branchId) => {
  const branch = await Branch.findOne({ _id: branchId, businessId });
  if (!branch) throw fail("Branch not found", 404);
  return branch;
};

const duplicateNameError = () => fail("A branch with this name already exists", 409);

/* ---------- list + cards ---------- */

// Tabs "Active branches" / "Archived" + search box. Also feeds the branch pickers
// on the survey screens, which is why the default is active branches only.
//   status: active (default) | archived | all      search: matches name or city
const list = async (user, query = {}) => {
  const businessId = requireBusinessId(user);
  const filter = { businessId };

  const status = ["active", "archived", "all"].includes(query.status) ? query.status : "active";
  if (status !== "all") filter.status = status;

  const search = typeof query.search === "string" ? query.search.trim() : "";
  if (search) {
    const regex = { $regex: escapeRegex(search), $options: "i" };
    filter.$or = [{ name: regex }, { city: regex }];
  }

  const branches = await Branch.find(filter).sort({ createdAt: 1, _id: 1 }).limit(200).lean();
  const counts = await surveyStats.getBranchResponseCounts(branches.map((b) => b._id));

  return branches.map((b) => toBranchDTO(b, counts.get(String(b._id)) || 0));
};

// The three cards on top of the Branches page (both tabs) + the tab numbers.
const getSummary = async (user) => {
  const businessId = requireBusinessId(user);

  const [business, activeBranches, archivedBranches, totals] = await Promise.all([
    Business.findById(businessId).select("ownerId").lean(),
    Branch.countDocuments({ businessId, status: "active" }),
    Branch.countDocuments({ businessId, status: "archived" }),
    surveyStats.getResponseTotals(businessId),
  ]);
  const owner = business ? await BusinessOwner.findById(business.ownerId).select("name").lean() : null;

  return {
    activeBranches,
    archivedBranches,
    totalResponses: totals.total,
    activeResponses: totals.byActiveBranches,
    archivedResponses: totals.byArchivedBranches,
    owner: { id: business?.ownerId || null, name: owner?.name || "" },
  };
};

/* ---------- one branch ---------- */

// Edit form, "Archive <branch>?" dialog (responseCount = "earlier responses are retained")
// and the Archived branch details page.
const getById = async (user, branchId) => {
  const businessId = requireBusinessId(user);
  const branch = await getOwnedBranch(businessId, branchId);

  const [counts, business] = await Promise.all([
    surveyStats.getBranchResponseCounts([branch._id]),
    Business.findById(businessId).select("name ownerId").lean(),
  ]);
  const owner = business ? await BusinessOwner.findById(business.ownerId).select("name").lean() : null;

  return {
    ...toBranchDTO(branch, counts.get(String(branch._id)) || 0),
    business: { id: businessId, name: business?.name || "" },
    owner: { id: business?.ownerId || null, name: owner?.name || "" },
  };
};

// Historical numbers for the "Archived branch details" page.
const getHistory = async (user, branchId) => {
  const businessId = requireBusinessId(user);
  const branch = await getOwnedBranch(businessId, branchId);

  return { branchId: branch._id, status: branch.status, ...(await surveyStats.getBranchHistory(branch._id)) };
};

/* ---------- write ---------- */

const create = async (user, { name, country, city, address }) => {
  const businessId = requireBusinessId(user);
  const business = await Business.findById(businessId);
  if (!business) throw fail("Business not found", 404);

  let branch;
  try {
    branch = await Branch.create({ businessId, name, country, city, address });
  } catch (error) {
    if (error.code === 11000) throw duplicateNameError();
    throw error;
  }

  // Onboarding may have said "single branch": a second branch makes it multi-branch.
  if (!business.hasMultipleBranches) {
    business.hasMultipleBranches = true;
    await business.save();
  }

  return toBranchDTO(branch);
};

// The slug is NOT changed on rename: the survey links and QR codes already printed keep working.
const update = async (user, branchId, { name, country, city, address }) => {
  const businessId = requireBusinessId(user);
  const branch = await getOwnedBranch(businessId, branchId);

  if (branch.status === "archived") throw fail("Archived branches can't be edited", 409);

  Object.assign(branch, { name, country, city, address });

  try {
    await branch.save();
  } catch (error) {
    if (error.code === 11000) throw duplicateNameError();
    throw error;
  }

  const counts = await surveyStats.getBranchResponseCounts([branch._id]);
  return toBranchDTO(branch, counts.get(String(branch._id)) || 0);
};

// Archive = hide from active lists and pickers. Nothing is deleted: responses and analytics stay.
const archive = async (user, branchId) => {
  const businessId = requireBusinessId(user);
  const branch = await getOwnedBranch(businessId, branchId);

  if (branch.status === "archived") throw fail("This branch is already archived", 409);

  const otherActive = await Branch.countDocuments({ businessId, status: "active", _id: { $ne: branch._id } });
  if (otherActive === 0) throw fail("You need at least one active branch", 409);

  branch.status = "archived";
  branch.archivedAt = new Date();
  await branch.save();

  const counts = await surveyStats.getBranchResponseCounts([branch._id]);
  return toBranchDTO(branch, counts.get(String(branch._id)) || 0);
};

module.exports = { list, getSummary, getById, getHistory, create, update, archive };
