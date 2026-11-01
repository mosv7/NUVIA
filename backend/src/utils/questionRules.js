// Rules that depend on the question type: which types have options, and what goes in `settings`.
// Unknown settings keys are dropped, so the frontend cannot store arbitrary data.

const CHOICE_TYPES = ['multiple_choice', 'dropdown'];
const isChoiceType = (type) => CHOICE_TYPES.includes(type);

const pickLabel = (value, fallback) => ({
  en: typeof value?.en === 'string' ? value.en.trim().slice(0, 100) : fallback.en,
  ar: typeof value?.ar === 'string' ? value.ar.trim().slice(0, 100) : fallback.ar,
});

const clampInt = (value, min, max, fallback) => {
  const n = Number(value);
  return Number.isInteger(n) ? Math.min(max, Math.max(min, n)) : fallback;
};

const DEFAULT_LOWEST = { en: 'Very poor', ar: 'ضعيف جدًا' };
const DEFAULT_HIGHEST = { en: 'Excellent', ar: 'ممتاز' };

const normalizeSettings = (type, settings = {}) => {
  const s = settings && typeof settings === 'object' ? settings : {};

  switch (type) {
    case 'rating':
      return {
        stars: clampInt(s.stars, 3, 10, 5),
        lowestLabel: pickLabel(s.lowestLabel, DEFAULT_LOWEST),
        highestLabel: pickLabel(s.highestLabel, DEFAULT_HIGHEST),
      };
    case 'multiple_choice':
      return { allowMultiple: s.allowMultiple === true };
    case 'short_text':
      return { maxLength: clampInt(s.maxLength, 1, 500, 200) };
    case 'long_text':
      return { maxLength: clampInt(s.maxLength, 1, 5000, 1000) };
    default: // dropdown, yes_no
      return {};
  }
};

module.exports = { isChoiceType, normalizeSettings };
