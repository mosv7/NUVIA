import React from 'react';
import { AuthProvider } from './providers/AuthProvider.jsx';
import AppRouter from './router/AppRouter.jsx';
export default function App() {
  const preview =
    location.pathname.startsWith('/preview/') ||
    (location.protocol === 'file:' && window.NUVIA_PREVIEW === true);
  return (
    <AuthProvider preview={preview}>
      {preview && <aside className="preview-notice">Design preview · معاينة التصميم</aside>}
      <AppRouter />
    </AuthProvider>
  );
}
