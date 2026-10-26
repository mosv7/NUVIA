import ErrorBoundary from '../components/ui/ErrorBoundary.jsx';
import { PageLoading } from '../components/ui/PageState.jsx';
import { Suspense } from 'react';
import { AuthProvider } from './providers/AuthProvider.jsx';
import AppRouter from './router/AppRouter.jsx';
export default function App() {
  const preview =
    location.pathname.startsWith('/preview/') ||
    (location.protocol === 'file:' && window.NUVIA_PREVIEW === true);
  const galleryCapture =
    preview && new URLSearchParams(location.search).get('capture') === 'gallery';
  return (
    <AuthProvider preview={preview}>
      {preview && !galleryCapture && (
        <aside className="preview-notice">Design preview · معاينة التصميم</aside>
      )}
      {galleryCapture && (
        <style>{`.product-page { position: relative; } #root .product-page > .nuvia-launcher { position: absolute !important; bottom: 20px !important; right: 20px !important; left: auto !important; } #root .product-page[dir="rtl"] > .nuvia-launcher { right: auto !important; left: 20px !important; }`}</style>
      )}
      <ErrorBoundary>
        <Suspense fallback={<PageLoading />}>
          <AppRouter />
        </Suspense>
      </ErrorBoundary>
    </AuthProvider>
  );
}
