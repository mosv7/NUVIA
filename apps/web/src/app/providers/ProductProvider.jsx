import React, { createContext, useContext, useEffect, useState } from 'react';
import arabic from '../../lib/i18n/product-ar.json';
import { arabicUiNumbers } from '../../lib/number-format.js';
import { useAuth } from './AuthProvider.jsx';
const englishCopy = {
  Feedbacks: 'Feedback',
  'All feedbacks': 'All feedback',
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
  workspace,
  onLogout,
  preview = false,
}) {
  const identity = useAuth()?.user;
  const [query, setQuery] = useState('');
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
      const selectedBranch = workspace?.branches?.find((branch) => branch.id === text);
      if (selectedBranch) return selectedBranch.name;
      const actual = {
        'Bloom & Co.': workspace?.businessName || '',
        'Cafe &workspace': workspace?.industry || '',
        B: Array.from(workspace?.businessName || '')[0] || '',
        'Sara Ahmed': identity?.name || '',
        12: '0',
        'All 3 branches': language === 'ar' ? 'كل الفروع' : 'All branches',
      };
      if (Object.hasOwn(actual, text)) return actual[text];
    }
    return language === 'ar' ? formatNumber(arabic[text] ?? text) : (englishCopy[text] ?? text);
  };
  const [notice, setNotice] = useState('');
  const action = (label) => {
    if (!preview && !['Overview', 'Feedbacks', 'Feedbacks 12', 'All feedbacks'].includes(label)) {
      if (label === 'B Bloom & Co. Cafe &workspace' || label === 'Settings') {
        location.hash = '/business-information';
        return;
      }
      setNotice(
        language === 'ar' ? 'هذه الميزة غير متاحة بعد.' : 'This feature is not available yet.',
      );
      return;
    }
    if (label === 'NUVIA Assistant') {
      window.dispatchEvent(new Event('nuvia:ask'));
      return;
    }
    const feedbackLabels = [
      'Feedbacks',
      'Feedbacks 12',
      'All responses →',
      'Explore all 1,250 reviews →',
      'All feedbacks',
    ];
    if (label === 'Overview' || feedbackLabels.includes(label)) {
      onNavigate?.();
      location.hash = label === 'Overview' ? '/dashboard' : '/feedbacks';
      return;
    }
    if (label === 'View evidence ↗') {
      onNavigate?.();
      location.hash = '/feedback-details?id=1248';
      return;
    }
    if (label === 'Export report') {
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
        dashboard,
        workspace,
        preview,
        activeDestination: location.hash.startsWith('#/feedback') ? 'Feedbacks' : 'Overview',
        language,
        setLanguage,
        tr,
        formatNumber,
        query,
        setQuery,
        action,
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
      {!preview && (
        <div className="workspace-account-actions">
          <button
            onClick={() =>
              onLogout?.().catch(() =>
                setNotice(
                  language === 'ar'
                    ? 'تعذر تسجيل الخروج من الخادم. حاول مرة أخرى.'
                    : 'Could not log out from the server. Please try again.',
                ),
              )
            }
          >
            {language === 'ar' ? 'تسجيل الخروج' : 'Log out'}
          </button>
        </div>
      )}
      {notice && (
        <div className="workspace-action-notice" role="status">
          {notice}
          <button onClick={() => setNotice('')} aria-label={language === 'ar' ? 'إغلاق' : 'Close'}>
            ×
          </button>
        </div>
      )}
    </ProductContext.Provider>
  );
}
