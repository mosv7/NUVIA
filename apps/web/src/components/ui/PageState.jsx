function isArabic() {
  return (
    document.documentElement.lang === 'ar' ||
    new URLSearchParams(location.search).get('lang') === 'ar'
  );
}
export function PageLoading() {
  const ar = isArabic();
  return (
    <div className="app-page-state" role="status" aria-live="polite" dir={ar ? 'rtl' : 'ltr'}>
      <span className="app-loading-indicator" aria-hidden="true" />
      {ar ? 'جارٍ تحميل الصفحة…' : 'Loading page…'}
    </div>
  );
}
export function PageFailure({ onRetry }) {
  const ar = isArabic();
  return (
    <main className="app-page-state" role="alert" dir={ar ? 'rtl' : 'ltr'}>
      <h1>{ar ? 'تعذر تحميل الصفحة' : 'Could not load this page'}</h1>
      <p>
        {ar
          ? 'حاول مرة أخرى. إذا استمرت المشكلة، تأكد من اتصالك بالإنترنت.'
          : 'Try again. If the problem continues, check your internet connection.'}
      </p>
      <button type="button" onClick={onRetry}>
        {ar ? 'إعادة المحاولة' : 'Try again'}
      </button>
    </main>
  );
}
