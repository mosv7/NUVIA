import { useWorkspaceScale } from '../../hooks/useWorkspaceScale.js';
import { useEffect, useState } from 'react';
import { asset } from '../../lib/assets.js';
import { ProductProvider } from '../../app/providers/ProductProvider.jsx';
import WorkspaceShell from '../../components/layout/WorkspaceShell.jsx';
import Assistant from '../ai-analysis/preview/Assistant.jsx';
import '../ai-analysis/preview/assistant.css';
import { FeedbackList, FeedbackDetail } from './FeedbackScreens.jsx';
export default function FeedbacksPage({
  page,
  language,
  setLanguage,
  workspace,
  onLogout,
  preview = false,
}) {
  const [menuOpen, setMenuOpen] = useState(false);
  useWorkspaceScale();
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
        <WorkspaceShell title={page === 'feedback-details' ? 'Feedback details' : 'Feedbacks'}>
          {preview && page === 'feedback-details' ? (
            <FeedbackDetail key={location.hash} />
          ) : (
            <FeedbackList key={page} empty={!preview || page === 'feedbacks-empty'} />
          )}
        </WorkspaceShell>
        {preview && <Assistant />}
      </div>
    </ProductProvider>
  );
}
