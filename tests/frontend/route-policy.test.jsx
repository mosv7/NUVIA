import { it, expect } from 'vitest';
import { routePolicy } from '../../src/frontend/src/auth/route-policy.js';
it('guards private routes and resumes persisted setup while keeping design previews separate', () => {
  expect(routePolicy({ route: 'dashboard', user: null }).redirect).toBe('login');
  expect(
    routePolicy({ route: 'dashboard', user: { emailVerified: true }, workspace: null }).redirect,
  ).toBe('business-information');
  expect(
    routePolicy({
      route: 'feedbacks',
      user: { emailVerified: true },
      workspace: { onboardingStep: 'branches' },
    }).redirect,
  ).toBe('business-setup');
  expect(routePolicy({ route: 'dashboard', preview: true }).allow).toBe(true);
  expect(
    routePolicy({
      route: 'dashboard',
      user: { emailVerified: true },
      workspace: { onboardingStep: 'complete' },
    }).allow,
  ).toBe(true);
});
