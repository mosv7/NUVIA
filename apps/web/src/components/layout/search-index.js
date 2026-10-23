import { feedbackRows } from '../../features/feedback/feedback-data.js';
import { reportIds, getReport } from '../../features/reports/preview/report-library.js';
import { getReportDetails } from '../../features/reports/preview/report-details-data.js';
import arabic from '../../lib/i18n/product-ar.json';
export function normalizeSearch(value) {
  return String(value)
    .normalize('NFKC')
    .toLowerCase()
    .replace(/[\u064b-\u065f\u0640]/g, '')
    .replace(/[أإآ]/g, 'ا')
    .replace(/ى/g, 'ي')
    .replace(/[٠-٩]/g, (n) => String('٠١٢٣٤٥٦٧٨٩'.indexOf(n)))
    .replace(/\s+/g, ' ')
    .trim();
}
const local = (text) => arabic[text] || text;
export function buildSearchIndex(language = 'en', storage) {
  const t = (text) => (language === 'ar' ? local(text) : text);
  const pages = [
    ['Overview', 'dashboard', 'daily insight sentiment responses'],
    ['Feedbacks', 'feedbacks', 'customer responses reviews'],
    ['Analytics', 'analytics-sentiment', 'positive negative sentiment'],
    ['Aspect analytics', 'analytics-aspects', 'speed service price food cleanliness'],
    ['Topic analytics', 'analytics-topics', 'topics waiting times'],
    ['Trends', 'analytics-trends', 'time trends comparison'],
    ['Branch comparison', 'analytics-comparison', 'branches dimensions selected dimension values'],
    ['Reports', 'reports', 'reports analysis'],
    ['Surveys', 'survey-all', 'manage surveys live draft paused closed'],
    ['Create Survey', 'survey-create', 'templates questions'],
    ['NUVIA AI Survey Generator', 'survey-ai', 'business type survey language question count'],
    ['NUVIA Assistant', 'nuvia-assistant', 'ask feedback answers verify'],
  ];
  const entries = pages.map(([title, path, keywords]) => ({
    id: path,
    title: t(title),
    section: t(title),
    description: '',
    path: '#/' + path,
    search: normalizeSearch([title, local(title), keywords].join(' ')),
  }));
  for (const id of reportIds) {
    const report = getReport(id),
      details = getReportDetails(id);
    entries.push({
      id: 'report-' + id,
      title: t(report.title),
      section: t('Reports'),
      description: t(report.period) + ' · ' + t(report.branch),
      path: '#/report-details?id=' + id,
      search: normalizeSearch(
        [
          report.title,
          local(report.title),
          'Reports',
          local('Reports'),
          report.summary,
          ...Object.values(details.nodes).flatMap((node) => [node.en, node.ar]),
        ].join(' '),
      ),
    });
  }
  for (const row of feedbackRows)
    entries.push({
      id: 'feedback-' + row.id,
      title: row.preview || row.text,
      section: t('Feedbacks'),
      description: '#' + row.id + ' · ' + t(row.branch),
      path: '#/feedback-details?id=' + row.id,
      search: normalizeSearch(
        [
          row.text,
          row.id,
          row.branch,
          local(row.branch),
          row.sentiment,
          local(row.sentiment),
          ...row.aspects.flatMap((aspect) => [aspect, local(aspect)]),
        ].join(' '),
      ),
    });
  const surveys = [
    ['Customer experience survey', 'Live'],
    ['Quick satisfaction check', 'Live'],
    ['Seasonal menu feedback', 'Draft'],
    ['New branch welcome', 'Draft'],
    ['Coffee & service check-in', 'Paused'],
    ['Summer customer pulse', 'Closed'],
  ];
  for (const [name, status] of surveys) {
    let records = [{ id: 'original', status }];
    try {
      records = JSON.parse(storage?.getItem('nuvia-survey-row:' + name)) || records;
    } catch {
      /* Missing or invalid local preferences use the default state. */
    }
    for (const record of records.filter((item) => !item.archived && !item.deleted))
      entries.push({
        id: 'survey-' + name + '-' + record.id,
        title: t(name) + (record.copied ? ' — ' + (language === 'ar' ? 'نسخة' : 'Copy') : ''),
        section: t('Surveys'),
        description: t(record.status),
        path: '#/survey-edit',
        search: normalizeSearch(
          [name, local(name), record.status, local(record.status), 'survey', local('Surveys')].join(
            ' ',
          ),
        ),
      });
  }
  return entries;
}
export function searchIndex(entries, query, limit = 12) {
  const q = normalizeSearch(query);
  if (!q) return [];
  const terms = q.split(' ');
  return entries
    .filter((entry) =>
      terms.every(
        (term) => entry.search.includes(term) || normalizeSearch(entry.title).includes(term),
      ),
    )
    .map((entry) => ({
      ...entry,
      rank:
        normalizeSearch(entry.title) === q
          ? 100
          : normalizeSearch(entry.title).startsWith(q)
            ? 70
            : normalizeSearch(entry.title).includes(q)
              ? 50
              : 10,
    }))
    .sort((a, b) => b.rank - a.rank)
    .slice(0, limit);
}
