import { describe, it, expect, vi, afterEach } from 'vitest';
import { render, screen, fireEvent, cleanup } from '@testing-library/react';
import { Suspense } from 'react';
import ErrorBoundary from '../src/components/ui/ErrorBoundary.jsx';
import { PageLoading } from '../src/components/ui/PageState.jsx';
afterEach(() => {
  cleanup();
  document.documentElement.lang = 'en';
  vi.restoreAllMocks();
});
describe('page recovery', () => {
  it('shows loading while a page is suspended', () => {
    const pending = new Promise(() => {});
    function Pending() {
      throw pending;
    }
    render(
      <Suspense fallback={<PageLoading />}>
        <Pending />
      </Suspense>,
    );
    expect(screen.getByRole('status').textContent).toContain('Loading page');
  });
  it('recovers from a rendering failure and keeps healthy markup unchanged', () => {
    vi.spyOn(console, 'error').mockImplementation(() => {});
    let fail = true;
    function Page() {
      if (fail) throw new Error('Synthetic render failure');
      return <p>Page ready</p>;
    }
    render(
      <ErrorBoundary
        onRetry={() => {
          fail = false;
        }}
      >
        <Page />
      </ErrorBoundary>,
    );
    expect(screen.getByRole('alert')).toBeTruthy();
    fireEvent.click(screen.getByRole('button', { name: 'Try again' }));
    expect(screen.getByText('Page ready')).toBeTruthy();
    expect(screen.queryByRole('alert')).toBeNull();
  });
  it('announces the fallback in Arabic', () => {
    document.documentElement.lang = 'ar';
    render(<PageLoading />);
    expect(screen.getByRole('status').textContent).toContain('جارٍ تحميل');
    expect(screen.getByRole('status').getAttribute('dir')).toBe('rtl');
  });
});
