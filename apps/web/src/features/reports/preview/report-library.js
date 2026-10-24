import { getReportDetails } from './report-details-data.js';
export const reportIds = ['september', 'cairo', 'service', 'august'];
export const reportLibrary = {
  september: {
    id: 'september',
    title: 'September customer experience',
    period: '1–30 September 2026',
    branch: 'All 3 branches',
    language: 'English',
    summary: 'Food quality leads. Longer waits in Cairo and unclear combo pricing need attention.',
    metrics: [
      ['Customer reviews', '1,250'],
      ['Branches covered', '3'],
      ['Cairo delay complaints', '104'],
    ],
    recommendations: [
      'Shorten the evening queue at Cairo',
      'Make combo pricing clear before customers order',
      'Replicate El Zamalek’s service playbook',
    ],
  },
  cairo: {
    id: 'cairo',
    title: 'Cairo service speed review',
    period: '1–30 September 2026',
    branch: 'Cairo',
    language: 'English',
    summary:
      'Service speed has the lowest positive share: 42% across 360 mentions. Cairo delay complaints doubled to 104; one customer describes a 25-minute wait. [D1, D3, E1]',
    metrics: [
      ['Customer reviews', '500'],
      ['Positive sentiment', '62%'],
      ['Cairo delay complaints', '104'],
    ],
    strength:
      'The customer praised the coffee and the welcoming team while describing a long wait.',
    pain: 'Slow service, especially in Cairo',
    recommendations: [
      'Shorten the evening queue at Cairo',
      'Add peak-hour coverage and review the order handoff. Track delay mentions in the next reporting period to see whether the customer experience improves.',
    ],
    evidence: 'The coffee is good, but we waited 25 minutes for the order.',
    source: 'Google · Cairo · Sep 18, 2026 · Arabic',
  },
  service: {
    id: 'service',
    title: 'Service & hospitality insights',
    period: '1–30 September 2026',
    branch: 'El Zamalek',
    language: 'English',
    summary: 'Explore staff friendliness and the service practices customers value at El Zamalek.',
    metrics: [
      ['Customer reviews', '450'],
      ['Positive sentiment', '82%'],
      ['Branches covered', '1'],
    ],
    strength: 'The team remembered my order and made me feel welcome.',
    pain: 'Compare queue handling and welcome routines before rolling changes out.',
    recommendations: [
      'Replicate El Zamalek’s service playbook',
      'Document how the team welcomes regular customers and coordinates service. Test those routines in Cairo and Alex while preserving each branch’s character.',
    ],
    evidence: 'The team remembered my order and made me feel welcome.',
    source: 'Post-visit survey · El Zamalek · Sep 24, 2026 · English',
  },
  august: {
    id: 'august',
    title: 'August customer experience',
    period: '1–31 August 2026',
    branch: 'All 3 branches',
    language: 'Arabic',
    summary:
      'The available August comparison records 52 Cairo delay complaints. Total review volume and aspect scores were not supplied.',
    metrics: [
      ['Customer reviews', 'Not supplied'],
      ['Branches covered', '3'],
      ['Cairo delay complaints', '52'],
    ],
    strength:
      'No additional figures were supplied for this sample. Missing metrics are not estimated.',
    pain: 'A rising complaint count is a signal to investigate, not a complaint rate. August’s total review volume is not provided.',
    recommendations: [
      'Review the available delay evidence before comparing complaint rates between months.',
    ],
    evidence: null,
    source: null,
  },
};
export const getReport = (id) => {
  const report = reportLibrary[id] || reportLibrary.september;
  if (report.id === 'september') return report;
  const details = getReportDetails(report.id),
    copy = (node) => details.nodes['300:' + node].en;
  return {
    ...report,
    summary: copy(1168),
    metrics: [
      ['Customer reviews', String(details.reviews)],
      ['Branches covered', String(details.branches)],
      ['Wait / delay mentions', String(details.delay[1])],
    ],
    recommendations: [copy(1277), copy(1286), copy(1295)],
  };
};
