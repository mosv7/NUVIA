import { safeLocalStorage } from '../../lib/storage.js';
import { useState } from 'react';
import { ProductProvider, useProductView } from '../../app/providers/ProductProvider.jsx';
import FeedbackShell from '../../components/layout/WorkspaceShell.jsx';
import { useWorkspaceScale } from '../../hooks/useWorkspaceScale.js';
import ChoiceMenu from '../../components/ui/ChoiceMenu.jsx';
import { actionItems, getAction, getActionEvidence } from '../insights/action-data.js';
import { PreviewArrow } from '../reports/preview/PreviewControls.jsx';
import './feedback-screens.css';
import '../insights/action-evidence.css';

export default function ActionEvidencePage({ page, language, setLanguage }) {
  useWorkspaceScale();
  const [menuOpen, setMenuOpen] = useState(false);
  return (
    <ProductProvider
      language={language}
      setLanguage={setLanguage}
      menuOpen={menuOpen}
      onNavigate={() => setMenuOpen(false)}
    >
      <div className="product-page" data-menu-open={menuOpen}>
        <button
          className="product-mobile-toggle"
          aria-label={language === 'ar' ? 'قائمة التنقل' : 'Navigation menu'}
          onClick={() => setMenuOpen(!menuOpen)}
        >
          ☰
        </button>
        {menuOpen && (
          <button
            className="product-menu-backdrop"
            aria-label={language === 'ar' ? 'إغلاق القائمة' : 'Close navigation'}
            onClick={() => setMenuOpen(false)}
          />
        )}
        <FeedbackShell title={page === 'action-board' ? 'Action board' : 'Supporting Evidence'}>
          {page === 'action-board' ? <ActionBoard /> : <Evidence />}
        </FeedbackShell>
      </div>
    </ProductProvider>
  );
}
function ActionBoard() {
  const { tr, language, formatNumber } = useProductView(),
    [filter, setFilter] = useState('all'),
    [dirty, setDirty] = useState({}),
    [saved, setSaved] = useState({});
  const [records, setRecords] = useState(() => {
    try {
      return JSON.parse(safeLocalStorage.getItem('nuvia-action-board-v1')) || {};
    } catch {
      return {};
    }
  });
  const update = (id, patch) =>
    setRecords((previous) => {
      const next = { ...previous, [id]: { ...previous[id], ...patch } };
      setDirty((current) => ({ ...current, [id]: true }));
      setSaved((current) => ({ ...current, [id]: false }));
      return next;
    });
  const save = (id) => {
    let stored = {};
    try {
      stored = JSON.parse(safeLocalStorage.getItem('nuvia-action-board-v1')) || {};
    } catch {
      /* Missing or invalid local preferences use the default state. */
    }
    safeLocalStorage.setItem(
      'nuvia-action-board-v1',
      JSON.stringify({ ...stored, [id]: records[id] }),
    );
    setDirty((current) => ({ ...current, [id]: false }));
    setSaved((current) => ({ ...current, [id]: true }));
  };
  const status = (id) => records[id]?.status || 'todo',
    done = actionItems.filter((item) => status(item.id) === 'done').length;
  const visible = actionItems.filter((item) => filter === 'all' || status(item.id) === filter);
  return (
    <section className="feedback-screen action-screen">
      <button
        className="feedback-text-btn action-back"
        onClick={() => (location.hash = '/dashboard')}
      >
        <PreviewArrow direction="back" />
        {tr('Back to Overview')}
      </button>
      <div className="feedback-heading">
        <div>
          <h1>{tr('Action board')}</h1>
          <p>{tr('Turn recommendations into clear next steps.')}</p>
        </div>
      </div>
      <div className="action-summary">
        <span>
          {formatNumber(actionItems.length)} {tr('actions')}
        </span>
        <span>
          {formatNumber(done)} {tr('completed')}
        </span>
        <ChoiceMenu
          value={filter}
          onChange={setFilter}
          icon={false}
          density="compact"
          label={tr('Status')}
          options={[
            ['all', 'All actions'],
            ['todo', 'Not started'],
            ['progress', 'In progress'],
            ['done', 'Completed'],
          ].map(([value, label]) => ({ value, label: tr(label) }))}
        />
      </div>
      <div className="action-cards">
        {visible.map((item) => (
          <article className="action-card" key={item.id}>
            <div className="action-card-heading">
              <h2>{tr(item.title)}</h2>
              <span
                className={
                  'feedback-badge ' + (item.priority === 'High priority' ? 'negative' : 'info')
                }
              >
                {tr(item.priority)}
              </span>
            </div>
            <p>{tr(item.summary)}</p>
            <div className="action-meta">
              <small>{tr(item.branch)}</small>
              <span className="action-status" data-status={status(item.id)}>
                {tr(
                  status(item.id) === 'done'
                    ? 'Completed'
                    : status(item.id) === 'progress'
                      ? 'In progress'
                      : 'Not started',
                )}
              </span>
              {dirty[item.id] && (
                <small>{language === 'ar' ? 'تغييرات غير محفوظة' : 'Unsaved changes'}</small>
              )}
            </div>
            <div className="action-fields">
              <label>
                <span>{tr('Status')}</span>
                <ChoiceMenu
                  value={status(item.id)}
                  onChange={(value) => update(item.id, { status: value })}
                  icon={false}
                  density="compact"
                  label={tr('Status')}
                  options={[
                    ['todo', 'Not started'],
                    ['progress', 'In progress'],
                    ['done', 'Completed'],
                  ].map(([value, label]) => ({ value, label: tr(label) }))}
                />
              </label>
              <label>
                <span>{tr('Owner')}</span>
                <input
                  value={records[item.id]?.owner || ''}
                  placeholder={tr('Unassigned')}
                  aria-label={tr('Owner') + ' — ' + tr(item.title)}
                  onChange={(e) => update(item.id, { owner: e.target.value })}
                />
              </label>
              <label>
                <span>{tr('Due date')}</span>
                <input
                  className="action-date"
                  type="date"
                  lang={language}
                  value={records[item.id]?.due || ''}
                  aria-label={tr('Due date') + ' — ' + tr(item.title)}
                  onChange={(e) => update(item.id, { due: e.target.value })}
                />
              </label>
            </div>
            <div className="action-card-footer">
              <div className="action-save-row">
                <button
                  className="feedback-btn feedback-primary"
                  disabled={!dirty[item.id]}
                  onClick={() => save(item.id)}
                >
                  {tr('Save changes')}
                </button>
                <span role="status">
                  {saved[item.id]
                    ? language === 'ar'
                      ? 'تم الحفظ في المعاينة'
                      : 'Saved in preview'
                    : ''}
                </span>
              </div>
              <button
                className="feedback-btn action-evidence-button"
                onClick={() => (location.hash = '/evidence?action=' + item.id)}
              >
                {tr('View evidence')}
                <PreviewArrow />
              </button>
            </div>
          </article>
        ))}
      </div>
      {!visible.length && <p className="action-empty">{tr('No actions match this status.')}</p>}
    </section>
  );
}
function Evidence() {
  const { tr, language, formatNumber } = useProductView();
  const id = new URLSearchParams(location.hash.split('?')[1]).get('action') || 'wait',
    item = getAction(id),
    rows = getActionEvidence(item.id);
  return (
    <section className="feedback-screen action-screen">
      <button
        className="feedback-text-btn action-back"
        onClick={() => (location.hash = '/dashboard')}
      >
        <PreviewArrow direction="back" />
        {tr('Back to Overview')}
      </button>
      <div className="feedback-heading">
        <div>
          <h1>{tr('Supporting Evidence')}</h1>
          <p>{tr(item.title)}</p>
        </div>
      </div>
      <div className="action-summary">
        <span>
          {formatNumber(rows.length)} {tr('matching responses')}
        </span>
        <span>{tr(item.branch)}</span>
      </div>
      <p className="evidence-sample-note">
        {tr('Available sample responses related to this recommendation.')}
      </p>
      <div className="action-cards">
        {rows.map((row) => (
          <article className="action-card evidence-card" key={row.id}>
            <div className="action-card-heading">
              <small>
                #{formatNumber(row.id)} · {tr(row.branch)} ·{' '}
                {new Date(row.date + 'T12:00:00').toLocaleDateString(
                  language === 'ar' ? 'ar-EG' : 'en-GB',
                )}
              </small>
              <span
                className={
                  'feedback-badge ' +
                  ({
                    Positive: 'positive',
                    Negative: 'negative',
                    Neutral: 'neutral',
                    Mixed: 'warning',
                  }[row.sentiment] || 'neutral')
                }
              >
                {tr(row.sentiment)}
              </span>
            </div>
            <blockquote lang={row.language === 'Arabic' ? 'ar' : 'en'} dir="auto">
              {row.text}
            </blockquote>
            <small>{row.aspects.map(tr).join(language === 'ar' ? '، ' : ', ')}</small>
            <button
              className="feedback-btn action-evidence-button"
              onClick={() => (location.hash = '/feedback-details?id=' + row.id)}
            >
              {tr('Open Response')}
              <PreviewArrow />
            </button>
          </article>
        ))}
      </div>
      {!rows.length && (
        <p className="action-empty">{tr('No matching sample responses are available.')}</p>
      )}
    </section>
  );
}
