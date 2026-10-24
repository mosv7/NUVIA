import { overviewPreset } from '../../dashboard/overview-report.js';
import { getReport } from './report-library.js';
import Assistant from '../../ai-analysis/preview/Assistant.jsx';
import '../../ai-analysis/preview/assistant.css';
import { OverviewDateDialog } from '../../dashboard/OverviewControls.jsx';
import arabic from '../../../lib/i18n/product-ar.json';
import { useWorkspaceScale } from '../../../hooks/useWorkspaceScale.js';
import React, { useState, useEffect } from 'react';
import { ProductProvider } from '../../../app/providers/ProductProvider.jsx';
import FeedbackShell from '../../../components/layout/WorkspaceShell.jsx';
import AssistantScreen from './AssistantScreen.jsx';
import ReportsScreen from './ReportsScreen.jsx';
import ReportDetailsScreen from './ReportDetailsScreen.jsx';
export default function ExtraPreviewPage({
  page,
  language,
  setLanguage,
  preview = true,
  workspace,
  onLogout,
}) {
  useWorkspaceScale();
  const [filters, setFilters] = useState(() =>
    preview
      ? { branch: 'all', start: '2026-09-01', end: '2026-09-30' }
      : { branch: 'all', ...overviewPreset('30') },
  );
  const [dateOpen, setDateOpen] = useState(false);
  const dashboard = { filters, setFilters, openDate: () => setDateOpen(true) };
  const tr = (text) => (language === 'ar' ? (arabic[text] ?? text) : text);
  const [menuOpen, setMenuOpen] = useState(false);
  useEffect(() => {
    window.scrollTo(0, 0);
    setMenuOpen(false);
  }, [page]);
  return (
    <ProductProvider
      preview={preview}
      workspace={workspace}
      onLogout={onLogout}
      dashboard={dashboard}
      language={language}
      setLanguage={setLanguage}
      menuOpen={menuOpen}
      onNavigate={() => setMenuOpen(false)}
    >
      <div className="product-page extra-preview-page" data-menu-open={menuOpen}>
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
            aria-label="Close navigation"
            onClick={() => setMenuOpen(false)}
          />
        )}
        <FeedbackShell
          title={
            page === 'nuvia-assistant'
              ? 'NUVIA Assistant'
              : page === 'report-details'
                ? tr('Reports') +
                  ' / ' +
                  tr(
                    getReport(
                      new URLSearchParams(location.hash.split('?')[1]).get('id') || 'september',
                    ).title,
                  )
                : 'Reports'
          }
        >
          {page === 'nuvia-assistant' ? (
            <AssistantScreen />
          ) : page === 'reports' ? (
            <ReportsScreen />
          ) : (
            <ReportDetailsScreen />
          )}
        </FeedbackShell>
        {page !== 'nuvia-assistant' && <Assistant />}
        <OverviewDateDialog
          open={dateOpen}
          onClose={() => setDateOpen(false)}
          filters={filters}
          onApply={(range) => setFilters((old) => ({ ...old, ...range }))}
          language={language}
          tr={tr}
        />
      </div>
    </ProductProvider>
  );
}
