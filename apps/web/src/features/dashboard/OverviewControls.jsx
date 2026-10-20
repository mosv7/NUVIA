import ChoiceMenu from '../../components/ui/ChoiceMenu.jsx';
import React, { useEffect, useRef, useState } from 'react';
import { createPortal } from 'react-dom';

import { useProductView } from '../../app/providers/ProductProvider.jsx';
import { overviewBranches, overviewPreset } from './overview-report.js';
import './overview-controls.css';

export function OverviewBranchSelect() {
  const { tr, dashboard, workspace, preview } = useProductView();
  return (
    <ChoiceMenu
      overlay
      value={dashboard.filters.branch}
      onChange={(branch) => dashboard.setFilters((old) => ({ ...old, branch }))}
      label={tr('Branch')}
      options={[
        { value: 'all', label: tr('All 3 branches'), description: tr('All branches') },
        ...(preview
          ? overviewBranches.map((branch) => ({ value: branch, label: tr(branch) }))
          : (workspace?.branches || []).map((branch) => ({
              value: branch.id,
              label: branch.name,
            }))),
      ]}
    />
  );
}
export function overviewDateLabel(filters, language) {
  const format = (iso) =>
    new Date(iso + 'T12:00:00').toLocaleDateString(language === 'ar' ? 'ar-EG' : 'en-GB', {
      day: 'numeric',
      month: 'short',
      year: 'numeric',
    });
  return format(filters.start) + ' – ' + format(filters.end);
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
