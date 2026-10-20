import { useWorkspaceScale } from '../../hooks/useWorkspaceScale.js';
import React, { useEffect, useState } from 'react';
import { asset } from '../../lib/assets.js';
import { ProductProvider } from '../../app/providers/ProductProvider.jsx';
import OverviewDesign from './designs/OverviewDesign.jsx';
import Assistant from '../ai-analysis/preview/Assistant.jsx';
import '../ai-analysis/preview/assistant.css';
import '../../components/layout/workspace.css';

import { OverviewDateDialog } from './OverviewControls.jsx';
import { defaultOverviewFilters, getOverviewReport, overviewPreset } from './overview-report.js';
import arabic from '../../lib/i18n/product-ar.json';
export default function DashboardPage({
  language,
  setLanguage,
  empty = false,
  workspace,
  onLogout,
  preview = false,
}) {
  const [menuOpen, setMenuOpen] = useState(false);
  const [initialFilters] = useState(() =>
    preview ? { ...defaultOverviewFilters } : { branch: 'all', ...overviewPreset('30') },
  );
  const [filters, setFilters] = useState(() => ({ ...initialFilters }));
  const [dateOpen, setDateOpen] = useState(false);
  const filtered =
    filters.branch !== 'all' ||
    filters.start !== initialFilters.start ||
    filters.end !== initialFilters.end;
  const dashboard = {
    isFiltered: filtered,
    reset: () => setFilters({ ...initialFilters }),
    filters,
    setFilters,
    report: preview ? getOverviewReport(filters) : null,
    openDate: () => setDateOpen(true),
  };
  const tr = (text) => (language === 'ar' ? (arabic[text] ?? text) : text);
  useWorkspaceScale();
  useEffect(() => {
    const close = (e) => {
      if (e.key === 'Escape') setMenuOpen(false);
    };
    addEventListener('keydown', close);
    return () => removeEventListener('keydown', close);
  }, []);
  return (
    <ProductProvider
      workspace={workspace}
      onLogout={onLogout}
      preview={preview}
      dashboard={dashboard}
      language={language}
      setLanguage={setLanguage}
      menuOpen={menuOpen}
      onNavigate={() => setMenuOpen(false)}
    >
      <div className="product-page" data-menu-open={menuOpen} data-account-backed={!preview}>
        <button
          className="product-mobile-toggle"
          aria-label={language === 'ar' ? 'قائمة التنقل' : 'Navigation menu'}
          aria-expanded={menuOpen}
          onClick={() => setMenuOpen(!menuOpen)}
        >
          <img src={asset('dashboard/overview/layout-dashboard.svg')} alt="" />
        </button>
        {menuOpen && (
          <button
            className="product-menu-backdrop"
            aria-label={language === 'ar' ? 'إغلاق القائمة' : 'Close navigation'}
            onClick={() => setMenuOpen(false)}
          />
        )}
        <OverviewDesign empty={empty} />
        {preview && <Assistant />}
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
