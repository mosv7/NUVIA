import { feedbackRows } from '../feedback/feedback-data.js';
import { normalizeSearch } from '../../components/layout/search-index.js';
export const actionItems = [
  {
    id: 'wait',
    title: 'Shorten the evening queue at Cairo',
    branch: 'Cairo',
    priority: 'High priority',
    summary: 'Add peak-hour coverage and review the order handoff.',
  },
  {
    id: 'pricing',
    title: 'Make combo pricing clearer',
    branch: 'All branches',
    priority: 'Medium',
    summary: 'Show the full combo price consistently before customers order.',
  },
  {
    id: 'service',
    title: 'Replicate El Zamalek’s service playbook',
    branch: 'El Zamalek',
    priority: 'Opportunity',
    summary: 'Document welcoming-service routines and share useful practices.',
  },
];
export const getAction = (id) => actionItems.find((item) => item.id === id) || actionItems[0];
export function getActionEvidence(id) {
  return feedbackRows.filter((row) => {
    const text = normalizeSearch(row.text + ' ' + row.aspects.join(' '));
    return id === 'pricing'
      ? /price|pricing|cost|combo|سعر|اسعار/.test(text)
      : id === 'service'
        ? row.branch === 'El Zamalek' && /welcom|friend|remember|لطيف|ودود|ترحيب/.test(text)
        : row.branch === 'Cairo' && /wait|delay|queue|انتظر|تاخر/.test(text);
  });
}
