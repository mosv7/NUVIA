import ErrorBoundary from './components/ui/ErrorBoundary.jsx';
import { PageLoading } from './components/ui/PageState.jsx';
import './styles/page-state.css';
import React, { Suspense } from 'react';
import { createRoot } from 'react-dom/client';
import '@fontsource/manrope/400.css';
import '@fontsource/manrope/500.css';
import '@fontsource/manrope/600.css';
import '@fontsource/dm-sans/600.css';
import '@fontsource/manrope/700.css';
import '@fontsource/manrope/800.css';
import '@fontsource/dm-sans/400.css';
import '@fontsource/dm-sans/500.css';
import '@fontsource/dm-sans/700.css';
import '@fontsource/noto-sans-arabic/400.css';
import '@fontsource/noto-sans-arabic/500.css';
import '@fontsource/noto-sans-arabic/600.css';
import '@fontsource/noto-sans-arabic/700.css';
import App from './app/App.jsx';
import './styles/app.css';
import './styles/site-chrome.css';
createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <ErrorBoundary>
      <Suspense fallback={<PageLoading />}>
        <App />
      </Suspense>
    </ErrorBoundary>
  </React.StrictMode>,
);

import './styles/review.css';

import './styles/mobile-workspace.css';

import './styles/tablet-workspace.css';

import './features/auth/email-verification.css';

import './styles/focus.css';
import './styles/account-controls.css';
