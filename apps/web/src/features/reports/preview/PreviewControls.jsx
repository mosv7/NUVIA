import UiArrow from '../../../components/ui/UiArrow.jsx';
import ControlIcon from '../../../components/ui/ControlIcon.jsx';
import { getReport } from './report-library.js';
import arabic from '../../../lib/i18n/product-ar.json';
import WorkspaceScopeControls from '../../dashboard/WorkspaceScopeControls.jsx';
import React, { useState } from 'react';
import ChoiceMenu from '../../../components/ui/ChoiceMenu.jsx';
import { useProductView } from '../../../app/providers/ProductProvider.jsx';
import { asset } from '../../../lib/assets.js';
export function PreviewArrow({ direction = 'external' }) {
  const { language } = useProductView();
  return (
    <UiArrow
      size={16}
      direction={direction === 'external' ? 'forward' : direction}
      rtl={direction !== 'up' && language === 'ar'}
    />
  );
}

const options = {
  branch: [
    ['all', 'All 3 branches'],
    ['cairo', 'Cairo'],
    ['zamalek', 'El Zamalek'],
    ['alex', 'Alex'],
  ],
  period: [
    ['september', '1–30 Sep, 2026'],
    ['august', '1–31 Aug, 2026'],
  ],
  date: [
    ['all', 'Date: All dates'],
    ['september', 'September 2026'],
    ['august', 'August 2026'],
  ],
  language: [
    ['all', 'Language: All languages'],
    ['English', 'English'],
    ['Arabic', 'Arabic'],
  ],
  sort: [
    ['newest', 'Newest first'],
    ['oldest', 'Oldest first'],
  ],
};
export function PreviewFilter({ kind, onChange, currentValue }) {
  const { tr, isMobile } = useProductView();
  const [value, setValue] = useState(options[kind][0][0]);
  const icons = {
    date: 'reports-imgCalendarDays.svg',
    language: 'reports-imgLanguages.svg',
    sort: 'reports-imgArrowDownWideNarrow.svg',
  };
  if (kind === 'sort' && isMobile) {
    const oldest = (currentValue ?? value) === 'oldest';
    const next = oldest ? 'newest' : 'oldest';
    const change = () => {
      setValue(next);
      onChange?.(next);
    };
    return (
      <button
        type="button"
        className="preview-filter report-sort-toggle"
        data-filter-kind="sort"
        aria-label={tr(oldest ? 'Oldest first' : 'Newest first')}
        title={tr(oldest ? 'Oldest first' : 'Newest first')}
        aria-pressed={oldest}
        onClick={change}
      >
        <img
          className="preview-filter-icon"
          src={asset('preview/reports-imgArrowDownWideNarrow.svg')}
          alt=""
          style={{ transform: oldest ? 'rotate(180deg)' : 'rotate(0deg)' }}
        />
      </button>
    );
  }
  return (
    <span
      className="preview-filter"
      data-filter-kind={kind}
      title={tr(
        options[kind].find(([key]) => key === (currentValue ?? value))?.[1] || options[kind][0][1],
      )}
    >
      {kind === 'date' ? (
        <ControlIcon name="date" />
      ) : (
        icons[kind] && (
          <img
            className="preview-filter-icon"
            src={asset('preview/' + icons[kind])}
            alt=""
            style={
              kind === 'sort' && (currentValue ?? value) === 'oldest'
                ? { transform: 'rotate(180deg)' }
                : undefined
            }
          />
        )
      )}
      <ChoiceMenu
        value={currentValue ?? value}
        onChange={(v) => {
          setValue(v);
          onChange?.(v);
        }}
        label={tr(
          {
            branch: 'Branches',
            period: 'Period',
            date: 'Date range',
            language: 'Language',
            sort: 'Sort',
          }[kind],
        )}
        icon={false}
        compact={isMobile}
        density="compact"
        options={options[kind].map(([value, label]) => ({
          value,
          label: tr(label),
          shortLabel: tr(label.replace(/^(Date|Language): /, '')),
        }))}
      />
    </span>
  );
}
export function downloadReport(id = 'september', language = 'en') {
  const report = getReport(id),
    tr = (text) => (language === 'ar' ? (arabic[text] ?? text) : text);
  const text = [
    'NUVIA — ' + tr(report.title),
    tr('Illustrative preview data'),
    tr(report.period) + ' · ' + tr(report.branch),
    '',
    tr('Executive Summary'),
    tr(report.summary),
    '',
    ...report.metrics.map(([label, value]) => tr(label) + ': ' + tr(value)),
    '',
    tr('Prioritized Recommendations'),
    ...report.recommendations.map((item, index) => index + 1 + '. ' + tr(item)),
  ].join('\n');
  const url = URL.createObjectURL(
    new Blob(['\uFEFF' + text], { type: 'text/plain;charset=utf-8' }),
  );
  const link = document.createElement('a');
  link.href = url;
  link.download = 'NUVIA-' + report.id + '-' + language + '.txt';
  link.click();
  setTimeout(() => URL.revokeObjectURL(url), 1000);
}
export function GenerateDialog({ onClose }) {
  const { tr, dashboard } = useProductView();
  return (
    <div className="preview-modal-backdrop" onClick={onClose}>
      <section
        role="dialog"
        aria-modal="true"
        aria-label={tr('Preview report setup')}
        className="preview-modal"
        onClick={(e) => e.stopPropagation()}
        onKeyDown={(e) => {
          if (e.key === 'Escape') onClose();
        }}
      >
        <h2>{tr('Preview report setup')}</h2>
        <p>
          {tr(
            'Choose a sample scope, then open its prepared report. This preview does not create a live AI report.',
          )}
        </p>
        <div className="ds-overview preview-shared-scope">
          <WorkspaceScopeControls />
        </div>
        <div>
          <button autoFocus className="feedback-btn" onClick={onClose}>
            {tr('Cancel')}
          </button>
          <button
            className="feedback-btn feedback-primary"
            onClick={() => {
              const branch = dashboard.filters.branch;
              const id =
                branch === 'Cairo'
                  ? 'cairo'
                  : branch === 'El Zamalek'
                    ? 'service'
                    : dashboard.filters.start.startsWith('2026-08')
                      ? 'august'
                      : 'september';
              onClose();
              location.hash = '/report-details?id=' + id;
            }}
          >
            {tr('Open sample report')}
          </button>
        </div>
      </section>
    </div>
  );
}
