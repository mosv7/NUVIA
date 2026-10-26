import { describe, it, expect } from 'vitest';
const pages = {
  analytics: () => import('../src/features/analytics/preview/AnalyticsPage.jsx'),
  surveys: () => import('../src/features/surveys/preview/SurveyPage.jsx'),
  reports: () => import('../src/features/reports/preview/ExtraPreviewPage.jsx'),
  workspace: () => import('../src/features/workspace/WorkspacePages.jsx'),
};
describe('lazy page entry points', () => {
  it.each(Object.keys(pages))(
    'initializes %s without cyclic or declaration-order failures',
    async (name) => {
      const page = await pages[name]();
      expect(typeof page.default).toBe('function');
    },
  );
});
