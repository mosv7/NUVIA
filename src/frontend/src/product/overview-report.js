import { feedbackRows } from './feedback-data.js';
export const defaultOverviewFilters = { branch: 'all', start: '2026-09-12', end: '2026-10-09' };
export const overviewBranches = ['Cairo', 'El Zamalek', 'Alex'];
const addDays = (iso, n) => {
  const d = new Date(iso + 'T12:00:00Z');
  d.setUTCDate(d.getUTCDate() + n);
  return d.toISOString().slice(0, 10);
};
export function todayInCairo() {
  return new Intl.DateTimeFormat('en-CA', {
    timeZone: 'Africa/Cairo',
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
  }).format(new Date());
}
export function overviewPreset(preset, today = todayInCairo()) {
  if (preset === 'default')
    return { start: defaultOverviewFilters.start, end: defaultOverviewFilters.end };
  if (preset === 'today') return { start: today, end: today };
  if (preset === 'month') return { start: today.slice(0, 8) + '01', end: today };
  return { start: addDays(today, preset === '7' ? -6 : -29), end: today };
}
// Local demonstration aggregates preserve the overview's original four weekly totals.
const weekly = [
  { positive: 190, neutral: 37, negative: 21 },
  { positive: 229, neutral: 42, negative: 23 },
  { positive: 255, neutral: 46, negative: 25 },
  { positive: 300, neutral: 50, negative: 30 },
];
const aggregates = [];
weekly.forEach((week, w) => {
  const buckets = Array.from({ length: 21 }, () => ({
    positive: 0,
    neutral: 0,
    negative: 0,
    mixed: 0,
  }));
  for (const tone of ['positive', 'neutral', 'negative'])
    for (let n = 0; n < week[tone]; n++) buckets[(n * 5 + w * 3) % 21][tone]++;
  buckets.forEach((bucket, index) => {
    const count = bucket.positive + bucket.neutral + bucket.negative;
    if (!count) return;
    const branch = overviewBranches[index % 3];
    aggregates.push({
      ...bucket,
      date: addDays('2026-09-12', w * 7 + Math.floor(index / 3)),
      branch,
      total: count,
      rating: branch === 'Cairo' ? 4.4 : branch === 'El Zamalek' ? 4.8 : 4.6,
      starts: Math.round(count / 0.86),
    });
  });
});
feedbackRows.forEach((row) =>
  aggregates.push({
    date: row.date,
    branch: row.branch,
    total: 1,
    positive: row.sentiment === 'Positive' ? 1 : 0,
    neutral: row.sentiment === 'Neutral' ? 1 : 0,
    negative: row.sentiment === 'Negative' ? 1 : 0,
    mixed: row.sentiment === 'Mixed' ? 1 : 0,
    rating: null,
    starts: null,
  }),
);
function summarize(rows) {
  const result = {
    total: 0,
    positive: 0,
    neutral: 0,
    negative: 0,
    mixed: 0,
    rating: null,
    completion: null,
  };
  let ratingSum = 0,
    rated = 0,
    starts = 0,
    completed = 0;
  for (const row of rows) {
    for (const key of ['total', 'positive', 'neutral', 'negative', 'mixed'])
      result[key] += row[key];
    if (row.rating !== null) {
      ratingSum += row.rating * row.total;
      rated += row.total;
    }
    if (row.starts !== null) {
      starts += row.starts;
      completed += row.total;
    }
  }
  result.rating = rated ? ratingSum / rated : null;
  result.completion = starts ? (100 * completed) / starts : null;
  result.positivePercent = result.total ? (100 * result.positive) / result.total : 0;
  return result;
}
export function getOverviewReport(filters) {
  const selected = aggregates.filter(
    (row) =>
      (filters.branch === 'all' || row.branch === filters.branch) &&
      row.date >= filters.start &&
      row.date <= filters.end,
  );
  const days = Math.max(
    1,
    Math.round(
      (new Date(filters.end + 'T12:00:00Z') - new Date(filters.start + 'T12:00:00Z')) / 86400000,
    ) + 1,
  );
  const bins = Math.min(4, days),
    periods = Array.from({ length: bins }, (_, index) => {
      const start = addDays(filters.start, Math.floor((index * days) / bins)),
        end = addDays(filters.start, Math.floor(((index + 1) * days) / bins) - 1);
      return {
        start,
        end,
        ...summarize(selected.filter((row) => row.date >= start && row.date <= end)),
      };
    });
  return {
    ...summarize(selected),
    periods,
    branches: overviewBranches
      .filter((branch) => filters.branch === 'all' || filters.branch === branch)
      .map((branch) => ({ branch, ...summarize(selected.filter((row) => row.branch === branch)) })),
    responses: feedbackRows.filter(
      (row) =>
        (filters.branch === 'all' || row.branch === filters.branch) &&
        row.date >= filters.start &&
        row.date <= filters.end,
    ),
  };
}
