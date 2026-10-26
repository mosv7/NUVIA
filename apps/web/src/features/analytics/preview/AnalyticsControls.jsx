import UiArrow from '../../../components/ui/UiArrow.jsx';
import { overviewDateLabel } from '../../dashboard/OverviewControls.jsx';
import ControlIcon from '../../../components/ui/ControlIcon.jsx';
import { asset } from '../../../lib/assets.js';
import React, { useState, useEffect, useLayoutEffect, useRef } from 'react';
import ChoiceMenu, { BranchMenu } from '../../../components/ui/ChoiceMenu.jsx';

import { useProductView } from '../../../app/providers/ProductProvider.jsx';
import { getOverviewReport, defaultOverviewFilters } from '../../dashboard/overview-report.js';
export const analyticsTabs = [
  ['sentiment', 'Sentiment Analysis'],
  ['aspects', 'Aspect-Based Analysis'],
  ['topics', 'Topics & Complaints'],
  ['trends', 'Trends & Signals'],
  ['comparison', 'Branch Comparison'],
];
export function AnalyticsArrowText({ text }) {
  const { language, tr } = useProductView();
  const open = (e) => {
    e.preventDefault();
    e.stopPropagation();
    const host = e.currentTarget.closest(
      '[data-name="Topic cluster"],[data-name="Emerging theme"]',
    );
    const copy = host?.textContent || text;
    const groups = [
      ['Speed', 'Long waiting times', 'Wait time'],
      ['Product Quality', 'Coffee & food quality', 'Coffee'],
      ['Price', 'Pricing', 'Value'],
      ['Service', 'Friendly service', 'Service'],
      ['Cleanliness', 'Cleanliness', 'Cleanliness'],
      ['Ambience', 'Workspace atmosphere', 'Ambience'],
      ['Ambience', 'Limited power sockets', 'Ambience'],
      ['Wi-Fi', 'Unreliable Wi-Fi', 'Wi-Fi'],
      ['Service', 'Order accuracy', 'Service'],
      ['Ambience', 'Ambience', 'Ambience'],
    ];
    const found = groups.find(
      ([aspect, title]) => copy.includes(tr(title)) || copy.includes(tr(aspect)),
    );
    location.hash =
      '/feedbacks' +
      (found
        ? '?aspect=' + encodeURIComponent(found[2])
        : /360|104/.test(text) || e.currentTarget.closest('[data-analytics-kind=aspects]')
          ? '?aspect=Wait%20time'
          : '');
  };
  return (
    <span
      className="analytics-arrow-text"
      role="link"
      tabIndex={0}
      onClick={open}
      onKeyDown={(e) => {
        if (e.key === 'Enter') {
          open(e);
        }
      }}
    >
      {text
        .split(/([→←↑↓↗↖])/)
        .map((part, index) =>
          /[→←↑↓↗↖]/.test(part) ? <UiArrow key={index} rtl={language === 'ar'} /> : part,
        )}
    </span>
  );
}
export function AnalyticsSmallSelect({ kind }) {
  const { tr } = useProductView();
  const [value, setValue] = useState(
    kind === 'weekly' ? 'Weekly' : kind === 'topics' ? 'Selected first' : 'All sentiments',
  );
  const choices =
    kind === 'weekly'
      ? ['Weekly']
      : kind === 'topics'
        ? ['Selected first', 'Most frequent first']
        : ['All sentiments', 'Positive', 'Negative', 'Mixed'];
  return (
    <span className="analytics-select">
      <ChoiceMenu
        value={value}
        label={tr(kind === 'weekly' ? 'Aggregation' : kind === 'topics' ? 'Sort' : 'Sentiment')}
        options={choices.map((label) => ({ value: label, label: tr(label) }))}
        icon={false}
        onChange={(v) => {
          setValue(v);
          document
            .querySelectorAll('[data-name="Explore responses"] [data-name="Related response"]')
            .forEach((el) => {
              el.hidden = v !== 'All sentiments' && !el.textContent.includes(tr(v));
            });
          if (kind === 'topics')
            document.querySelectorAll('[data-name="Topic cluster"]').forEach((el, index) => {
              const key = Object.keys(topics).find((key) => el.textContent.includes(tr(key)));
              el.style.order =
                v === 'Most frequent first' ? 200 - (topics[key]?.count || 0) : index;
            });
        }}
      />
    </span>
  );
}
export function DimensionResults() {
  const { tr, formatNumber } = useProductView();
  return (
    <section className="analytics-dimension-results">
      <h2>{tr('Dimension results')}</h2>
      <p>{tr('Response-level sentiment distribution')}</p>
      <div>
        <table>
          <thead>
            <tr>
              {['Branch', 'Responses', 'Positive', 'Negative', 'Neutral', 'Mixed'].map((label) => (
                <th key={label}>{tr(label)}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {[
              ['Cairo', 540, '81.9%', '6.5%', '8.0%', '3.7%'],
              ['Alex', 468, '73.7%', '10.7%', '11.3%', '4.3%'],
              ['El Zamalek', 240, '77.9%', '6.3%', '11.7%', '4.2%'],
            ].map(([name, ...values]) => (
              <tr key={name}>
                <td>{tr(name)}</td>
                {values.map((value, i) => (
                  <td key={i}>{formatNumber(value)}</td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </section>
  );
}
function AnalyticsSectionIcon({ kind }) {
  const names = {
    sentiment: 'smile',
    aspects: 'tag',
    topics: 'message-square',
    trends: 'chart-no-axes-combined',
    comparison: 'file-chart-column',
  };
  const source = asset('dashboard/overview/' + names[kind] + '.svg');
  return (
    <span
      className="analytics-section-icon"
      data-section={kind}
      aria-hidden="true"
      style={{ maskImage: `url("${source}")`, WebkitMaskImage: `url("${source}")` }}
    />
  );
}
const analyticsTabScroll = { en: 0, ar: 0 };
export function AnalyticsTabs() {
  const { tr, analytics, language } = useProductView();
  const tabsRef = useRef(null);
  useLayoutEffect(() => {
    const nav = tabsRef.current;
    if (!nav || nav.scrollWidth <= nav.clientWidth) return;
    nav.scrollLeft = analyticsTabScroll[language] || 0;
    const active = nav.querySelector('[aria-current="page"]');
    if (!active) return;
    const bounds = nav.getBoundingClientRect();
    const selected = active.getBoundingClientRect();
    if (selected.left < bounds.left) nav.scrollLeft += selected.left - bounds.left;
    else if (selected.right > bounds.right) nav.scrollLeft += selected.right - bounds.right;
    analyticsTabScroll[language] = nav.scrollLeft;
  }, [analytics.kind, language]);
  return (
    <>
      <div className="analytics-mobile-navigation">
        <ChoiceMenu
          value={analytics.kind}
          label={tr('Analytics')}
          density="compact"
          options={analyticsTabs.map(([value, label]) => ({
            value,
            label: tr(label),
            icon: <AnalyticsSectionIcon kind={value} />,
          }))}
          onChange={(value) => {
            location.hash = '/analytics-' + value;
          }}
        />
      </div>
      <nav
        ref={tabsRef}
        onScroll={(event) => {
          analyticsTabScroll[language] = event.currentTarget.scrollLeft;
        }}
        className="analytics-tabs"
        aria-label={tr('Analytics')}
      >
        {analyticsTabs.map(([key, label]) => (
          <a
            key={key}
            href={'#/analytics-' + key}
            aria-current={analytics.kind === key ? 'page' : undefined}
          >
            {tr(label)}
          </a>
        ))}
      </nav>
    </>
  );
}
export function AnalyticsFilters() {
  const { tr, analytics, dashboard, language } = useProductView();
  const { filters } = dashboard;
  const [filtersOpen, setFiltersOpen] = useState(false);
  const panelId = React.useId();
  const dateLabel = overviewDateLabel(filters, language);
  return (
    <div className="analytics-filter-group" data-open={filtersOpen}>
      <button
        type="button"
        className="analytics-filter-toggle"
        aria-expanded={filtersOpen}
        aria-controls={panelId}
        onClick={() => setFiltersOpen((value) => !value)}
      >
        {tr('Filters')}
        <i className="filter-menu-chevron" aria-hidden="true" />
      </button>
      <p className="analytics-filter-summary">
        {dateLabel} · {tr(filters.branch === 'all' ? 'All branches' : filters.branch)} ·{' '}
        {tr(analytics.filters.language)}
      </p>
      <div id={panelId} className="analytics-filters" data-name="Shared filters">
        <div className="analytics-date-field">
          <span className="analytics-filter-label">{tr('Choose date range')}</span>
          <button
            type="button"
            className="analytics-date-button"
            aria-label={tr('Choose date range')}
            onClick={dashboard.openDate}
          >
            <ControlIcon name="date" />
            <span>{dateLabel}</span>
          </button>
        </div>
        <div className="analytics-select" data-control="branch" data-field-label={tr('Branch')}>
          <BranchMenu
            tr={tr}
            value={filters.branch}
            onChange={(branch) => dashboard.setFilters((old) => ({ ...old, branch }))}
          />
        </div>
        <div className="analytics-select" data-control="language" data-field-label={tr('Language')}>
          <ChoiceMenu
            label={tr('Language')}
            value={analytics.filters.language}
            onChange={(language) => analytics.setFilters((old) => ({ ...old, language }))}
            options={['All languages', 'English', 'Arabic'].map((label) => ({
              value: label,
              label: tr(label),
            }))}
            icon={false}
          />
        </div>
        <div
          className="analytics-select analytics-survey-select"
          data-control="survey"
          data-field-label={tr('Survey')}
        >
          <ChoiceMenu
            label={tr('Survey')}
            value="survey"
            onChange={() => {}}
            options={[{ value: 'survey', label: tr('Customer experience survey') }]}
            icon={false}
          />
        </div>
        <button
          className="analytics-reset"
          disabled={!analytics.changed}
          onClick={() => {
            dashboard.setFilters({ ...defaultOverviewFilters });
            analytics.setFilters({ language: 'All languages' });
          }}
        >
          {tr('Reset')}
        </button>
      </div>
    </div>
  );
}
export function ComparisonScope() {
  const { tr, dashboard, analytics, language } = useProductView();
  const branches =
    dashboard.filters.branch === 'all'
      ? ['Cairo', 'Alex', 'El Zamalek']
      : [dashboard.filters.branch];
  const selected = analytics.filters.branches || branches;
  const setSelected = (value) =>
    analytics.setFilters((old) => ({
      ...old,
      branches: typeof value === 'function' ? value(old.branches || branches) : value,
    }));
  const visible = selected.filter((branch) => branches.includes(branch));
  const locale = language === 'ar' ? 'ar-EG' : 'en-GB';
  const shortDate = (value) =>
    new Date(value + 'T12:00:00').toLocaleDateString(locale, { day: 'numeric', month: 'short' });
  const sameYear = dashboard.filters.start.slice(0, 4) === dashboard.filters.end.slice(0, 4);
  const year = (value) => Number(value.slice(0, 4)).toLocaleString(locale, { useGrouping: false });
  const period =
    shortDate(dashboard.filters.start) +
    (sameYear ? '' : ', ' + year(dashboard.filters.start)) +
    ' – ' +
    shortDate(dashboard.filters.end) +
    ', ' +
    year(dashboard.filters.end);
  return (
    <section className="analytics-comparison-scope" aria-label={tr('Comparison setup')}>
      <div className="comparison-dimension">
        <small>{tr('COMPARISON DIMENSION')}</small>
        <div className="comparison-dimension-select">
          <ChoiceMenu
            label={tr('Comparison dimension')}
            icon={false}
            value="branches"
            onChange={() => {}}
            options={[{ value: 'branches', label: tr('Branches') }]}
          />
        </div>
      </div>
      <div className="comparison-values">
        <small className="comparison-values-label">
          <span>{tr('SELECTED DIMENSION VALUES')}</span>
          <span className="comparison-selection-count">
            {visible.length.toLocaleString(locale)} {tr('SELECTED')}
          </span>
        </small>
        <div className="comparison-branch-chips">
          {visible.map((branch) => (
            <button
              type="button"
              key={branch}
              disabled={visible.length === 1}
              aria-label={tr('Remove branch') + ' ' + tr(branch)}
              onClick={() => setSelected((current) => current.filter((item) => item !== branch))}
            >
              {tr(branch)}
              <span aria-hidden="true">×</span>
            </button>
          ))}
          {visible.length < branches.length && (
            <button
              type="button"
              className="comparison-restore"
              onClick={() => setSelected(branches)}
            >
              {tr('All branches')}
            </button>
          )}
        </div>
      </div>
      <div>
        <small>{tr('SURVEY')}</small>
        <span>{tr('Customer experience survey')}</span>
        <small>{tr('Shared filter applied across all comparisons')}</small>
      </div>
      <div>
        <small>{tr('PERIOD')}</small>
        <span dir="auto">{period}</span>
        <small>{tr('Shared filter applied across all comparisons')}</small>
      </div>
    </section>
  );
}
export function FilteredAnalyticsSummary() {
  const { tr, dashboard, analytics, language } = useProductView(),
    report = (() => {
      const result = getOverviewReport(dashboard.filters);
      if (!analytics.filters.branches) return result;
      const branches = result.branches.filter((row) =>
        analytics.filters.branches.includes(row.branch),
      );
      const totals = Object.fromEntries(
        ['total', 'positive', 'negative', 'neutral', 'mixed'].map((key) => [
          key,
          branches.reduce((sum, row) => sum + row[key], 0),
        ]),
      );
      return { ...result, ...totals, branches };
    })(),
    number = (n) => n.toLocaleString(language === 'ar' ? 'ar-EG' : 'en-US');
  return (
    <section className="analytics-filtered">
      <p className="analytics-sample-note">
        {tr(
          'Filtered illustrative preview. Detailed aspect and topic model results are not available for this scope.',
        )}
      </p>
      {analytics.filters.language !== 'All languages' ? (
        <div className="analytics-empty">
          <h2>{tr('Language breakdown not supplied')}</h2>
          <p>{tr('Choose all languages to view the available sample aggregates.')}</p>
        </div>
      ) : (
        <>
          <div className="analytics-summary-metrics">
            {[
              ['Responses', report.total],
              ['Positive', report.positive],
              ['Negative', report.negative],
              ['Neutral / Mixed', report.neutral + report.mixed],
            ].map(([label, value]) => (
              <section key={label}>
                <small>{tr(label)}</small>
                <strong>{number(value)}</strong>
              </section>
            ))}
          </div>
          <section className="analytics-summary-card">
            <h2>{tr('Selected branches')}</h2>
            {report.branches.map((row) => (
              <div className="analytics-branch-result" key={row.branch}>
                <strong>{tr(row.branch)}</strong>
                <span>
                  {number(row.total)} {tr('responses')}
                </span>
                <div>
                  <i style={{ width: row.positivePercent + '%' }} />
                </div>
                <small>
                  {number(Math.round(row.positivePercent))}% {tr('Positive')}
                </small>
              </div>
            ))}
          </section>
          {!report.total && <p>{tr('No responses in this period')}</p>}
        </>
      )}
    </section>
  );
}
const aspectData = {
  Service: { score: 8.1, mentions: 410, positive: 81, negative: 10 },
  Price: { score: 6.5, mentions: 325, positive: 65, negative: 20 },
  Speed: { score: 5.8, mentions: 360, positive: 42, negative: 43 },
  Cleanliness: { score: 8.6, mentions: 240, positive: 88, negative: 7 },
  'Product Quality': { score: 8.8, mentions: 640, positive: 86, negative: 8 },
};
const topics = {
  'Long waiting times': { count: 104, quote: 'We waited 25 minutes for our order.' },
  'Coffee & food quality': { count: 168, quote: 'The coffee was excellent, as always.' },
  'Friendly staff': { count: 92, quote: 'The team remembered my order.' },
  'Unclear combo pricing': { count: 48, quote: 'The combo cost more than the menu price.' },
  'Workspace atmosphere': { count: 64, quote: 'A lovely, calm place to get some work done.' },
  'Order accuracy': { count: 42, quote: 'My order arrived without the extra shot.' },
  'Unreliable Wi-Fi': { count: 18, quote: 'The connection dropped during my meeting.' },
  'Limited power sockets': { count: 12, quote: 'I couldn’t find a place to charge my laptop.' },
};
const relatedAspect = (key) =>
  ({
    Speed: 'Wait time',
    'Long waiting times': 'Wait time',
    Service: 'Service',
    'Friendly staff': 'Service',
    Price: 'Value',
    'Unclear combo pricing': 'Value',
    'Product Quality': 'Coffee',
    'Coffee & food quality': 'Coffee',
    Cleanliness: 'Cleanliness',
    'Workspace atmosphere': 'Ambience',
    'Order accuracy': 'Service',
    'Unreliable Wi-Fi': 'Wi-Fi',
    'Limited power sockets': 'Ambience',
  })[key] || key;
const relatedFeedbackRoute = (key) => '/feedbacks?aspect=' + encodeURIComponent(relatedAspect(key));
export function AnalyticsInteractions({ children, kind }) {
  const { tr } = useProductView();
  const [selected, setSelected] = useState(null);
  const detailRef = useRef(null);
  useEffect(() => {
    if (!selected) return;
    const trigger = document.activeElement;
    const dialog = detailRef.current;
    const controls = () =>
      [...dialog.querySelectorAll('button,a[href],[tabindex="0"]')].filter(
        (node) => !node.disabled,
      );
    controls()[0]?.focus();
    const key = (event) => {
      if (event.key !== 'Tab') return;
      const nodes = controls();
      const first = nodes[0],
        last = nodes.at(-1);
      if (event.shiftKey && document.activeElement === first) {
        event.preventDefault();
        last?.focus();
      } else if (!event.shiftKey && document.activeElement === last) {
        event.preventDefault();
        first?.focus();
      }
    };
    dialog.addEventListener('keydown', key);
    return () => {
      dialog.removeEventListener('keydown', key);
      trigger?.focus();
    };
  }, [selected]);
  const exportData = () => {
    const text =
      '\uFEFF' +
      [
        ['View', kind],
        ['Data', 'Illustrative sample only'],
        ...Object.entries(aspectData).map(([name, row]) => [name, row.score, row.mentions]),
      ]
        .map((row) => row.join(','))
        .join('\n');
    const url = URL.createObjectURL(new Blob([text], { type: 'text/csv;charset=utf-8' }));
    const a = document.createElement('a');
    a.href = url;
    a.download = 'NUVIA-analytics-' + kind + '.csv';
    a.click();
    setTimeout(() => URL.revokeObjectURL(url), 1000);
  };
  const click = (e) => {
    if (e.target.closest('.analytics-detail-dialog')) return;
    const item = e.target.closest(
      '[data-name="Action"],[data-name="Aspect result"],[data-name="Topic cluster"],[data-name="Related response"],[data-name="Emerging theme"]',
    );
    if (!item) return;
    const text = item.textContent.trim();
    if (item.closest('[data-name="Page introduction"]')) {
      exportData();
      return;
    }
    if (item.dataset.name === 'Related response') {
      location.hash = '/feedback-details?id=' + (item.dataset.responseId || 1032);
      return;
    }
    if (/Open response|فتح الرد/.test(text)) {
      location.hash = '/feedback-details?id=1032';
      return;
    }
    const values = kind === 'aspects' ? Object.keys(aspectData) : Object.keys(topics);
    const key = values.find((key) => text.startsWith(tr(key)) || text.startsWith(key));
    if (key) {
      setSelected({ key, ...(aspectData[key] || topics[key]) });
      return;
    }
    if (/All responses|View all|View Related|عرض الرد|كل الردود|الردود المرتبطة/.test(text)) {
      location.hash = '/feedbacks';
    }
  };
  // The native buttons remain the keyboard targets; this container only delegates their clicks.
  const controlsRef = useRef(null);
  useEffect(() => {
    const node = controlsRef.current;
    node?.addEventListener('click', click);
    return () => node?.removeEventListener('click', click);
  });
  return (
    <div ref={controlsRef} className="figma-preview analytics-preview" data-analytics-kind={kind}>
      {children}
      {selected && (
        <div
          className="analytics-detail-backdrop"
          onPointerDown={(event) => {
            if (event.target === event.currentTarget) (() => setSelected(null))(event);
          }}
        >
          <section
            ref={detailRef}
            className="analytics-detail-dialog"
            role="dialog"
            aria-modal="true"
            aria-label={tr(selected.key)}
            onClick={(e) => e.stopPropagation()}
            onKeyDown={(e) => {
              if (e.key === 'Escape') setSelected(null);
            }}
          >
            <header>
              <h2>{tr(selected.key)}</h2>
              <button autoFocus aria-label={tr('Close')} onClick={() => setSelected(null)}>
                ×
              </button>
            </header>
            {selected.score ? (
              <>
                <strong>{selected.score} / 10</strong>
                <p>
                  {selected.mentions} {tr('mentions')}
                </p>
                <div className="analytics-detail-share">
                  <i style={{ width: selected.positive + '%', background: '#1e68ef' }} />
                  <i style={{ width: selected.negative + '%', background: '#b34d50' }} />
                </div>
                <p>
                  {selected.positive}% {tr('Positive')} · {selected.negative}% {tr('Negative')}
                </p>
              </>
            ) : (
              <>
                <strong>
                  {selected.count} {tr('responses')}
                </strong>
                <blockquote>“{selected.quote}”</blockquote>
              </>
            )}
            <p>{tr('Illustrative data only · No live analysis results')}</p>
            <button
              className="feedback-btn feedback-primary"
              onClick={() => (location.hash = relatedFeedbackRoute(selected.key))}
            >
              {tr('View Related Responses')}
            </button>
          </section>
        </div>
      )}
    </div>
  );
}
