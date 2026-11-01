const { body, query } = require('express-validator');

const scopeFields = ['branchId', 'from', 'to'];
const validDay = (value) =>
  typeof value === 'string' &&
  /^\d{4}-\d{2}-\d{2}$/u.test(value) &&
  Number.isFinite(Date.parse(`${value}T00:00:00.000Z`)) &&
  new Date(`${value}T00:00:00.000Z`).toISOString().slice(0, 10) === value;

function validRequest(value, answer = false) {
  const fields = answer ? [...scopeFields, 'question', 'locale', 'previousQuestion'] : scopeFields;
  if (!value || typeof value !== 'object' || Array.isArray(value)) return false;
  if (Object.keys(value).some((key) => !fields.includes(key))) return false;
  if (
    'branchId' in value &&
    (typeof value.branchId !== 'string' || !/^[a-f\d]{24}$/iu.test(value.branchId))
  )
    return false;
  if (['from', 'to'].some((key) => key in value && !validDay(value[key]))) return false;
  if (value.from && value.to && value.from > value.to) return false;
  if (answer) {
    if (!['en', 'ar'].includes(value.locale)) return false;
    for (const key of ['question', 'previousQuestion']) {
      if (key === 'previousQuestion' && !(key in value)) continue;
      if (typeof value[key] !== 'string' || !value[key].trim() || [...value[key]].length > 1000)
        return false;
    }
  }
  return true;
}

const contextQuery = query()
  .custom((value) => validRequest(value))
  .withMessage('Invalid assistant filters');
const answerBody = [
  query()
    .custom((value) => validRequest(value) && Object.keys(value).length === 0)
    .withMessage('Unexpected assistant query'),
  body()
    .custom((value) => validRequest(value, true))
    .withMessage('Invalid assistant request'),
];
module.exports = { contextQuery, answerBody };
