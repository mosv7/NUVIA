const publicRoutes = [
  'landing',
  'customer-feedback',
  'login',
  'login-2fa',
  'confirm-email',
  'signup',
  'forgot',
  'reset',
  'verify-email',
];
export function routePolicy({ route, preview = false, user, workspace }) {
  if (preview || publicRoutes.includes(route)) return { allow: true };
  if (!user) return { allow: false, redirect: 'login' };
  if (route === 'business-information') return { allow: true };
  if (route === 'business-error') return { allow: false, redirect: 'business-information' };
  if (!workspace) return { allow: false, redirect: 'business-information' };
  if (route === 'business-setup') return { allow: true };
  if (route === 'get-started' && workspace.onboardingStep === 'welcome') return { allow: true };
  if (workspace.onboardingStep === 'welcome') return { allow: false, redirect: 'get-started' };
  if (workspace.onboardingStep !== 'complete') return { allow: false, redirect: 'business-setup' };
  return { allow: true };
}
export const afterLogin = (workspace) =>
  !workspace
    ? 'business-information'
    : workspace.onboardingStep === 'complete'
      ? 'dashboard'
      : workspace.onboardingStep === 'welcome'
        ? 'get-started'
        : 'business-setup';
