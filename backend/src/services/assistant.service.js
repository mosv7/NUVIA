const CustomerResponse = require('../models/customerResponse.model');
const Branch = require('../models/branch.model');
const { requireBusinessId, oid } = require('./surveyAccess');
const { fail } = require('../utils/errors');
const { callService, AiError } = require('../integrations/ai-service/client');

const CANDIDATE_LIMIT = 500;
const EVIDENCE_LIMIT = 10;
const EXCERPT_LIMIT = 2000;
const DAY_MS = 86400000;
const analysisFinal = { 'analysis.status': { $in: ['completed', 'partial'] } };
const accepted = {
  ...analysisFinal,
  'analysis.provenance.qualityAccepted': true,
  'analysis.provenance.qualityStatus': 'accepted',
};
const written = {
  $expr: { $gt: [{ $strLenCP: { $trim: { input: { $ifNull: ['$feedbackText', ''] } } } }, 0] },
};

async function scopedFilter(user, scope) {
  const businessId = oid(requireBusinessId(user));
  const filter = { businessId };
  if (scope.branchId) {
    if (!(await Branch.exists({ _id: scope.branchId, businessId })))
      throw fail('Branch not found', 404);
    filter.branchId = oid(scope.branchId);
  }
  if (scope.from || scope.to) {
    filter.submittedAt = {};
    if (scope.from) filter.submittedAt.$gte = new Date(`${scope.from}T00:00:00.000Z`);
    if (scope.to)
      filter.submittedAt.$lt = new Date(Date.parse(`${scope.to}T00:00:00.000Z`) + DAY_MS);
  }
  return filter;
}

// Counts cover the whole selected scope, independently of the bounded evidence sample.
// Unreviewed model results never become accepted sentiment or negative-aspect metrics.
async function getMetrics(filter) {
  const [result] = await CustomerResponse.aggregate([
    { $match: filter },
    {
      $facet: {
        totals: [{ $count: 'count' }],
        written: [{ $match: written }, { $count: 'count' }],
        statuses: [
          { $group: { _id: { $ifNull: ['$analysis.status', 'pending'] }, count: { $sum: 1 } } },
        ],
        accepted: [{ $match: accepted }, { $count: 'count' }],
        baseline: [
          {
            $match: {
              ...analysisFinal,
              'analysis.provenance.qualityStatus': 'baseline',
              'analysis.provenance.qualityAccepted': false,
            },
          },
          { $count: 'count' },
        ],
        sentiments: [
          { $match: accepted },
          { $group: { _id: '$analysis.overallSentiment', count: { $sum: 1 } } },
        ],
        negativeAspects: [
          { $match: accepted },
          { $unwind: '$analysis.aspects' },
          { $match: { 'analysis.aspects.polarity': 'negative' } },
          { $group: { _id: { response: '$_id', name: '$analysis.aspects.name' } } },
          { $group: { _id: '$_id.name', count: { $sum: 1 } } },
          { $sort: { count: -1, _id: 1 } },
          { $limit: 10 },
        ],
      },
    },
  ]);
  const totalResponses = result.totals[0]?.count || 0;
  const acceptedCount = result.accepted[0]?.count || 0;
  const analysisStatuses = Object.fromEntries(
    ['pending', 'processing', 'completed', 'partial', 'failed', 'skipped'].map((key) => [key, 0]),
  );
  for (const row of result.statuses)
    if (Object.hasOwn(analysisStatuses, row._id)) analysisStatuses[row._id] = row.count;
  Object.assign(analysisStatuses, {
    accepted: acceptedCount,
    baseline: result.baseline[0]?.count || 0,
    unaccepted: totalResponses - acceptedCount,
  });
  const sentiments = { positive: 0, negative: 0, neutral: 0, mixed: 0 };
  for (const row of result.sentiments)
    if (Object.hasOwn(sentiments, row._id)) sentiments[row._id] = row.count;
  return {
    totalResponses,
    writtenResponses: result.written[0]?.count || 0,
    analysisStatuses,
    sentiments,
    negativeAspects: result.negativeAspects.map((row) => ({ name: row._id, count: row.count })),
  };
}

