import { describe, it, expect } from 'vitest';
import { routes, readHashRoute } from '../src/app/router/routes.js';
import { routeForAction } from '../src/components/layout/navigation.js';
import { afterLogin } from '../src/app/router/access-policy.js';
describe('hash routing', () => {
  it.each(routes)('resolves the registered %s route', (route) => {
    expect(readHashRoute('#/' + route)).toBe(route);
    expect(readHashRoute('#/' + route + '?id=42')).toBe(route);
  });
  it.each(['', '#/', '#/missing', '#/../settings'])('falls back for invalid hashes %s', (hash) =>
    expect(readHashRoute(hash)).toBe('landing'),
  );
  it('keeps the route registry unique', () => expect(new Set(routes).size).toBe(routes.length));
  it('maps reviewed English and translated actions', () => {
    expect(routeForAction('Create Survey')).toBe('#/survey-create');
    expect(
      routeForAction('التحليلات', (label) => (label === 'Analytics' ? 'التحليلات' : label)),
    ).toBe('#/analytics-sentiment');
    expect(routeForAction('Unknown action')).toBeNull();
  });
  it('selects onboarding from the server workspace', () => {
    expect(afterLogin(null)).toBe('business-information');
    expect(afterLogin({ businessName: 'Cafe', industry: 'Food', onboardingStep: 'branches' })).toBe(
      'business-setup',
    );
    expect(afterLogin({ businessName: 'Cafe', industry: 'Food', onboardingStep: 'complete' })).toBe(
      'dashboard',
    );
  });
});
