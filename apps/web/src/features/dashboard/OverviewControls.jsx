import ControlIcon from '../../components/ui/ControlIcon.jsx';
import { BranchMenu } from '../../components/ui/ChoiceMenu.jsx';
import { useEffect, useRef, useState } from 'react';
import { createPortal } from 'react-dom';
import { asset } from '../../lib/assets.js';
import { useProductView } from '../../app/providers/ProductProvider.jsx';
import { defaultOverviewFilters, overviewPreset } from './overview-report.js';
import './overview-controls.css';

export function OverviewBranchSelect() {
  const { tr, dashboard } = useProductView();
  return (
    <BranchMenu
      tr={tr}
      overlay
      value={dashboard.filters.branch}
      onChange={(branch) => dashboard.setFilters((old) => ({ ...old, branch }))}
    />
  );
}
export function overviewDateLabel(filters, language) {
  const locale = language === 'ar' ? 'ar-EG' : 'en-GB';
  const date = (iso) =>
    new Date(iso + 'T12:00:00').toLocaleDateString(locale, { day: 'numeric', month: 'short' });
  const year = (iso) => Number(iso.slice(0, 4)).toLocaleString(locale, { useGrouping: false });
  return (
    date(filters.start) +
    (filters.start.slice(0, 4) === filters.end.slice(0, 4) ? '' : ', ' + year(filters.start)) +
    ' – ' +
    date(filters.end) +
    ', ' +
    year(filters.end)
  );
}
export function OverviewDateDialog({ open, onClose, filters, onApply, language, tr }) {
  const ref = useRef(null),
    [draft, setDraft] = useState(filters),
    [error, setError] = useState('');
  useEffect(() => {
    if (open) {
      setDraft({ ...filters });
      setError('');
      if (!ref.current.open) ref.current.showModal();
    } else if (ref.current?.open) ref.current.close();
  }, [open, filters]);
  const apply = (e) => {
    e.preventDefault();
    if (!draft.start || !draft.end || draft.start > draft.end) {
      setError(tr('Choose a valid start and end date.'));
      return;
    }
    onApply({ start: draft.start, end: draft.end });
    onClose();
  };
  return createPortal(
    <dialog
      ref={ref}
      className="overview-date-dialog"
      dir={language === 'ar' ? 'rtl' : 'ltr'}
      aria-labelledby="overview-period-title"
      onCancel={onClose}
      onClose={() => {
        if (open) onClose();
      }}
      onClick={(e) => {
        if (e.target === e.currentTarget) {
          const r = e.currentTarget.getBoundingClientRect();
          if (
            e.clientX < r.left ||
            e.clientX > r.right ||
            e.clientY < r.top ||
            e.clientY > r.bottom
          )
            onClose();
        }
      }}
    >
      <form onSubmit={apply}>
        <div className="overview-dialog-heading">
          <h2 id="overview-period-title">{tr('Choose date range')}</h2>
          <button
            type="button"
            className="overview-dialog-close"
            aria-label={tr('Close')}
            onClick={onClose}
          >
            ×
          </button>
        </div>
        <div className="overview-date-presets">
          {[
            ['today', 'Today'],
            ['7', 'Last 7 days'],
            ['30', 'Last 30 days'],
            ['month', 'This month'],
            ['default', 'Original period'],
          ].map(([key, label]) => (
            <button
              type="button"
              key={key}
              onClick={() => {
                setDraft((old) => ({ ...old, ...overviewPreset(key) }));
                setError('');
              }}
            >
              {tr(label)}
            </button>
          ))}
        </div>
        <div className="overview-date-fields">
          <label>
            {tr('Start date')}
            <input
              type="date"
              required
              value={draft.start}
              max={draft.end || undefined}
              onChange={(e) => setDraft((old) => ({ ...old, start: e.target.value }))}
            />
          </label>
          <label>
            {tr('End date')}
            <input
              type="date"
              required
              min={draft.start || undefined}
              value={draft.end}
              onChange={(e) => setDraft((old) => ({ ...old, end: e.target.value }))}
            />
          </label>
        </div>
        {error && (
          <p className="overview-date-error" role="alert">
            {error}
          </p>
        )}
        <div className="overview-dialog-actions">
          <button type="button" onClick={onClose}>
            {tr('Cancel')}
          </button>
          <button type="submit" className="overview-apply">
            {tr('Apply filters')}
          </button>
        </div>
      </form>
    </dialog>,
    document.body,
  );
}
function Icon({ name }) {
  return <img src={asset('dashboard/overview/' + name + '.svg')} alt="" />;
}
export function FilteredOverview() {
  const { tr, language, formatNumber, dashboard } = useProductView(),
    { filters, report, setFilters, openDate } = dashboard;
  const number = (value) =>
      new Intl.NumberFormat(language === 'ar' ? 'ar-EG' : 'en-US', {
        maximumFractionDigits: 0,
      }).format(value),
    percent = (value) => number(Math.round(value)) + (language === 'ar' ? '٪' : '%');
  const short = (iso) =>
    new Date(iso + 'T12:00:00').toLocaleDateString(language === 'ar' ? 'ar-EG' : 'en-GB', {
      day: 'numeric',
      month: 'short',
    });
  const tones = [
    ['positive', 'Positive', '#1e68ef'],
    ['neutral', 'Neutral', '#a9c0e4'],
    ['negative', 'Negative', 'rgba(198,40,40,.78)'],
    ['mixed', 'Mixed', '#b5801b'],
  ];
  let degrees = 0;
  const slices = tones
    .filter(([key]) => report[key])
    .map(([key, label, color]) => {
      const start = degrees;
      degrees += (report[key] / report.total) * 360;
      return color + ' ' + start + 'deg ' + degrees + 'deg';
    });
  return (
    <section className="overview-filtered">
      <div className="overview-filtered-heading">
        <div>
          <h1>{tr('Overview')}</h1>
          <p>{tr('Welcome back, Sara. Here’s what your customers are telling you.')}</p>
        </div>
        <div className="overview-filtered-actions">
          <label className="overview-filter-branch">
            <ControlIcon name="branch" />
            <span>{tr(filters.branch === 'all' ? 'All branches' : filters.branch)}</span>
            <Icon name="chevron-down1" />
            <OverviewBranchSelect />
          </label>
          <button className="overview-date-trigger" type="button" onClick={openDate}>
            <ControlIcon name="date" />
            {overviewDateLabel(filters, language)}
          </button>
          <button type="button" onClick={() => setFilters({ ...defaultOverviewFilters })}>
            {tr('Reset filters')}
          </button>
        </div>
      </div>
      <p className="overview-result-summary" role="status">
        {tr('Showing selected branch and date range')} · {number(report.total)} {tr('responses')}
      </p>
      <div className="overview-filtered-metrics">
        {[
          ['Total responses', number(report.total), 'message-square1'],
          ['Positive sentiment', percent(report.positivePercent), 'smile-metric'],
          [
            'Customer satisfaction',
            report.rating === null
              ? '—'
              : formatNumber(report.rating.toFixed(1)) + ' / ' + formatNumber(5),
            'star-metric',
          ],
          [
            'Completion rate',
            report.completion === null ? '—' : percent(report.completion),
            'circle-check-metric',
          ],
        ].map(([label, value, icon]) => (
          <section className="overview-summary-card" key={label}>
            <div>
              <span>{tr(label)}</span>
              <Icon name={icon} />
            </div>
            <strong>{value}</strong>
            {label === 'Customer satisfaction' && report.rating === null && (
              <small>{tr('No rating data in this period')}</small>
            )}
            {label === 'Completion rate' && report.completion === null && (
              <small>{tr('No completion data in this period')}</small>
            )}
          </section>
        ))}
      </div>
      <div className="overview-filtered-charts">
        <section className="overview-summary-card">
          <h2>{tr('Response & sentiment trends')}</h2>
          <p>{tr('Responses in the selected period')}</p>
          <div className="overview-report-bars" aria-label={tr('Response & sentiment trends')}>
            {report.periods.map((period) => (
              <div className="overview-report-column" key={period.start}>
                <strong>{number(period.total)}</strong>
                <div className="overview-report-bar-slot">
                  <div
                    style={{
                      height: Math.max(
                        0,
                        (period.total / Math.max(1, ...report.periods.map((p) => p.total))) * 150,
                      ),
                    }}
                  />
                </div>
                <small>
                  {short(period.start)}
                  {period.end !== period.start ? ' – ' + short(period.end) : ''}
                </small>
              </div>
            ))}
          </div>
        </section>
        <section className="overview-summary-card">
          <h2>{tr('How customers feel')}</h2>
          <p>
            {number(report.total)} {tr('responses')}
          </p>
          <div className="overview-report-distribution">
            <div
              className="overview-report-donut"
              style={{
                background: report.total ? 'conic-gradient(' + slices.join(',') + ')' : '#edf1f7',
              }}
              role="img"
              aria-label={tr('Positive sentiment') + ': ' + percent(report.positivePercent)}
            >
              <div>
                <strong>{percent(report.positivePercent)}</strong>
                <small>{tr('Positive')}</small>
              </div>
            </div>
            <div className="overview-report-legend">
              {tones
                .filter(([key]) => key !== 'mixed' || report.mixed)
                .map(([key, label, color]) => (
                  <div key={key}>
                    <i style={{ background: color }} />
                    <span>{tr(label)}</span>
                    <strong>{number(report[key])}</strong>
                  </div>
                ))}
            </div>
          </div>
        </section>
      </div>
      {!report.total && (
        <div className="overview-summary-card overview-report-empty">
          <h2>{tr('No responses in this period')}</h2>
          <p>{tr('Choose another branch or date range to see available responses.')}</p>
          <button type="button" onClick={() => setFilters({ ...defaultOverviewFilters })}>
            {tr('Reset filters')}
          </button>
        </div>
      )}
      <section className="overview-summary-card">
        <h2>{tr('A clearer view of each branch')}</h2>
        <div className="overview-report-table-wrap">
          <table className="overview-report-table">
            <thead>
              <tr>
                {['Branch', 'Responses', 'Positive sentiment', 'Customer satisfaction'].map(
                  (label) => (
                    <th key={label}>{tr(label)}</th>
                  ),
                )}
              </tr>
            </thead>
            <tbody>
              {report.branches.map((row) => (
                <tr key={row.branch}>
                  <td>{tr(row.branch)}</td>
                  <td>{number(row.total)}</td>
                  <td>{percent(row.positivePercent)}</td>
                  <td>
                    {row.rating === null
                      ? '—'
                      : formatNumber(row.rating.toFixed(1)) + ' / ' + formatNumber(5)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>
      {report.responses.length > 0 && (
        <section className="overview-summary-card">
          <div className="overview-filtered-heading">
            <h2>{tr('Latest customer responses')}</h2>
            <a href="#/feedbacks">{tr('All feedbacks')}</a>
          </div>
          <div className="overview-report-responses">
            {report.responses.map((row) => (
              <a key={row.id} href={'#/feedback-details?id=' + row.id}>
                <p dir="auto" lang={row.language === 'Arabic' ? 'ar' : 'en'}>
                  {row.text}
                </p>
                <small>
                  <bdi dir="ltr">#{row.id}</bdi> · {tr(row.branch)} · {short(row.date)}
                </small>
              </a>
            ))}
          </div>
        </section>
      )}
    </section>
  );
}
