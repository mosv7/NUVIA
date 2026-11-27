export const PUBLIC_SURVEY_URL =
  import.meta.env?.VITE_PUBLIC_SURVEY_URL || 'https://nuvia.link/bloom-feedback';
export const displaySurveyUrl = (url = PUBLIC_SURVEY_URL) => url.replace(/^https?:\/\//, '');
export function branchSurveyUrl(branch) {
  const url = new URL(PUBLIC_SURVEY_URL);
  url.searchParams.set('b', branch);
  return url.toString();
}

// Connected surveys must stay on the exact browser origin allowed by the API's
// Origin/CSRF policy. Preview/design links keep their separate configured URL.
const connectedOrigin = () =>
  typeof window !== 'undefined' && window.location?.origin ? window.location.origin : '';

export function connectedSurveyUrl(shortCode, branchSlug) {
  if (!shortCode) return '';
  const origin = connectedOrigin();
  if (!origin) return '';
  const params = new URLSearchParams({ code: String(shortCode) });
  if (branchSlug) params.set('branch', String(branchSlug));
  return `${origin}/#/public-survey?${params.toString()}`;
}
