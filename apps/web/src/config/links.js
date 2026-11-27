export const PUBLIC_SURVEY_URL =
  import.meta.env?.VITE_PUBLIC_SURVEY_URL || 'https://nuvia.link/bloom-feedback';
export const displaySurveyUrl = (url = PUBLIC_SURVEY_URL) => url.replace(/^https?:\/\//, '');
export function branchSurveyUrl(branch) {
  const url = new URL(PUBLIC_SURVEY_URL);
  url.searchParams.set('b', branch);
  return url.toString();
}