async function context(user, scope = {}) {
  const filter = await scopedFilter(user, scope);
  const [rows, metrics] = await Promise.all([
    Branch.find({ businessId: filter.businessId }).select('name').sort({ name: 1, _id: 1 }).lean(),
    getMetrics(filter),
  ]);
  return { branches: rows.map((row) => ({ id: String(row._id), name: row.name })), metrics };
}

function normalize(text) {
  return text
    .normalize('NFKC')
    .toLowerCase()
    .replace(/[\u064B-\u065F\u0670\u0640]/gu, '')
    .replace(/[أإآٱ]/gu, 'ا')
    .replace(/ى/gu, 'ي')
    .replace(/ة/gu, 'ه');
}
const stopWords = new Set(
  normalize(
    'redacted aspect what which are is the a an and or of to for about on in do does did how why me us tell show give please customer customers feedback say saying most common any some this that it its with was were can could would should been has have all than then more need needs improvement improve complaint complaints overview summary summarize recent overall main themes جانب ماذا ما هي هو هل من في عن علي الى الي هذا هذه انا نحن لنا لي كيف لماذا اي اريد اعرض اظهر اهم اكثر شيوعا شكاوي شكاوى العملاء عملاء اراء ملاحظات تعليقات ملخص لخص عامه عام تحسين التحسين يحتاج تحتاج',
  ).split(/\s+/u),
);
function keywords(text) {
  return [
    ...new Set(
      (normalize(text).match(/[\p{L}\p{N}]+/gu) || []).filter(
        (word) =>
          word.length >= 2 && !stopWords.has(word) && !stopWords.has(word.replace(/^ال/u, '')),
      ),
    ),
  ];
}
function isOverview(question) {
  const text = normalize(question);
  return (
    /(?:overview|summary|summari[sz]e|common complaints|needs? improvement|customer feedback|ملخص|لخص|شكاو|تحسين|اراء العملاء|ملاحظات العملاء)/u.test(
      text,
    ) && keywords(question).length === 0
  );
}

const escapeRegex = (value) => value.replace(/[.*+?^${}()|[\]\\]/gu, '\\$&');
function redactor(names) {
  const alternatives = names
    .map((name) => name.trim())
    .filter(Boolean)
    .sort((a, b) => b.length - a.length)
    .map(escapeRegex);
  const namePattern = alternatives.length ? new RegExp(alternatives.join('|'), 'giu') : null;
  return (text) => {
    const clean = String(text)
      .replace(/[\p{L}\p{N}._%+-]+@[\p{L}\p{N}.-]+\.[\p{L}]{2,}/gu, '[redacted]')
      .replace(/\+?[\p{Nd}](?:[\p{Nd}\s().-]{5,}[\p{Nd}])/gu, (value) =>
        (value.match(/\p{Nd}/gu) || []).length >= 7 ? '[redacted]' : value,
      );
    return namePattern ? clean.replace(namePattern, '[redacted]') : clean;
  };
}

function excerpt(text, terms) {
  const points = [...text];
  if (points.length <= EXCERPT_LIMIT) return text.trim();
  // Keep a relevant term visible even when it occurs after the first 2000 characters.
  const mapped = [];
  let flattened = '';
  points.forEach((point, index) => {
    const normalized = normalize(point);
    flattened += normalized;
    for (let i = 0; i < normalized.length; i += 1) mapped.push(index);
  });
  const hits = terms.map((term) => flattened.indexOf(term)).filter((index) => index >= 0);
  const first = hits.length ? mapped[Math.min(...hits)] : 0;
  const start = Math.max(0, Math.min(first - 200, points.length - EXCERPT_LIMIT));
  return points
    .slice(start, start + EXCERPT_LIMIT)
    .join('')
    .trim();
}

