export function screenshotSection(route) {
  const page = route.replace(/^#\//, '').split('?')[0];
  if (page === 'landing') return 'landing';
  if (['login', 'signup', 'forgot', 'reset'].includes(page) || page.startsWith('verify-email'))
    return 'authentication';
  if (['business-information', 'business-error', 'business-setup', 'get-started'].includes(page))
    return 'onboarding';
  if (page.startsWith('dashboard')) return 'overview';
  if (page === 'customer-feedback') return 'customer-feedback';
  if (page.startsWith('feedback')) return 'feedbacks';
  if (page.startsWith('analytics-')) return 'analytics';
  if (page.startsWith('report')) return 'reports';
  if (page.startsWith('survey-')) return 'surveys';
  if (page.startsWith('business') || page.startsWith('branch')) return 'business';
  if (page.startsWith('settings')) return 'settings';
  if (page === 'nuvia-assistant') return 'assistant';
  if (page === 'notifications') return 'notifications';
  if (page === 'subscription') return 'subscription';
  throw new Error(`No screenshot section configured for ${route}`);
}
export function screenshotPath(view, language, route, state) {
  return `screens/${screenshotSection(route)}/${view}/${language}/${route.replace('?id=', '-')}${state ? '-empty' : ''}.png`;
}
