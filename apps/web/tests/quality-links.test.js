import { beforeEach, afterEach, it, expect, vi } from 'vitest';
beforeEach(() => vi.resetModules());
afterEach(() => vi.unstubAllEnvs());
it('uses the configured survey URL for displayed, copied and branch links', async () => {
  vi.stubEnv('VITE_PUBLIC_SURVEY_URL', 'https://example.test/response?survey=approved');
  const { PUBLIC_SURVEY_URL, displaySurveyUrl, branchSurveyUrl } =
    await import('../src/config/links.js');
  expect(PUBLIC_SURVEY_URL).toBe('https://example.test/response?survey=approved');
  expect(displaySurveyUrl()).toBe('example.test/response?survey=approved');
  const branch = new URL(branchSurveyUrl('El Zamalek'));
  expect(branch.searchParams.get('survey')).toBe('approved');
  expect(branch.searchParams.get('b')).toBe('El Zamalek');
});
