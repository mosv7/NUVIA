import { useAuth } from './AuthProvider.jsx';
import ConnectedAssistantLauncher from '../../components/ui/ConnectedAssistantLauncher.jsx';
import PreviewWorkspaceContext from '../../features/insights/PreviewWorkspaceContext.jsx';
import { useRouteState } from '../../components/layout/navigation.js';
import GlobalSearch from '../../components/layout/GlobalSearch.jsx';
import { routeForAction, actionIdFromLabel } from '../../components/layout/navigation.js';
import HeaderMenus from '../../components/layout/HeaderMenus.jsx';
import { createContext, useContext, useEffect, useState } from 'react';
import arabic from '../../lib/i18n/product-ar.json';
import { arabicUiNumbers } from '../../lib/number-format.js';
const englishCopy = {
  Feedbacks: 'Feedbacks',
  'All feedbacks': 'All feedbacks',
  'Cafe &workspace': 'Café & workspace',
};
const ProductContext = createContext(null);
export function useProductView() {
  return useContext(ProductContext);
}
export function ProductProvider({
  language,
  setLanguage,
  children,
  onNavigate,
  menuOpen,
  dashboard,
  analytics,
  workspace: workspaceProp,
  onLogout,
  preview: previewProp,
}) {
  const auth = useAuth();
  const preview = previewProp ?? auth?.preview ?? false;
  const workspace = workspaceProp ?? auth?.workspace;
  const identity = auth?.user;
  const [notice, setNotice] = useState('');
  const logout = onLogout ?? auth?.logout;
  const previewWorkspace = useContext(PreviewWorkspaceContext);
  const [query, setQuery] = useRouteState('feedback-search', '');
  const [workspaceQuery, setWorkspaceQuery] = useState('');
  const [topbarMenu, setTopbarMenu] = useState(null);
  const openTopbar = (kind, anchor) =>
    setTopbarMenu((old) => (old?.kind === kind ? null : { kind, anchor }));
  const [isMobile, setIsMobile] = useState(() => window.innerWidth <= 850);
  useEffect(() => {
    const resize = () => setIsMobile(window.innerWidth <= 850);
    addEventListener('resize', resize);
    return () => removeEventListener('resize', resize);
  }, []);
  const formatNumber = (value) => (language === 'ar' ? arabicUiNumbers(value) : String(value));
  const tr = (text) => {
    if (!preview) {
      if (text === 'Welcome back, Sara. Here’s what your customers are telling you.')
        return language === 'ar'
          ? `مرحبًا ${identity?.name || ''}. من هنا تتابع آراء عملائك.`
          : `Welcome back, ${identity?.name || ''}. Track your customer feedback here.`;
      const actual = {
        'Bloom & Co.': workspace?.businessName || '',
        'Cafe &workspace': workspace?.industry || '',
        B: Array.from(workspace?.businessName || '')[0] || '',
        'Sara Ahmed': identity?.name || '',
        12: '0',
      };
      if (Object.hasOwn(actual, text)) return actual[text];
    }
    if (text === 'Bloom & Co.' && previewWorkspace?.biz) return previewWorkspace.biz.name;
    return language === 'ar' ? formatNumber(arabic[text] ?? text) : (englishCopy[text] ?? text);
  };
  const navigateAction = (id) => {
    const route = routeForAction(id);
    if (!route) return false;
    onNavigate?.();
    location.hash = route.slice(1);
    return true;
  };
  const navigateLabel = (label) => navigateAction(actionIdFromLabel(label, tr));
  const action = (id) => {
    if (navigateAction(id)) return;
    if (!preview) {
      setNotice(
        language === 'ar' ? 'هذه الميزة غير متاحة بعد.' : 'This feature is not available yet.',
      );
      return;
    }
    if (id === 'export-report') {
      const r = dashboard?.report,
        f = dashboard?.filters;
      const rows = r
        ? [
            ['Data', 'Illustrative preview data'],
            ['Branch', f.branch],
            ['Start date', f.start],
            ['End date', f.end],
            ['Total responses', r.total],
            ['Positive sentiment', Math.round(r.positivePercent) + '%'],
            ['Customer satisfaction', r.rating === null ? '' : r.rating.toFixed(1) + '/5'],
            ['Completion rate', r.completion === null ? '' : Math.round(r.completion) + '%'],
          ]
        : [
            ['Total responses', 1248],
            ['Positive sentiment', '78%'],
            ['Customer satisfaction', '4.6/5'],
            ['Completion rate', '86%'],
          ];
      const csv =
        '\uFEFFMetric,Value\n' +
        rows
          .map((row) =>
            row.map((value) => '"' + String(value).replaceAll('"', '""') + '"').join(','),
          )
          .join('\n');
      const blob = new Blob([csv], { type: 'text/csv;charset=utf-8' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = 'NUVIA-demo-overview.csv';
      a.click();
      setTimeout(() => URL.revokeObjectURL(url), 0);
      return;
    }
    window.alert(
      language === 'ar'
        ? 'هذه معاينة محلية لبيانات التصميم. هذا الإجراء لم يُربط بخدمة بعد.'
        : 'This is a local preview of the design data. This action is not connected to a service yet.',
    );
  };
  return (
    <ProductContext.Provider
      value={{
        previewWorkspace,
        preview,
        workspace,
        identity,
        logout,
        setNotice,
        topbarMenu,
        setTopbarMenu,
        openTopbar,
        dashboard,
        analytics,
        activeDestination: location.hash.startsWith('#/subscription')
          ? 'Subscription'
          : location.hash.startsWith('#/settings')
            ? 'Settings'
            : location.hash.startsWith('#/business') || location.hash.startsWith('#/branch')
              ? 'Business'
              : location.hash.startsWith('#/analytics')
                ? 'Analytics'
                : location.hash.startsWith('#/report')
                  ? 'Reports'
                  : location.hash.startsWith('#/nuvia-assistant')
                    ? 'NUVIA Assistant'
                    : location.hash.startsWith('#/feedback')
                      ? 'Feedbacks'
                      : location.hash.startsWith('#/survey')
                        ? 'Surveys'
                        : 'Overview',
        language,
        setLanguage,
        tr,
        formatNumber,
        query,
        setQuery,
        workspaceQuery,
        setWorkspaceQuery,
        action,
        navigateAction,
        navigateLabel,
        isMobile,
        menuOpen,
        matches: (text) => {
          const normalize = (x) =>
            x
              .normalize('NFKC')
              .replace(/[\u064b-\u065f]/g, '')
              .toLowerCase();
          const localized = Object.keys(arabic)
            .filter((k) => text.includes(k))
            .map((k) => arabic[k])
            .join(' ');
          return normalize(text + ' ' + localized).includes(normalize(query));
        },
      }}
    >
      {children}
      <GlobalSearch />
      <HeaderMenus />
      {!preview && !['#/nuvia-assistant', '#/assistant'].includes(location.hash.split('?')[0]) && (
        <ConnectedAssistantLauncher />
      )}
      {notice && (
        <div className="product-notice" role="status">
          <span>{notice}</span>
          <button type="button" onClick={() => setNotice('')}>
            ×
          </button>
        </div>
      )}
    </ProductContext.Provider>
  );
}
