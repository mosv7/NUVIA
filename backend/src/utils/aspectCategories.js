// The AI returns the customer's own words as the aspect ("flat white", "team", "wait", "الأكل").
// The screens and the Aspect filter need a fixed list ("Coffee", "Service", "Wait time"...), so the
// words are grouped here. A word that matches nothing is kept as the customer wrote it.
//
// This list is a starting point: add words as you see real feedback. English and Arabic (incl. Egyptian).
// Keep keywords lowercase; Arabic is compared after normalise() below.

const CATEGORIES = {
  Coffee: [
    "coffee", "flat white", "latte", "cappuccino", "espresso", "americano", "mocha", "cortado", "macchiato", "brew",
    "قهوة", "قهوه", "كابتشينو", "لاتيه", "اسبريسو", "نسكافيه", "موكا", "امريكانو",
  ],
  Food: [
    "food", "meal", "dish", "breakfast", "lunch", "dinner", "brunch", "croissant", "sandwich", "burger", "pizza", "pasta", "salad",
    "dessert", "cake", "pastry", "pastries", "menu", "portion", "taste", "flavor", "flavour", "vegan",
    "اكل", "طعام", "وجبة", "وجبات", "فطار", "فطور", "غداء", "عشاء", "ساندوتش", "ساندويتش", "كرواسون", "حلويات", "طعم", "منيو",
  ],
  Drinks: ["drink", "drinks", "juice", "smoothie", "tea", "shake", "مشروب", "مشروبات", "عصير", "شاي", "سموذي"],
  Service: [
    "service", "staff", "team", "waiter", "waitress", "server", "cashier", "manager", "barista", "host", "employee", "employees",
    "welcome", "welcoming", "attitude", "friendly", "reception",
    "خدمة", "خدمه", "موظف", "موظفين", "الموظفين", "فريق", "الفريق", "طاقم", "الطاقم", "ويتر", "الويتر", "عاملين", "تعامل", "استقبال", "كاشير",
  ],
  "Wait time": [
    "wait", "waited", "waiting", "wait time", "waiting time", "queue", "delay", "slow", "speed", "minutes", "rush", "long wait",
    "انتظار", "استنى", "استنيت", "تاخير", "تأخير", "بطء", "بطيء", "سرعة", "طابور", "دقيقة", "دقايق", "وقت",
  ],
  Ambience: [
    "ambience", "ambiance", "atmosphere", "vibe", "vibes", "music", "noise", "decor", "interior", "lighting", "seating", "seats",
    "setting", "environment", "cozy", "comfortable", "calm", "quiet", "loud",
    "جو", "اجواء", "أجواء", "المكان", "مكان", "موسيقى", "الموسيقى", "صوت", "دوشة", "هدوء", "ديكور", "جلسة", "قعدة", "اضاءة", "اجواء",
  ],
  Value: [
    "price", "prices", "pricing", "value", "cost", "expensive", "cheap", "worth", "bill", "overpriced",
    "سعر", "اسعار", "أسعار", "الاسعار", "غالي", "غالى", "رخيص", "تمن", "التمن", "قيمة", "فاتورة",
  ],
  "Wi-Fi": ["wifi", "wi-fi", "wi fi", "internet", "connection", "واي فاي", "الواي فاي", "وايفاي", "نت", "النت", "انترنت", "الانترنت"],
  Cleanliness: [
    "clean", "cleanliness", "hygiene", "dirty", "restroom", "bathroom", "toilet", "toilets",
    "نظافة", "نضافة", "نضيف", "وسخ", "حمام", "الحمام", "دورة المياه",
  ],
  Location: ["location", "parking", "neighborhood", "neighbourhood", "موقع", "الموقع", "ركنة", "باركنج", "موقف"],
};

// Arabic: drop diacritics and tatweel, unify alef / ya / ta-marbuta, drop the "ال" prefix of each word.
const normalise = (value) =>
  String(value || "")
    .toLowerCase()
    .replace(/[\u064B-\u065F\u0670\u0640]/g, "")
    .replace(/[أإآٱ]/g, "ا")
    .replace(/ى/g, "ي")
    .replace(/ة/g, "ه")
    .replace(/ئ/g, "ي")
    .replace(/[^\p{L}\p{N}\s-]/gu, " ")
    .split(/\s+/)
    .filter(Boolean)
    .map((w) => (w.length > 3 && w.startsWith("ال") ? w.slice(2) : w))
    .join(" ");

// keyword (normalised) -> category. First category in the list wins when a word is listed twice.
const LOOKUP = new Map();
for (const [category, words] of Object.entries(CATEGORIES)) {
  for (const word of words) {
    const key = normalise(word);
    if (key && !LOOKUP.has(key)) LOOKUP.set(key, category);
  }
}
const KEYS_LONGEST_FIRST = [...LOOKUP.keys()].sort((a, b) => b.length - a.length);

const titleCase = (value) => {
  const text = String(value || "").trim();
  return /^[A-Za-z]/.test(text) ? text.charAt(0).toUpperCase() + text.slice(1) : text;
};

// "flat white" -> { name: "Coffee", matched: true }
// "the Wi-Fi"  -> { name: "Wi-Fi",  matched: true }
// "parking lot attendant" -> { name: "Location", matched: true } (whole word inside the phrase)
// "cheesecake" -> { name: "Cheesecake", matched: false }
const categorise = (term) => {
  const key = normalise(term);
  if (!key) return { name: titleCase(term), matched: false };
  if (LOOKUP.has(key)) return { name: LOOKUP.get(key), matched: true };

  const padded = ` ${key} `;
  for (const word of KEYS_LONGEST_FIRST) {
    if (padded.includes(` ${word} `)) return { name: LOOKUP.get(word), matched: true };
  }
  return { name: titleCase(String(term).trim()), matched: false };
};

module.exports = { CATEGORIES, categorise, normalise };
