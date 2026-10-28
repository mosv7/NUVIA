// Generated JSON schemas are canonical; semantic checks bind results to this request only.
const Ajv = require('ajv/dist/2020');
const schemas = require('./contracts.json');
const ajv = new Ajv({ strict: false, allErrors: false, unicodeRegExp: true });
const requests = Object.fromEntries(
  Object.entries(schemas.requests).map(([k, v]) => [k, ajv.compile(v)]),
);
const responses = Object.fromEntries(
  Object.entries(schemas.responses).map(([k, v]) => [k, ajv.compile(v)]),
);
const capabilitySchema = ajv.compile(schemas.capabilities);
const operations = Object.keys(requests);

function validateInput(operation, payload) {
  if (!requests[operation]?.(payload)) return false;
  const nonblank = (value) => {
    if (typeof value === 'string') return value.trim().length > 0;
    if (Array.isArray(value)) return value.every(nonblank);
    if (value && typeof value === 'object') return Object.values(value).every(nonblank);
    return true;
  };
  if (!nonblank(payload)) return false;
  return !payload.texts || new Set(payload.texts.map((e) => e.id)).size === payload.texts.length;
}

function validateOutput(operation, response, payload) {
  if (operation === 'capabilities') {
    return (
      capabilitySchema(response) &&
      Object.values(response.capabilities).every((c) => c.ready === (c.reason === null))
    );
  }
  if (!responses[operation]?.(response)) return false;
  const result = response.result;
  if (operation === 'survey-suggestions') {
    const labels = result.questions.map((q) => q.text.trim().replace(/\s+/gu, ' ').toLowerCase());
    return labels.length === payload.count && new Set(labels).size === labels.length;
  }
  const evidence = new Map(payload.texts.map((e) => [e.id, e.text]));
  if (operation === 'analyze') {
    if (result.items.length !== payload.texts.length) return false;
    return result.items.every((item, i) => {
      if (item.id !== payload.texts[i].id) return false;
      if (new Set(item.mentions.map((m) => m.id)).size !== item.mentions.length) return false;
      if (
        !item.mentions.every(
          (m) => [...evidence.get(item.id)].slice(m.start, m.end).join('') === m.text,
        )
      )
        return false;
      const contributing = item.mentions.filter((m) => m.accepted);
      const polarities = new Set(contributing.map((m) => m.sentiment));
      const sentiment =
        polarities.has('positive') && polarities.has('negative')
          ? 'mixed'
          : ['positive', 'negative', 'neutral'].find((p) => polarities.has(p)) || null;
      return (
        item.sentiment === sentiment &&
        item.reason === (sentiment ? null : 'insufficient_evidence') &&
        JSON.stringify(item.contributing_ids) === JSON.stringify(contributing.map((m) => m.id)) &&
        item.excluded_count === item.mentions.length - contributing.length
      );
    });
  }
  if (operation === 'answers' && result.items.length > 0 !== (result.status === 'answered'))
    return false;
  const groups =
    operation === 'reports'
      ? [result.strengths, result.problems, result.suggested_actions]
      : [result.items];
  return groups.flat().every((claim) => {
    if (!claim.citations.every((c) => c.quote.trim() && evidence.get(c.id)?.includes(c.quote)))
      return false;
    if (claim.text && !claim.citations.some((c) => c.quote.includes(claim.text))) return false;
    return !claim.suggestion || !/[\d%٪]/u.test(claim.suggestion);
  });
}

module.exports = { validateInput, validateOutput, operations };
