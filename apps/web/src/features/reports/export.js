const csvCell = (value) => {
  const text = value == null ? '' : String(value);
  const safe = /^[\t\r\n]|^\s*[=+\-@]/u.test(text) ? `'${text}` : text;
  return `"${safe.replaceAll('"', '""')}"`;
};

export function reportsCsv(reports = []) {
  const rows = [
    ['Report', 'Period', 'Responses', 'Created'],
    ...reports.map((r) => [r.reportName, r.periodCovered, r.totalReviewsAnalyzed, r.createdAt]),
  ];
  return `\uFEFF${rows.map((row) => row.map(csvCell).join(',')).join('\r\n')}`;
}

export function downloadReportsCsv(reports = []) {
  const blob = new Blob([reportsCsv(reports)], { type: 'text/csv;charset=utf-8' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = 'NUVIA-reports.csv';
  document.body.appendChild(link);
  link.click();
  link.remove();
  setTimeout(() => URL.revokeObjectURL(url), 0);
}
