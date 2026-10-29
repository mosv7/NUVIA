// The contract asks us to say whether `language` is declared or detected. We detect it from the
// feedback text itself (Arabic letters vs Latin letters), because a customer can open the English
// page and still write in Arabic. The declared language is stored separately.
const ARABIC = /[\u0600-\u06FF\u0750-\u077F\u08A0-\u08FF\uFB50-\uFDFF\uFE70-\uFEFF]/g;
const LATIN = /[A-Za-z]/g;

const detectLanguage = (text, fallback = "en") => {
  const arabic = (String(text || "").match(ARABIC) || []).length;
  const latin = (String(text || "").match(LATIN) || []).length;
  if (arabic === 0 && latin === 0) return fallback;
  return arabic > latin ? "ar" : "en";
};

module.exports = { detectLanguage };
