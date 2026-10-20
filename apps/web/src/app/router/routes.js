export const routes = [
  'landing',
  'dashboard',
  'dashboard-empty',
  'feedbacks',
  'feedbacks-empty',
  'feedback-details',
  'login',
  'signup',
  'forgot',
  'reset',
  'verify-email',
  'business-information',
  'business-error',
  'business-setup',
  'get-started',
];
export const currentRoute = () => {
  const value = location.hash.slice(2).split('?')[0];
  return routes.includes(value) ? value : 'landing';
};
