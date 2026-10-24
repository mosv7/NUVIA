const templates = {
  1: ['How was your experience at Bloom & Co.?', 'كيف كانت تجربتك في بلوم آند كو؟', 'Star rating'],
  2: [
    'What did you enjoy most about your visit?',
    'ما أكثر شيء استمتعت به في زيارتك؟',
    'Multiple choice',
  ],
  3: ['How would you rate the speed of our service?', 'كيف تقيّم سرعة خدمتنا؟', 'Star rating'],
  4: [
    'How would you rate our value for money?',
    'كيف تقيّم القيمة مقابل السعر لدينا؟',
    'Star rating',
  ],
  5: ['How likely are you to recommend us?', 'ما مدى احتمالية أن تنصح الآخرين بنا؟', 'NPS'],
  6: [
    'What could we do to make your next visit better?',
    'ماذا يمكننا أن نفعل لتحسين زيارتك القادمة؟',
    'Long text',
  ],
};
export const editorStorageKey = 'nuvia-survey-editor-v1';
export function createEditorQuestions() {
  return Object.fromEntries(
    Object.entries(templates).map(([id, [en, ar, type]]) => [
      id,
      {
        type,
        count: 5,
        required: id !== '6',
        text: { en, ar },
        title: {
          en: {
            1: 'Overall experience',
            2: 'What stood out',
            3: 'Service speed',
            4: 'Value for money',
            5: 'Recommendation',
            6: 'Open feedback',
          }[id],
          ar: {
            1: 'التجربة العامة',
            2: 'أبرز ما لفت انتباهك',
            3: 'سرعة الخدمة',
            4: 'القيمة مقابل السعر',
            5: 'التوصية',
            6: 'رأي مفتوح',
          }[id],
        },
        lowLabel: { en: 'Very poor', ar: 'سيئ جدًا' },
        highLabel: { en: 'Excellent', ar: 'ممتاز' },
        options: {
          en: Array.from({ length: 10 }, (_, i) => 'Option ' + (i + 1)),
          ar: Array.from(
            { length: 10 },
            (_, i) => 'الخيار ' + String(i + 1).replace(/\d/g, (n) => '٠١٢٣٤٥٦٧٨٩'[n]),
          ),
        },
        selection: [0],
        rating: 0,
      },
    ]),
  );
}
export function loadEditorQuestions(storage) {
  const defaults = createEditorQuestions();
  try {
    const saved = JSON.parse(storage.getItem(editorStorageKey) || 'null');
    if (saved && Object.keys(saved).some((id) => /^\d+$/.test(id))) {
      const restored = {};
      for (const id of Object.keys(saved).filter((id) => /^\d+$/.test(id))) {
        const base = defaults[id] || createEditorQuestions()[1];
        if (saved[id])
          restored[id] = {
            ...base,
            ...saved[id],
            text: { ...base.text, ...saved[id].text },
            options: { ...base.options, ...saved[id].options },
          };
      }
      return restored;
    }
    for (const id of Object.keys(defaults))
      for (const lang of ['en', 'ar']) {
        const original = defaults[id].text[lang];
        for (let i = 0; i < storage.length; i++) {
          const key = storage.key(i);
          if (key?.startsWith('survey-preview-field-') && key.endsWith('-' + original)) {
            defaults[id].text[lang] = storage.getItem(key);
            break;
          }
        }
      }
  } catch {
    /* Missing or invalid local preferences use the default state. */
  }
  return defaults;
}
export function updateEditorQuestion(questions, id, patch) {
  const current = questions[id];
  const next = { ...current, ...patch };
  if (patch.count !== undefined) {
    next.rating = Math.min(current.rating, patch.count);
    next.selection = current.selection.filter((index) => index < patch.count);
  }
  return { ...questions, [id]: next };
}
export function loadEditorLanguages(storage) {
  try {
    const value = JSON.parse(storage.getItem('survey-enabled-languages') || 'null');
    const valid = value?.filter((lang) => lang === 'en' || lang === 'ar');
    if (valid?.length) return valid;
  } catch {
    /* Missing or invalid local preferences use the default state. */
  }
  return ['en', 'ar'];
}

export function addEditorQuestion(questions) {
  const id = Math.max(0, ...Object.keys(questions).map(Number)) + 1;
  const item = {
    ...createEditorQuestions()[1],
    text: { en: '', ar: '' },
    title: null,
    selection: [],
    rating: 0,
  };
  return { id, questions: { ...questions, [id]: item } };
}
export function editorQuestionIds(questions) {
  return Object.keys(questions)
    .map(Number)
    .sort((a, b) => a - b);
}
export function createStartingQuestions(startingPoint) {
  if (startingPoint === 'scratch') return addEditorQuestion({}).questions;
  const questions = createEditorQuestions();
  if (startingPoint === 'quick')
    return Object.fromEntries([1, 5, 6].map((id, index) => [index + 1, questions[id]]));
  return questions;
}

export function copyEditorQuestion(questions, id) {
  const nextId = Math.max(0, ...editorQuestionIds(questions)) + 1;
  const item = JSON.parse(JSON.stringify(questions[id]));
  return { id: nextId, questions: { ...questions, [nextId]: item } };
}
export function removeEditorQuestion(questions, id) {
  const ids = editorQuestionIds(questions);
  if (ids.length <= 1) return { id, questions };
  const remaining = ids.filter((value) => value !== id);
  return {
    id: Math.min(id, remaining.length),
    questions: Object.fromEntries(remaining.map((old, index) => [index + 1, questions[old]])),
  };
}
