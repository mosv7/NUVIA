import { beforeEach, afterEach, it, expect, vi } from 'vitest';
beforeEach(() => vi.resetModules());
afterEach(() => {
  vi.unstubAllEnvs();
  history.replaceState(null, '', '/');
});
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

it('builds connected survey links from the exact current browser origin', async () => {
  history.replaceState(null, '', '/#/surveys');
  const { connectedSurveyUrl } = await import('../src/config/links.js');
  const url = connectedSurveyUrl('abc123', 'main');
  const parsed = new URL(url);
  expect(parsed.origin).toBe(window.location.origin);
  expect(parsed.hash).toBe('#/public-survey?code=abc123&branch=main');
  expect(connectedSurveyUrl('')).toBe('');
});
