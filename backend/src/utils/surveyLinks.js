const { createHmac, timingSafeEqual } = require('node:crypto');
const { appOrigin } = require('./browserSession');

const buildSurveyLink = (shortCode, branchSlug, qrToken) => {
  const target = new URL('/', appOrigin());
  const query = new URLSearchParams({ code: shortCode });
  if (branchSlug) query.set('branch', branchSlug);
  if (qrToken) query.set('qr', qrToken);
  target.hash = `/public-survey?${query}`;
  return target.href;
};

const signQrLink = (surveyId, branchId = '') =>
  createHmac('sha256', process.env.JWT_SECRET)
    .update(`nuvia-survey-qr:v1:${surveyId}:${branchId}`)
    .digest('hex');

const isIssuedQrToken = (token, surveyId, branchId) => {
  if (typeof token !== 'string' || !/^[a-f0-9]{64}$/.test(token)) return false;
  const supplied = Buffer.from(token, 'hex');
  // A survey-wide QR can resolve any current branch. A branch QR stays scoped to its branch.
  return ['', branchId].some((scope) =>
    timingSafeEqual(supplied, Buffer.from(signQrLink(surveyId, scope), 'hex')),
  );
};

module.exports = { buildSurveyLink, signQrLink, isIssuedQrToken };
