const mongoose = require('mongoose');
const QRCode = require('qrcode');

const Branch = require('../models/branch.model');
const { fail } = require('../utils/errors');
const { buildSurveyLink, signQrLink } = require('../utils/surveyLinks');
const { requireBusinessId, getOwnedSurvey } = require('./surveyAccess');

const getShareableSurvey = (user, surveyId) => {
  const businessId = requireBusinessId(user);
  return mongoose.connection.transaction(
    async (session) => {
      const survey = await getOwnedSurvey(businessId, surveyId, session);
      if (survey.status !== 'live') throw fail('Only live surveys can be shared', 409);

      const branches = await Branch.find({
        _id: { $in: survey.branchIds },
        businessId,
        status: 'active',
      })
        .select('name slug')
        .sort({ name: 1 })
        .session(session)
        .lean();

      return { survey, branches };
    },
    { readConcern: { level: 'snapshot' } },
  );
};

const requirePublicBranch = (branches) => {
  // The public form can resolve a single active branch even if it predates branch slugs.
  if (branches.length !== 1 && !branches.some((branch) => branch.slug))
    throw fail('No assigned branch can currently open this survey', 409);
};

const getShare = async (user, surveyId) => {
  const { survey, branches } = await getShareableSurvey(user, surveyId);
  requirePublicBranch(branches);
  return {
    survey: { id: survey._id, name: survey.name },
    link: buildSurveyLink(survey.shortCode),
    branches: branches
      .filter((branch) => branch.slug)
      .map((branch) => ({
        id: branch._id,
        name: branch.name,
        slug: branch.slug,
        link: buildSurveyLink(survey.shortCode, branch.slug),
      })),
  };
};

const getQrImage = async (user, surveyId, branchId) => {
  const { survey, branches } = await getShareableSurvey(user, surveyId);
  const branch = branchId && branches.find((item) => String(item._id) === branchId.toLowerCase());
  if (branchId && !branch?.slug) throw fail('Branch not found', 404);
  requirePublicBranch(branches);

  const token = signQrLink(survey._id, branch?._id);
  const link = buildSurveyLink(survey.shortCode, branch?.slug, token);
  return QRCode.toBuffer(link, { width: 512, margin: 4, errorCorrectionLevel: 'M' });
};

module.exports = { getShare, getQrImage };
