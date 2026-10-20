import React from 'react';
import { useProductView } from '../../app/providers/ProductProvider.jsx';
import { overviewDateLabel } from './OverviewControls.jsx';
export default function ScopedInsights({ kind, children }) {
  const { dashboard, language, tr, formatNumber } = useProductView();
  if (!dashboard?.isFiltered) return children;
  const ar = language === 'ar',
    r = dashboard.report,
    f = dashboard.filters,
    n = (value) =>
      new Intl.NumberFormat(ar ? 'ar-EG' : 'en-US', { maximumFractionDigits: 0 }).format(value),
    pct = (value) => n(Math.round(value)) + (ar ? '٪' : '%');
  const titles = {
    daily: tr('AI Daily Insight'),
    aspects: tr('Aspect scores'),
    insights: tr('Key insights'),
    recommendations: tr('What to do next'),
    branches: ar ? 'أداء الفرع' : 'Branch performance',
  };
  const descriptions = {
    daily: ar
      ? 'ملخص الذكاء الاصطناعي غير متاح لهذا الاختيار في المعاينة. يمكنك مراجعة آراء العملاء المتاحة.'
      : 'An AI summary is not available for this selection. You can review the available customer feedback.',
    aspects: ar
      ? 'لا تتوفر تقييمات تفصيلية للجوانب ضمن هذه الفترة في بيانات المعاينة.'
      : 'Detailed aspect scores are unavailable for this period in the preview data.',
    insights: ar
      ? 'لا تتوفر رؤى تفصيلية لهذا الفرع والفترة في بيانات المعاينة.'
      : 'Detailed insights are unavailable for this branch and period in the preview data.',
    recommendations: ar
      ? 'لا توجد توصيات مرتبطة بهذا الاختيار في بيانات المعاينة.'
      : 'No recommendations are available for this selection in the preview data.',
  };
  const empty = !r.total;
  return (
    <>
      <div className="scope-heading">
        <h2>{titles[kind]}</h2>
        <p>
          {tr(f.branch === 'all' ? 'All 3 branches' : f.branch)} · {overviewDateLabel(f, language)}
        </p>
      </div>
      {kind === 'branches' && !empty ? (
        <div className="scoped-branch-rows">
          {r.branches.map((branch) => (
            <div key={branch.branch}>
              <div>
                <strong>{tr(branch.branch)}</strong>
                <b>{pct(branch.positivePercent)}</b>
              </div>
              <p>
                {n(branch.total)} {tr('responses')} · {tr('Positive sentiment')}
              </p>
              <div className="scoped-branch-track">
                <span style={{ width: branch.positivePercent + '%' }} />
              </div>
              <small>
                {tr('Customer satisfaction')}:{' '}
                {branch.rating === null
                  ? '—'
                  : formatNumber(branch.rating.toFixed(1)) + ' / ' + formatNumber(5)}
              </small>
            </div>
          ))}
        </div>
      ) : (
        <div className="scoped-insight-empty">
          <span className="scoped-empty-mark" aria-hidden="true">
            —
          </span>
          <strong>
            {empty
              ? ar
                ? 'لا توجد ردود في هذه الفترة'
                : 'No responses in this period'
              : ar
                ? 'لا تتوفر بيانات تفصيلية'
                : 'Detailed data unavailable'}
          </strong>
          <p>
            {empty
              ? ar
                ? 'اختر فرعًا أو فترة أخرى لعرض البيانات.'
                : 'Choose another branch or period to see available data.'
              : descriptions[kind]}
          </p>
        </div>
      )}
      <p className="scoped-data-note">
        {ar
          ? 'بيانات معاينة تجريبية للفرع والفترة المحددين'
          : 'Preview data for the selected branch and period'}
      </p>
    </>
  );
}
