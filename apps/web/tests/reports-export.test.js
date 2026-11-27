import { expect, it } from 'vitest';
import { reportsCsv } from '../src/features/reports/export.js';

it('exports UTF-8 report rows with aligned columns and preserves quoted Arabic names', () => {
  const csv = reportsCsv([
    {
      reportName: 'تقرير "الخدمة"',
      periodCovered: '2026-10-27',
      totalReviewsAnalyzed: 2,
      createdAt: '2026-10-27T12:00:00.000Z',
    },
  ]);
  expect(csv).toBe(
    '\uFEFF"Report","Period","Responses","Created"\r\n"تقرير ""الخدمة""","2026-10-27","2","2026-10-27T12:00:00.000Z"',
  );
});

it('keeps numeric-looking report names as text for spreadsheet readers', () => {
  expect(reportsCsv([{ reportName: ' +12' }])).toContain('\r\n"\' +12","","",""');
});
