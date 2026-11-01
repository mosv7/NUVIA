// const QRCode = require("qrcode");

// const Branch = require("../models/branch.model");
// const Business = require("../models/business.model");
// const { fail } = require("../utils/errors");
// const { buildSurveyLink, buildBranchLink } = require("../utils/surveyLinks");
// const surveyStats = require("./surveyStats.service");
// const { requireBusinessId, getOwnedSurvey } = require("./surveyAccess");

// const QR_OPTIONS = { margin: 1, errorCorrectionLevel: "M" };

// // Branches created before slugs existed get one the first time they are shared.
// const loadBranchesWithSlugs = async (businessId, branchIds) => {
//   const branches = await Branch.find({ _id: { $in: branchIds }, businessId, status: "active" }).sort({ name: 1 });

//   for (const branch of branches) {
//     if (!branch.slug) {
//       branch.slug = await Branch.generateUniqueSlug(businessId, branch.name);
//       await branch.save();
//     }
//   }

//   return branches;
// };

// const getShareableSurvey = async (user, surveyId) => {
//   const businessId = requireBusinessId(user);
//   const survey = await getOwnedSurvey(businessId, surveyId);

//   // A QR code printed from a draft would point to a survey customers can't open yet.
//   if (survey.status === "draft") throw fail("Publish the survey before sharing it", 409);

//   return { businessId, survey };
// };

// // Share screen: main link + QR, one link per branch, and the scan numbers.
// const getShare = async (user, surveyId) => {
//   const { businessId, survey } = await getShareableSurvey(user, surveyId);

//   const [business, branches, stats] = await Promise.all([
//     Business.findById(businessId).select("name").lean(),
//     loadBranchesWithSlugs(businessId, survey.branchIds),
//     surveyStats.getShareStats(survey._id),
//   ]);

//   const link = buildSurveyLink(survey.shortCode);

//   return {
//     survey: { id: survey._id, name: survey.name, status: survey.status },
//     businessName: business?.name || "",
//     link,
//     qrSvg: await QRCode.toString(link, { ...QR_OPTIONS, type: "svg" }),
//     branches: branches.map((b) => ({
//       id: b._id,
//       name: b.name,
//       slug: b.slug,
//       link: buildBranchLink(survey.shortCode, b.slug),
//     })),
//     stats,
//   };
// };

// // Downloadable QR (Print / SVG buttons). Without branchId it encodes the main survey link.
// const getQrImage = async (user, surveyId, { branchId, format = "svg", size = 512 } = {}) => {
//   const { businessId, survey } = await getShareableSurvey(user, surveyId);

//   let link = buildSurveyLink(survey.shortCode);
//   let name = survey.shortCode;

//   if (branchId) {
//     if (!survey.branchIds.some((id) => String(id) === String(branchId))) {
//       throw fail("This survey isn't available at that branch", 404);
//     }
//     const [branch] = await loadBranchesWithSlugs(businessId, [branchId]);
//     if (!branch) throw fail("Branch not found", 404);

//     link = buildBranchLink(survey.shortCode, branch.slug);
//     name = `${survey.shortCode}-${branch.slug}`;
//   }

//   if (format === "png") {
//     const width = Math.min(2048, Math.max(128, parseInt(size, 10) || 512));
//     return {
//       contentType: "image/png",
//       filename: `${name}-qr.png`,
//       body: await QRCode.toBuffer(link, { ...QR_OPTIONS, width }),
//     };
//   }

//   return {
//     contentType: "image/svg+xml",
//     filename: `${name}-qr.svg`,
//     body: await QRCode.toString(link, { ...QR_OPTIONS, type: "svg" }),
//   };
// };

// module.exports = { getShare, getQrImage };
