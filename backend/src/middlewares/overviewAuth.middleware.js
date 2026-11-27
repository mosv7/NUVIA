const authenticate = require('./auth.middleware');

const fields = new Set([
  'branchId',
  'branchIds',
  'surveyId',
  'startDate',
  'endDate',
  'lang',
  'language',
  'aspectName',
  'selectedAspect',
  'selectedTopic',
  'topicName',
  'onlyComplaints',
  'page',
  'limit',
]);
const objectId = /^[a-f\d]{24}$/iu;
const millisecondsPerDay = 86400000;
const day = (value) => {
  if (!/^\d{4}-\d{2}-\d{2}$/u.test(value)) return NaN;
  const date = new Date(value + 'T00:00:00.000Z');
  return Number.isFinite(date.getTime()) && date.toISOString().slice(0, 10) === value
    ? date.getTime()
    : NaN;
};

function validQuery(query, withDailySeries) {
  if (
    Object.entries(query).some(
      ([key, value]) =>
        !fields.has(key) || typeof value !== 'string' || !value.trim() || value.length > 1000,
    )
  )
    return false;
  const {
    branchId,
    branchIds,
    surveyId,
    startDate,
    endDate,
    lang,
    language,
    page,
    limit,
    onlyComplaints,
  } = query;
  if (branchId && branchId !== 'all' && !objectId.test(branchId)) return false;
  if (surveyId && !objectId.test(surveyId)) return false;
  if (branchIds && branchIds !== 'all') {
    const ids = branchIds.split(',');
    if (ids.length > 30 || ids.some((id) => !objectId.test(id.trim()))) return false;
  }
  if (
    (lang && !['en', 'ar', 'all'].includes(lang)) ||
    (language && !['en', 'ar'].includes(language))
  )
    return false;
  if (onlyComplaints && !['true', 'false'].includes(onlyComplaints)) return false;
  if (page && (!/^\d{1,5}$/u.test(page) || Number(page) < 1)) return false;
  if (limit && (!/^\d{1,3}$/u.test(limit) || Number(limit) < 1 || Number(limit) > 100))
    return false;
  const from = startDate ? day(startDate) : undefined;
  const to = endDate ? day(endDate) : undefined;
  if ((startDate && !Number.isFinite(from)) || (endDate && !Number.isFinite(to)) || from > to)
    return false;
  if (
    withDailySeries &&
    from !== undefined &&
    (to ?? Date.now()) - from >= 366 * millisecondsPerDay
  )
    return false;
  return true;
}

module.exports = (req, res, next) => {
  authenticate(req, res, (error) => {
    if (error) return next(error);
    if (req.user?.type !== 'owner' || !req.user.businessId) {
      return res.status(403).json({ success: false, message: 'Business owner required' });
    }
    const dailySeries =
      ['/api/overview', '/api/sentiment'].includes(req.baseUrl) && req.path === '/trends';
    if (!validQuery(req.query, dailySeries)) {
      return res.status(400).json({ success: false, message: 'Invalid analytics filters' });
    }
    res.set('Cache-Control', 'no-store');
    return next();
  });
};
