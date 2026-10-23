const destinations = {
  Surveys: 'survey-all',
  'Create Survey': 'survey-create',
  'Create survey': 'survey-create',
  'View All Responses': 'feedbacks',
  'View all responses': 'feedbacks',
  Analytics: 'analytics-sentiment',
  'Compare branches': 'analytics-comparison',
  Reports: 'reports',
  'Generate AI Report': 'reports?generate=1',
  'All responses': 'feedbacks',
  'All feedbacks': 'feedbacks',
  Feedbacks: 'feedbacks',
  'Feedbacks 12': 'feedbacks',
  'Explore all 1,250 reviews': 'feedbacks',
  'View Related Responses': 'feedbacks',
  'NUVIA Assistant': 'nuvia-assistant',
  Overview: 'dashboard',
  'View results': 'analytics-sentiment',
};
const normalize = (label) =>
  String(label)
    .replace(/[→←↑↓↗↖]/g, '')
    .replace(/\s+/g, ' ')
    .trim();
export function routeForAction(label, tr = (text) => text) {
  const value = normalize(label);
  const key = Object.keys(destinations).find(
    (key) =>
      normalize(key) === value ||
      normalize(tr(key)) === value ||
      normalize(tr(key + ' →')) === value ||
      normalize(tr(key + ' ↗')) === value,
  );
  return key ? '#/' + destinations[key] : null;
}
