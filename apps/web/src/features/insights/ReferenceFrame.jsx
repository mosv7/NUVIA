import { useWorkspaceScale } from '../../hooks/useWorkspaceScale.js';
import { useState } from 'react';
import { ProductProvider } from '../../app/providers/ProductProvider.jsx';
import FeedbackShell from '../../components/layout/WorkspaceShell.jsx';
import '../../styles/app.css';
import '../../components/layout/workspace-shell.css';
import '../../styles/site-chrome.css';
import '../../styles/review.css';
import '../../styles/mobile-workspace.css';
import '../../styles/tablet-workspace.css';
import '../../styles/account-controls.css';
export default function ReferenceFrame({ children, language, setLanguage, title, page }) {
  useWorkspaceScale();
  const [menuOpen, setMenuOpen] = useState(false);
  return (
    <ProductProvider
      language={language}
      setLanguage={setLanguage}
      menuOpen={menuOpen}
      onNavigate={() => setMenuOpen(false)}
    >
      <div className="product-page reference-frame" data-menu-open={menuOpen}>
        <button
          className="product-mobile-toggle"
          aria-label="Navigation menu"
          aria-expanded={menuOpen}
          onClick={() => setMenuOpen(!menuOpen)}
        >
          <img alt="" src="/assets/dashboard/overview/layout-dashboard.svg" />
        </button>
        {menuOpen && (
          <button
            className="product-menu-backdrop"
            aria-label="Close navigation"
            onClick={() => setMenuOpen(false)}
          />
        )}
        <FeedbackShell title={title}>
          <div className="new-preview-content" data-preview-page={page}>
            {children}
          </div>
        </FeedbackShell>
      </div>
    </ProductProvider>
  );
}