async function answer(user, input, options = {}) {
  const filter = await scopedFilter(user, input);
  const [metrics, candidates] = await Promise.all([
    getMetrics(filter),
    CustomerResponse.find({ ...filter, ...written })
      .select('number feedbackText respondent.name analysis.aspects.name analysis.aspects.polarity')
      .sort({ submittedAt: -1, _id: -1 })
      .limit(CANDIDATE_LIMIT)
      .lean(),
  ]);
  if (options.signal?.aborted) throw new AiError('AI_CANCELLED', 499);
  const names = [...new Set(candidates.map((row) => row.respondent?.name).filter(Boolean))];
  const scrub = redactor(names);
  const question = [...scrub(input.question.trim())].slice(0, 1000).join('');
  const previous = input.previousQuestion ? scrub(input.previousQuestion.trim()) : '';
  const terms = keywords(`${question} ${previous}`);
  const overview = isOverview(question);
  const negativeOverview = overview && /complaint|improv|شكاو|تحسين/u.test(normalize(question));
  const ranked = candidates
    .map((row, index) => {
      const text = scrub(row.feedbackText);
      const normalized = normalize(text);
      const labels = (row.analysis?.aspects || [])
        .filter((a) => a.polarity === 'negative')
        .map((a) => normalize(a.name));
      const score = terms.reduce(
        (sum, term) =>
          sum +
          (normalized.includes(term) ? 2 : 0) +
          (labels.some((label) => label.includes(term)) ? 1 : 0),
        negativeOverview ? labels.length : 0,
      );
      return { row, index, score, text: excerpt(text, terms) };
    })
    .filter((item) => item.text && (overview || item.score > 0))
    .sort((a, b) => b.score - a.score || a.index - b.index)
    .slice(0, EVIDENCE_LIMIT);
  const coverage = {
    candidateLimit: CANDIDATE_LIMIT,
    candidatesScanned: candidates.length,
    evidenceCount: ranked.length,
    sampled: true,
  };
  if (!ranked.length)
    return { status: 'insufficient_evidence', items: [], metrics, coverage, provenance: null };
  const evidence = new Map(ranked.map((entry, index) => [`e${index + 1}`, entry]));
  const priorRoom = Math.max(0, 1000 - [...question].length - 40);
  const combined =
    previous && priorRoom
      ? `Previous question: ${[...previous].slice(0, priorRoom).join('')}\nCurrent question: ${question}`
      : question;
  const payload = {
    texts: [...evidence].map(([id, entry]) => ({ id, text: entry.text })),
    locale: input.locale,
    question: combined,
  };
  const upstream = await callService('answers', payload, options);
  if (options.signal?.aborted) throw new AiError('AI_CANCELLED', 499);
  // Re-read the current scoped sources after inference; deleted/moved/changed feedback cannot
  // be enriched into stale or foreign evidence links, even with a previously valid citation.
  const current = await CustomerResponse.find({
    ...filter,
    _id: { $in: ranked.map((entry) => entry.row._id) },
  })
    .select('number feedbackText respondent.name')
    .lean();
  const owned = new Map(current.map((row) => [String(row._id), row]));
  const scrubCurrent = redactor([
    ...names,
    ...current.map((row) => row.respondent?.name).filter(Boolean),
  ]);
  const items = upstream.result.items.map((item) => ({
    text: item.text,
    citations: item.citations.map((citation) => {
      const selected = evidence.get(citation.id);
      const row = selected && owned.get(String(selected.row._id));
      if (
        !row ||
        row.feedbackText !== selected.row.feedbackText ||
        !selected.text.includes(citation.quote) ||
        !scrubCurrent(row.feedbackText).includes(citation.quote) ||
        !item.citations.some((source) => source.quote.includes(item.text))
      )
        throw new AiError('AI_UPSTREAM_INVALID', 502);
      return {
        id: citation.id,
        quote: citation.quote,
        responseId: String(row._id),
        number: row.number,
      };
    }),
  }));
  return {
    status: upstream.result.status,
    items,
    metrics,
    coverage,
    provenance: upstream.provenance,
  };
}

module.exports = { context, answer };
