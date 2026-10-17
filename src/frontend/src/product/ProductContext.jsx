import React, { createContext, useContext, useEffect, useState } from 'react';
import arabic from './ar.json';
import { arabicUiNumbers } from './number-format.js';
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
}) {
  const [query, setQuery] = useState('');
  const [isMobile, setIsMobile] = useState(() => window.innerWidth <= 850);
  useEffect(() => {
    const resize = () => setIsMobile(window.innerWidth <= 850);
    addEventListener('resize', resize);
    return () => removeEventListener('resize', resize);
  }, []);
  const formatNumber = (value) => (language === 'ar' ? arabicUiNumbers(value) : String(value));
  const tr = (text) =>
    language === 'ar' ? formatNumber(arabic[text] ?? text) : (englishCopy[text] ?? text);
  const action = (label) => {
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
      const blob = new Blob(
        [
          '\uFEFFMetric,Value\nTotal responses,1248\nPositive sentiment,78%\nCustomer satisfaction,4.6/5\nCompletion rate,86%',
        ],
        { type: 'text/csv;charset=utf-8' },
      );
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
    </ProductContext.Provider>
  );
}
