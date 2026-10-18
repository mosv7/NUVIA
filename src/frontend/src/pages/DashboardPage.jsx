import React, { useEffect, useState } from 'react';
import { asset } from '../assets.js';
import { ProductProvider } from '../product/ProductContext.jsx';
import OverviewDesign from '../product/designs/OverviewDesign.jsx';
import Assistant from '../product/Assistant.jsx';
import '../product/assistant.css';
import '../product/product.css';

import { OverviewDateDialog } from '../product/OverviewControls.jsx';
import { defaultOverviewFilters, getOverviewReport } from '../product/overview-report.js';
import arabic from '../product/ar.json';
export default function DashboardPage({ language, setLanguage, empty = false }) {
  const [menuOpen, setMenuOpen] = useState(false);
  const [filters, setFilters] = useState(() => ({ ...defaultOverviewFilters }));
  const [dateOpen, setDateOpen] = useState(false);
  const filtered =
    filters.branch !== 'all' ||
    filters.start !== defaultOverviewFilters.start ||
    filters.end !== defaultOverviewFilters.end;
  const dashboard = {
    isFiltered: filtered,
    reset: () => setFilters({ ...defaultOverviewFilters }),
    filters,
    setFilters,
    report: getOverviewReport(filters),
    openDate: () => setDateOpen(true),
  };
  const tr = (text) => (language === 'ar' ? (arabic[text] ?? text) : text);
  useEffect(() => {
    const fit = () =>
      document.documentElement.style.setProperty(
        '--overview-scale',
        String(Math.max(1, document.documentElement.clientWidth / 1440)),
      );
    fit();
    addEventListener('resize', fit);
    return () => {
      removeEventListener('resize', fit);
      document.documentElement.style.removeProperty('--overview-scale');
    };
  }, []);
  useEffect(() => {
    const close = (e) => {
      if (e.key === 'Escape') setMenuOpen(false);
    };
    addEventListener('keydown', close);
    return () => removeEventListener('keydown', close);
  }, []);
  return (
    <ProductProvider
      dashboard={dashboard}
      language={language}
      setLanguage={setLanguage}
      menuOpen={menuOpen}
      onNavigate={() => setMenuOpen(false)}
    >
      <div className="product-page" data-menu-open={menuOpen}>
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
        <Assistant />
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
