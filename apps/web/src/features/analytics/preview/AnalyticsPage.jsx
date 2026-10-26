import { lazy } from 'react';
import { useRouteState } from '../../../components/layout/navigation.js';
import { useState } from 'react';
import { useWorkspaceScale } from '../../../hooks/useWorkspaceScale.js';
import { ProductProvider } from '../../../app/providers/ProductProvider.jsx';
import FeedbackShell from '../../../components/layout/WorkspaceShell.jsx';
import Assistant from '../../ai-analysis/preview/Assistant.jsx';
import { OverviewDateDialog } from '../../dashboard/OverviewControls.jsx';
import { defaultOverviewFilters } from '../../dashboard/overview-report.js';
import arabic from '../../../lib/i18n/product-ar.json';

const SentimentAnalytics = lazy(() => import('./SentimentAnalytics.jsx'));
const AspectsAnalytics = lazy(() => import('./AspectsAnalytics.jsx'));
const TopicsAnalytics = lazy(() => import('./TopicsAnalytics.jsx'));
const TrendsAnalytics = lazy(() => import('./TrendsAnalytics.jsx'));
const ComparisonAnalytics = lazy(() => import('./ComparisonAnalytics.jsx'));

const screens = {
  sentiment: SentimentAnalytics,
  aspects: AspectsAnalytics,
  topics: TopicsAnalytics,
  trends: TrendsAnalytics,
  comparison: ComparisonAnalytics,
};
export default function AnalyticsPage({ page, language, setLanguage }) {
  useWorkspaceScale();
  const kind = page.replace('analytics-', '');
  const [menuOpen, setMenuOpen] = useState(false),
    [filters, setFilters] = useRouteState('analytics-scope', () => ({ ...defaultOverviewFilters })),
    [extra, setExtra] = useRouteState('analytics-extra', { language: 'All languages' }),
    [dateOpen, setDateOpen] = useState(false);
  const tr = (text) => (language === 'ar' ? (arabic[text] ?? text) : text);
  const Screen = screens[kind] || SentimentAnalytics;
  const dashboard = { filters, setFilters, openDate: () => setDateOpen(true) };
  const analytics = {
    kind,
    filters: extra,
    setFilters: setExtra,
    changed:
      filters.branch !== 'all' ||
      filters.start !== defaultOverviewFilters.start ||
      filters.end !== defaultOverviewFilters.end ||
      extra.language !== 'All languages' ||
      (kind === 'comparison' && extra.branches && extra.branches.length !== 3),
  };
  return (
    <ProductProvider
      dashboard={dashboard}
      analytics={analytics}
      language={language}
      setLanguage={setLanguage}
      menuOpen={menuOpen}
      onNavigate={() => setMenuOpen(false)}
    >
      <div className="product-page" data-menu-open={menuOpen}>
        <button
          className="product-mobile-toggle"
          aria-label={tr('Navigation menu')}
          aria-expanded={menuOpen}
          onClick={() => setMenuOpen(!menuOpen)}
        >
          ☰
        </button>
        {menuOpen && (
          <button
            className="product-menu-backdrop"
            aria-label={tr('Close navigation')}
            onClick={() => setMenuOpen(false)}
          />
        )}
        <FeedbackShell title="Analytics">
          <Screen />
        </FeedbackShell>
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
