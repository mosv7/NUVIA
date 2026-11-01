const Business = require('../models/business.model');
const BusinessOwner = require('../models/businessOwner.model');
const Branch = require('../models/branch.model');
const { fail } = require('../utils/errors');
const { requireBusinessId } = require('./surveyAccess');

// How many branch names the "Active branches" card lists ("Cairo · Alex · El Zamalek").
const BRANCH_NAMES_SHOWN = 5;

const buildProfile = async (business) => {
  const [owner, activeCount, branches, withCountry] = await Promise.all([
    BusinessOwner.findById(business.ownerId).select('name').lean(),
    Branch.countDocuments({ businessId: business._id, status: 'active' }),
    Branch.find({ businessId: business._id, status: 'active' })
      .sort({ createdAt: 1, _id: 1 })
      .limit(BRANCH_NAMES_SHOWN)
      .select('name')
      .lean(),
    // The business itself has no country: show the one of its oldest branch that has one.
    Branch.findOne({ businessId: business._id, country: { $nin: [null, ''] } })
      .sort({ createdAt: 1, _id: 1 })
      .select('country')
      .lean(),
  ]);

  return {
    id: business._id,
    name: business.name,
    type: business.type,
    slug: business.slug,
    country: withCountry?.country || null,
    owner: { id: business.ownerId, name: owner?.name || '' },
    activeBranches: { count: activeCount, names: branches.map((b) => b.name) },
    createdAt: business.createdAt,
    updatedAt: business.updatedAt,
  };
};

const getProfile = async (user) => {
  const businessId = requireBusinessId(user);
  const business = await Business.findById(businessId);
  if (!business) throw fail('Business not found', 404);
  return buildProfile(business);
};

// "Edit business profile": name + industry. The slug is NOT changed on rename, so links
// and QR codes that are already printed keep working.
const updateProfile = async (user, { name, type }) => {
  const businessId = requireBusinessId(user);
  const business = await Business.findById(businessId);
  if (!business) throw fail('Business not found', 404);

  business.name = name;
  business.type = type;
  await business.save();

  return buildProfile(business);
};

module.exports = { getProfile, updateProfile };
