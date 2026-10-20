import React, { useEffect, useMemo, useState } from 'react';
import { asset } from '../assets.js';
import { useProductView } from './ProductContext.jsx';
import { feedbackRows, firstAnalysis } from './feedback-data.js';
import { responseCount, normalizeFeedbackSearch } from './feedback-format.js';
import './feedback-screens.css';

const image = (name, folder = 'feedbacks') => asset('dashboard/' + folder + '/' + name + '.svg');
const tones = { Positive: 'positive', Negative: 'negative', Neutral: 'neutral', Mixed: 'warning' };
function Icon({ name, folder = 'feedbacks', className = '' }) {
  return <img className={'feedback-icon ' + className} src={image(name, folder)} alt="" />;
}
function Arrow({ direction = 'forward' }) {
  return (
    <svg
      className={'feedback-arrow ' + direction}
      width="12"
      height="12"
      viewBox="0 0 16 16"
      fill="none"
      aria-hidden="true"
    >
      <path
        d="M3.5 8h8M8 4.5 11.5 8 8 11.5"
        stroke="currentColor"
        strokeWidth="2.1"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}
function Badge({ value }) {
  const { tr } = useProductView();
  return (
    <span className={'feedback-badge ' + (tones[value] || 'info')}>
      <i />
      {tr(value)}
    </span>
  );
}
const openFeedback = (id) => {
  location.hash = '/feedback-details?id=' + id;
};
const emptyFilters = {
  date: '30',
  sentiment: 'all',
  language: 'all',
  aspect: 'all',
  branch: 'all',
  segment: 'all',
};
function Filter({ name, label, options, value, onChange, disabled, calendar }) {
  const { tr } = useProductView();
  return (
    <label className={'feedback-filter ' + (calendar ? 'date-filter' : '')}>
      <span>{tr(label)}</span>
      <span className="feedback-select-wrap">
        {calendar && <Icon name="calendarDays" />}
        <select
          aria-label={tr(label)}
          value={value}
          onChange={(e) => onChange(name, e.target.value)}
          disabled={disabled}
        >
          {options.map(([v, label]) => (
            <option key={v} value={v}>
              {tr(label)}
            </option>
          ))}
        </select>
        <Icon name="chevronDown" />
      </span>
    </label>
  );
}
function NoResponses({ empty, onClear }) {
  const { tr, preview, action, language } = useProductView();
  const [shared, setShared] = useState(false);
  const share = async () => {
    try {
      await navigator.clipboard.writeText('https://nuvia.link/bloom-feedback');
      setShared('copied');
    } catch {
      setShared('manual');
    }
  };
  return (
    <div className="feedback-empty">
      <img
        className="feedback-empty-icon"
        src={asset(
          empty
            ? 'dashboard/feedbacks-empty/messages-square.svg'
            : 'dashboard/feedbacks/search-x.svg',
        )}
        alt=""
      />
      <h2>{tr(empty ? 'Your first response starts here' : 'No responses match your filters')}</h2>
      <p>
        {tr(
          empty
            ? 'Share a survey with your customers to start collecting feedback. Every response will appear here, ready to explore.'
            : 'Try another sentiment, language, or branch, or clear your filters to see all responses.',
        )}
      </p>
      {empty ? (
        <div className="feedback-empty-actions">
          <button
            className="feedback-btn feedback-primary"
            onClick={preview ? share : () => action('Surveys')}
          >
            <Icon name="send" folder="feedbacks-empty" />
            {tr(shared === 'copied' ? 'Link copied' : 'Share a survey')}
          </button>
          {preview ? (
            <button className="feedback-btn" onClick={() => onClear()}>
              {tr('View sample responses')}
            </button>
          ) : (
            <a className="feedback-btn" href="/preview/#/feedbacks">
              {tr('View sample responses')}
            </a>
          )}
        </div>
      ) : (
        <button className="feedback-btn feedback-primary" onClick={onClear}>
          <Icon name="rotate-ccw" />
          {tr('Clear Filters')}
        </button>
      )}
      {empty ? (
        <small aria-live="polite">
          {!preview
            ? language === 'ar'
              ? 'مشاركة الاستبيانات غير متاحة بعد.'
              : 'Survey sharing is not available yet.'
            : shared
              ? 'nuvia.link/bloom-feedback'
              : tr('Already shared? New responses appear automatically.')}
        </small>
      ) : (
        <small>{tr('Your responses are still here. Only the view has changed.')}</small>
      )}
    </div>
  );
}
export function FeedbackList({ empty = false }) {
  const ui = useProductView(),
    { tr, language } = ui;
  const [filters, setFilters] = useState(emptyFilters),
    [selected, setSelected] = useState(() => new Set(empty ? [] : [1248])),
    [descending, setDescending] = useState(true),
    [page, setPage] = useState(0);
  const data = useMemo(() => (empty ? [] : feedbackRows), [empty]);
  const filtered = useMemo(
    () =>
      data
        .filter((row) => {
          const q = normalizeFeedbackSearch(ui.query);
          const searchable = normalizeFeedbackSearch(
            [row.text, row.id, tr(row.branch), tr(row.sentiment), ...row.aspects.map(tr)].join(' '),
          );
          return (
            (!q || searchable.includes(q)) &&
            (filters.sentiment === 'all' || row.sentiment === filters.sentiment) &&
            (filters.language === 'all' || row.language === filters.language) &&
            (filters.aspect === 'all' || row.aspects.includes(filters.aspect)) &&
            (filters.branch === 'all' || row.branch === filters.branch) &&
            (filters.segment === 'all' || row.segment === filters.segment) &&
            (filters.date !== '1' || row.date === '2026-10-16')
          );
        })
        .sort((a, b) => (descending ? b.id - a.id : a.id - b.id)),
    [data, ui.query, filters, descending, tr],
  );
  const pageSize = 8,
    visible = filtered.slice(page * pageSize, (page + 1) * pageSize),
    visibleSelected = filtered.filter((r) => selected.has(r.id)),
    allChecked = visible.length > 0 && visible.every((r) => selected.has(r.id));
  useEffect(() => setPage(0), [filters, ui.query]);
  const update = (key, value) => setFilters((old) => ({ ...old, [key]: value }));
  const reset = () => {
    setFilters({ ...emptyFilters });
    ui.setQuery('');
    setPage(0);
    if (empty) location.hash = '/feedbacks';
  };
  const toggle = (id) =>
    setSelected((old) => {
      const next = new Set(old);
      next.has(id) ? next.delete(id) : next.add(id);
      return next;
    });
  const toggleAll = () =>
    setSelected((old) => {
      const next = new Set(old);
      visible.forEach((r) => (allChecked ? next.delete(r.id) : next.add(r.id)));
      return next;
    });
  const number = (n) => n.toLocaleString(language === 'ar' ? 'ar-EG' : 'en-US');
  const filterLabels = {
    date: 'Date range',
    sentiment: 'Sentiment',
    language: 'Language',
    aspect: 'Aspect',
    branch: 'Branch',
    segment: 'Segment',
  };
  const applied = Object.entries(filters)
    .filter(([key, value]) => value !== emptyFilters[key])
    .map(([key, value]) => ({
      key,
      label: filterLabels[key],
      value: key === 'date' ? (value === '1' ? 'Most recent day' : 'Last 7 days') : value,
    }));
  if (ui.query.trim()) applied.push({ key: 'search', label: 'Search', value: ui.query.trim() });
  const activeFilterLabel =
    language === 'ar'
      ? applied.length === 1
        ? 'فلتر نشط'
        : applied.length === 2
          ? 'فلتران نشطان'
          : number(applied.length) + ' فلاتر نشطة'
      : number(applied.length) + ' active';
  const date = (s) =>
    new Date(s + 'T12:00:00').toLocaleDateString(language === 'ar' ? 'ar-EG' : 'en-GB', {
      day: 'numeric',
      month: 'short',
      year: 'numeric',
    });
  const exportRows = () => {
    const rows = visibleSelected.length ? visibleSelected : filtered;
    const quote = (s) => '"' + String(s).replaceAll('"', '""') + '"';
    const csv =
      '\uFEFF' +
      [
        ['ID', 'Feedback', 'Sentiment', 'Date', 'Language', 'Branch'],
        ...rows.map((r) => [r.id, r.text, r.sentiment, r.date, r.language, r.branch]),
      ]
        .map((r) => r.map(quote).join(','))
        .join('\r\n');
    const url = URL.createObjectURL(new Blob([csv], { type: 'text/csv;charset=utf-8' }));
    const a = document.createElement('a');
    a.href = url;
    a.download = 'NUVIA-feedbacks.csv';
    a.click();
    setTimeout(() => URL.revokeObjectURL(url), 1000);
  };
  return (
    <section className="feedback-screen" aria-labelledby="feedback-title">
      <div className="feedback-heading">
        <div>
          <h1 id="feedback-title">{tr('Feedbacks')}</h1>
          <p>{tr('Listen to your customers. Understand every experience.')}</p>
        </div>
        <button
          className="feedback-btn feedback-export"
          disabled={!filtered.length}
          onClick={exportRows}
        >
          <Icon name="download" />
          {tr('Export')}
        </button>
      </div>
      <section className="feedback-filters" aria-label={tr('Filters')}>
        <div className="feedback-filter-heading">
          <strong>
            <Icon name="slidersHorizontal" />
            {tr('Filters')}
            {applied.length > 0 && (
              <span className="feedback-active-count">{activeFilterLabel}</span>
            )}
          </strong>
          <button
            className={'feedback-text-btn' + (applied.length ? ' feedback-clear-active' : '')}
            onClick={reset}
            disabled={empty}
          >
            {tr('Clear Filters')}
          </button>
        </div>
        <div className="feedback-filter-grid">
          <Filter
            name="date"
            label="Date range"
            value={filters.date}
            onChange={update}
            disabled={empty}
            calendar
            options={[
              ['30', 'Last 30 days'],
              ['7', 'Last 7 days'],
              ['1', 'Most recent day'],
            ]}
          />
          <Filter
            name="sentiment"
            label="Sentiment"
            value={filters.sentiment}
            onChange={update}
            disabled={empty}
            options={[['all', 'All sentiments'], ...Object.keys(tones).map((v) => [v, v])]}
          />
          <Filter
            name="language"
            label="Language"
            value={filters.language}
            onChange={update}
            disabled={empty}
            options={[
              ['all', 'All languages'],
              ['English', 'English'],
              ['Arabic', 'Arabic'],
            ]}
          />
          <Filter
            name="aspect"
            label="Aspect"
            value={filters.aspect}
            onChange={update}
            disabled={empty}
            options={[
              ['all', 'All aspects'],
              ...[...new Set(feedbackRows.flatMap((r) => r.aspects))].map((v) => [v, v]),
            ]}
          />
          <Filter
            name="branch"
            label="Branch"
            value={filters.branch}
            onChange={update}
            disabled={empty}
            options={[
              ['all', 'All branches'],
              ['Cairo', 'Cairo'],
              ['El Zamalek', 'El Zamalek'],
              ['Alex', 'Alex'],
            ]}
          />
          <Filter
            name="segment"
            label="Segment"
            value={filters.segment}
            onChange={update}
            disabled={empty}
            options={[
              ['all', 'All segments'],
              ['Morning visitors', 'Morning visitors'],
              ['Returning customers', 'Returning customers'],
              ['New customers', 'New customers'],
            ]}
          />
        </div>
      </section>
      {applied.length > 0 && (
        <div className="feedback-applied-filters" aria-label={tr('Applied filters')}>
          <span>{tr('Applied filters')}</span>
          {applied.map((filter) => (
            <button
              className="feedback-filter-chip"
              key={filter.key}
              aria-label={tr('Remove filter') + ' ' + tr(filter.label)}
              onClick={() =>
                filter.key === 'search'
                  ? ui.setQuery('')
                  : update(filter.key, emptyFilters[filter.key])
              }
            >
              {tr(filter.label)}: {filter.key === 'search' ? filter.value : tr(filter.value)}
              <Icon name="x" />
            </button>
          ))}
        </div>
      )}
      <section className="feedback-table-card" aria-label={tr('Feedbacks')}>
        <div className="feedback-table-toolbar">
          <div className="feedback-result-count">
            <strong>{responseCount(filtered.length, language)}</strong>
            {visibleSelected.length > 0 && (
              <span>
                {number(visibleSelected.length)} {tr('selected')}
              </span>
            )}
          </div>
          <div className="feedback-table-actions">
            <button
              className="feedback-sort feedback-text-btn"
              onClick={() => setDescending((v) => !v)}
              disabled={empty}
            >
              {tr(descending ? 'Newest first' : 'Oldest first')}
            </button>
            <button
              className="feedback-btn"
              disabled={visibleSelected.length !== 1}
              title={tr('Select one response to open')}
              onClick={() => openFeedback(visibleSelected[0].id)}
            >
              <Arrow direction="external" />
              {tr('Open Response')}
            </button>
          </div>
        </div>
        <div
          className="feedback-table-scroll"
          tabIndex={0}
          role="region"
          aria-label={tr('Customer responses table')}
        >
          <table className="feedback-table">
            <colgroup>
              <col className="check-col" />
              <col className="preview-col" />
              <col className="sentiment-col" />
              <col className="date-col" />
              <col className="language-col" />
              <col className="aspects-col" />
              <col className="details-col" />
            </colgroup>
            <thead>
              <tr>
                <th>
                  <input
                    type="checkbox"
                    ref={(node) => {
                      if (node)
                        node.indeterminate =
                          !allChecked && visible.some((row) => selected.has(row.id));
                    }}
                    aria-label={tr('Select all')}
                    checked={allChecked}
                    disabled={!visible.length}
                    onChange={toggleAll}
                  />
                </th>
                <th>{tr('Feedback preview')}</th>
                <th>{tr('Sentiment')}</th>
                <th>
                  <button className="feedback-date-sort" onClick={() => setDescending((v) => !v)}>
                    {tr('Date')}
                    <Icon name="arrowDown" className={descending ? '' : 'flipped'} />
                  </button>
                </th>
                <th>{tr('Language')}</th>
                <th>{tr('Related aspect')}</th>
                <th>{tr('View Details')}</th>
              </tr>
            </thead>
            <tbody>
              {visible.map((row) => (
                <tr key={row.id} className={selected.has(row.id) ? 'selected' : ''}>
                  <td>
                    <input
                      type="checkbox"
                      aria-label={tr('Select response') + ' ' + row.id}
                      checked={selected.has(row.id)}
                      onChange={() => toggle(row.id)}
                    />
                  </td>
                  <td>
                    <p
                      className="feedback-preview"
                      lang={row.language === 'Arabic' ? 'ar' : 'en'}
                      dir="auto"
                      title={row.text}
                    >
                      {row.preview || row.text}
                    </p>
                    <small>
                      <bdi dir="ltr">#{row.id}</bdi> · {tr(row.branch)} ·{' '}
                      {tr('Customer experience survey')}
                    </small>
                  </td>
                  <td>
                    <Badge value={row.sentiment} />
                  </td>
                  <td>
                    <p>{date(row.date)}</p>
                    <small>
                      {language === 'ar'
                        ? ui.formatNumber(row.time.replace('AM', 'ص').replace('PM', 'م'))
                        : row.time}
                    </small>
                  </td>
                  <td>{tr(row.language)}</td>
                  <td className="feedback-aspects">
                    {row.aspects
                      .slice(0, 2)
                      .map(tr)
                      .join(language === 'ar' ? '، ' : ', ')}
                    {row.aspects.length > 2 ? ' +' + ui.formatNumber(row.aspects.length - 2) : ''}
                  </td>
                  <td>
                    <button
                      className="feedback-text-btn details-link"
                      onClick={() => openFeedback(row.id)}
                    >
                      {tr('View Details')}
                      <Arrow direction="external" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        {!filtered.length && <NoResponses empty={empty} onClear={reset} />}
        <div className="feedback-pagination">
          <span>
            {filtered.length
              ? `${tr('Showing')} ${number(page * pageSize + 1)}–${number(Math.min((page + 1) * pageSize, filtered.length))} ${tr('of')} ${responseCount(filtered.length, language)}`
              : tr('Showing 0 responses')}
          </span>
          <div>
            <button
              className="feedback-btn"
              disabled={page === 0}
              onClick={() => setPage((v) => v - 1)}
            >
              {tr('Previous')}
            </button>
            {filtered.length > 0 && (
              <span className="feedback-page-number" aria-current="page">
                {number(page + 1)}
              </span>
            )}
            <button
              className="feedback-btn"
              disabled={(page + 1) * pageSize >= filtered.length}
              onClick={() => setPage((v) => v + 1)}
            >
              {tr('Next')}
            </button>
          </div>
        </div>
      </section>
      {empty && (
        <div className="feedback-empty-steps">
          {[
            ['clipboard-list', 'Create your survey', 'Ask what matters to your café.'],
            ['qr-code', 'Share it with customers', 'Use a link or an in-store QR code.'],
            [
              'chart-no-axes-combined',
              'Learn from every visit',
              'Explore sentiment and key aspects.',
            ],
          ].map(([icon, title, body]) => (
            <div key={title}>
              <img src={asset('dashboard/feedbacks-empty/' + icon + '.svg')} alt="" />
              <div>
                <strong>{tr(title)}</strong>
                <p>{tr(body)}</p>
              </div>
            </div>
          ))}
        </div>
      )}
    </section>
  );
}

export function FeedbackDetail() {
  const { tr, language, formatNumber } = useProductView();
  const id = Number(new URLSearchParams(location.hash.split('?')[1]).get('id') || 1248);
  const index = feedbackRows.findIndex((r) => r.id === id),
    row = feedbackRows[index];
  if (!row)
    return (
      <section className="feedback-screen">
        <h1>{tr('Response not found')}</h1>
        <a href="#/feedbacks">{tr('All feedbacks')}</a>
      </section>
    );
  const original = row.id === 1248,
    analysis = original ? firstAnalysis : [];
  const date = new Date(row.date + 'T12:00:00').toLocaleDateString(
    language === 'ar' ? 'ar-EG' : 'en-GB',
    { day: 'numeric', month: 'short', year: 'numeric' },
  );
  return (
    <section className="feedback-screen detail-screen">
      <a className="feedback-back" href="#/feedbacks">
        <Arrow direction="back" />
        {tr('All feedbacks')}
      </a>
      <div className="feedback-heading">
        <div>
          <h1>
            {tr('Feedback')} <bdi dir="ltr">#{row.id}</bdi>
          </h1>
          <p>{tr('A closer look at one customer’s experience with Bloom & Co.')}</p>
        </div>
        <div className="feedback-detail-nav">
          <button
            className="feedback-btn"
            disabled={index === 0}
            onClick={() => openFeedback(feedbackRows[index - 1].id)}
          >
            <Arrow direction="back" />
            {tr('Previous')}
          </button>
          <button
            className="feedback-btn"
            disabled={index === feedbackRows.length - 1}
            onClick={() => openFeedback(feedbackRows[index + 1].id)}
          >
            {tr('Next response')}
            <Arrow />
          </button>
        </div>
      </div>
      <div className="feedback-detail-grid">
        <div className="feedback-detail-main">
          <section className="feedback-detail-card">
            <div className="feedback-section-heading">
              <h2>{tr('Original Feedback')}</h2>
              <span className="feedback-original-language">
                {tr(row.language)} · {tr('Original')}
              </span>
            </div>
            <div className="feedback-customer-words">
              <small>{tr('How was your experience at Bloom & Co. today?')}</small>
              <blockquote lang={row.language === 'Arabic' ? 'ar' : 'en'} dir="auto">
                {row.text}
              </blockquote>
            </div>
            <div className="feedback-submission-grid">
              {[
                [
                  'Submission date',
                  date +
                    (language === 'ar' ? '، ' : ', ') +
                    (language === 'ar'
                      ? formatNumber(row.time.replace('AM', 'ص').replace('PM', 'م'))
                      : row.time),
                ],
                ['Branch', tr(row.branch)],
                ['Related survey', tr('Customer experience survey')],
                ['Respondent', tr('Anonymous customer')],
              ].map(([label, value]) => (
                <div key={label}>
                  <small>{tr(label)}</small>
                  <p className={label === 'Related survey' ? 'feedback-survey-name' : ''}>
                    {value}
                  </p>
                </div>
              ))}
            </div>
          </section>
          <section className="feedback-detail-card feedback-analysis-card">
            <div className="feedback-analysis-heading">
              <div className="feedback-section-heading">
                <h2>{tr('Aspect Analysis')}</h2>
                <small>
                  {analysis.length ? tr('4 aspects detected') : tr('No aspect scores available')}
                </small>
              </div>
              <p>{tr('What the customer mentioned, and how they felt about it.')}</p>
            </div>
            {analysis.length ? (
              <>
                <div className="feedback-analysis-scroll">
                  <table className="feedback-aspect-table">
                    <thead>
                      <tr>
                        {['Detected aspect', 'Feedback evidence', 'Polarity', 'Score'].map((x) => (
                          <th key={x}>{tr(x)}</th>
                        ))}
                      </tr>
                    </thead>
                    <tbody>
                      {analysis.map((a) => (
                        <tr key={a.aspect}>
                          <td>{tr(a.aspect)}</td>
                          <td>“{a.quote}”</td>
                          <td>
                            <Badge value={a.sentiment} />
                          </td>
                          <td className={'score-' + a.sentiment.toLowerCase()} dir="ltr">
                            <bdi dir="ltr">{formatNumber(a.score)}</bdi>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
                <p className="feedback-score-note">
                  <Icon name="info" folder="feedback-details" />
                  {tr('Scores range from −1 (negative) to +1 (positive). 0 is neutral.')}
                </p>
              </>
            ) : (
              <p className="feedback-analysis-unavailable">
                {tr('Detailed analysis is not available for this response yet.')}
              </p>
            )}
          </section>
        </div>
        <aside className="feedback-detail-aside">
          <section className="feedback-detail-card">
            <h2>{tr('Sentiment Analysis')}</h2>
            <div className="feedback-overall">
              <small>{tr('Overall sentiment')}</small>
              <Badge value={row.sentiment} />
              {original && (
                <p>
                  {tr(
                    'The customer enjoyed the coffee, team, and atmosphere, but was disappointed by the long wait.',
                  )}
                </p>
              )}
            </div>
            {original && (
              <div className="feedback-signals">
                {[
                  ['thumbs-up', 'What went well', 'Coffee, welcoming team, calm space'],
                  ['thumbs-down', 'Room to improve', 'Speed of service during the morning rush'],
                ].map(([icon, title, body]) => (
                  <div key={title}>
                    <Icon name={icon} folder="feedback-details" />
                    <div>
                      <strong>{tr(title)}</strong>
                      <p>{tr(body)}</p>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </section>
          <section className="feedback-detail-card">
            <h2>{tr('Response context')}</h2>
            <dl className="feedback-context">
              {[
                ['Segment', tr(row.segment)],
                ['Collection source', tr(original ? 'In-store QR code' : 'Not specified')],
                ['Analysis status', tr(original ? 'Complete' : 'Pending')],
              ].map(([label, value]) => (
                <div key={label}>
                  <dt>{tr(label)}</dt>
                  <dd>{value}</dd>
                </div>
              ))}
            </dl>
            <p className="feedback-privacy">
              <Icon name="shield-check" folder="feedback-details" />
              {tr('This survey collects feedback anonymously.')}
            </p>
          </section>
          <p className="feedback-ai-note">
            <Icon name="sparkles" folder="feedback-details" />
            {tr(
              'AI analysis helps you spot patterns. Always read the original feedback for the full context.',
            )}
          </p>
        </aside>
      </div>
    </section>
  );
}
