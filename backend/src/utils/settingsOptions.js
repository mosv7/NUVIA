// Allowed values for the Language settings screen. The frontend can render its dropdowns from these.
const DISPLAY_LANGUAGES = [
  { value: 'en-GB', label: 'English (United Kingdom)' },
  { value: 'en-US', label: 'English (United States)' },
  { value: 'ar-EG', label: 'العربية (مصر)' },
  { value: 'ar-SA', label: 'العربية (السعودية)' },
];

const isTimeZone = (tz) => {
  try {
    new Intl.DateTimeFormat('en', { timeZone: tz });
    return true;
  } catch {
    return false;
  }
};

module.exports = { DISPLAY_LANGUAGES, isTimeZone };
