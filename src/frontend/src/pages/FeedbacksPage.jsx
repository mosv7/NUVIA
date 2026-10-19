import React, { useEffect, useState } from 'react';
import { asset } from '../assets.js';
import { ProductProvider } from '../product/ProductContext.jsx';
import FeedbackShell from '../product/FeedbackShell.jsx';
import Assistant from '../product/Assistant.jsx';
import '../product/assistant.css';
import { FeedbackList, FeedbackDetail } from '../product/FeedbackScreens.jsx';
export default function FeedbacksPage({
  page,
  language,
  setLanguage,
  workspace,
  onLogout,
  preview = false,
}) {
  const [menuOpen, setMenuOpen] = useState(false);
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
    setMenuOpen(false);
    window.scrollTo(0, 0);
  }, [page]);
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
          onClick={() => setMenuOpen((v) => !v)}
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
        <FeedbackShell title={page === 'feedback-details' ? 'Feedback details' : 'Feedbacks'}>
          {!preview ? (
            <section className="feedback-empty">
              <h2>{language === 'ar' ? 'لا توجد آراء محفوظة بعد' : 'No feedback collected yet'}</h2>
              <p>
                {language === 'ar'
                  ? 'ستظهر الردود هنا بعد إتاحة جمع آراء العملاء.'
                  : 'Responses will appear here when customer feedback collection is available.'}
              </p>
              <a href="#/dashboard">
                {language === 'ar' ? 'العودة إلى النظرة العامة' : 'Back to Overview'}
              </a>
            </section>
          ) : page === 'feedback-details' ? (
            <FeedbackDetail key={location.hash} />
          ) : (
            <FeedbackList key={page} empty={page === 'feedbacks-empty'} />
          )}
        </FeedbackShell>
        {preview && <Assistant />}
      </div>
    </ProductProvider>
  );
}
