import React from 'react';
import { render } from '@testing-library/react';
import { afterEach, beforeEach, expect, it, vi } from 'vitest';
import ResponsiveChart from '../src/features/analytics/preview/ResponsiveChart.jsx';

beforeEach(() => {
  vi.stubGlobal(
    'ResizeObserver',
    class {
      observe() {}
      disconnect() {}
    },
  );
  vi.spyOn(HTMLElement.prototype, 'clientWidth', 'get').mockReturnValue(900);
});
afterEach(() => {
  vi.restoreAllMocks();
  vi.unstubAllGlobals();
});

it('fills desktop width while preserving chart proportions when explicitly enabled', () => {
  vi.stubGlobal('innerWidth', 1440);
  const { container } = render(
    <ResponsiveChart width={600} height={200} fillDesktop>
      <div />
    </ResponsiveChart>,
  );
  expect(container.querySelector('.responsive-chart')).toHaveStyle({ height: '300px' });
  expect(container.querySelector('.responsive-chart-canvas')).toHaveStyle({
    transform: 'scale(1.5)',
  });
});
it('retains original scale for other charts and for mobile', () => {
  vi.stubGlobal('innerWidth', 360);
  const { container, rerender } = render(
    <ResponsiveChart width={600} height={200} fillDesktop>
      <div />
    </ResponsiveChart>,
  );
  expect(container.querySelector('.responsive-chart-canvas')).toHaveStyle({
    transform: 'scale(1)',
  });
  vi.stubGlobal('innerWidth', 1440);
  rerender(
    <ResponsiveChart width={600} height={200}>
      <div />
    </ResponsiveChart>,
  );
  expect(container.querySelector('.responsive-chart-canvas')).toHaveStyle({
    transform: 'scale(1)',
  });
});
