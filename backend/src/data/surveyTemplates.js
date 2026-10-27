// Starter templates for "Choose a starting point". Static for now: move them to the
// QuestionnaireTemplate collection when admins need to edit them.
// {{businessName}} is replaced with the business name when a survey is created from a template.
// "Start from scratch" is not a template: the frontend just sends no templateId.

const rating = (en, ar, isRequired = true) => ({
  type: "rating",
  isRequired,
  questionTextEn: en,
  questionTextAr: ar,
  settings: {
    stars: 5,
    lowestLabel: { en: "Very poor", ar: "ضعيف جدًا" },
    highestLabel: { en: "Excellent", ar: "ممتاز" },
  },
});

const TEMPLATES = [
  {
    id: "customer-experience",
    name: "Customer experience",
    description: "Overall experience & recommendation",
    estimatedMinutes: 3,
    questions: [
      rating("How was your experience at {{businessName}}?", "كيف كانت تجربتك في {{businessName}}؟"),
      {
        type: "multiple_choice",
        isRequired: true,
        questionTextEn: "What did you enjoy most about your visit?",
        questionTextAr: "ما أكثر شيء استمتعت به خلال زيارتك؟",
        settings: { allowMultiple: false },
        options: [
          { label: { en: "Product quality", ar: "جودة المنتجات" } },
          { label: { en: "Friendly staff", ar: "ودّ الموظفين" } },
          { label: { en: "Atmosphere", ar: "الأجواء" } },
          { label: { en: "Prices", ar: "الأسعار" } },
        ],
      },
      rating("How would you rate the speed of our service?", "كيف تقيّم سرعة خدمتنا؟"),
      rating("How would you rate our value for money?", "كيف تقيّم القيمة مقابل السعر لدينا؟"),
      rating("How likely are you to recommend us to a friend?", "ما مدى احتمال أن توصي بنا لصديق؟"),
      {
        type: "long_text",
        isRequired: false,
        questionTextEn: "What could we do to make your next visit better?",
        questionTextAr: "ماذا يمكننا أن نفعل لنجعل زيارتك القادمة أفضل؟",
        settings: {},
      },
    ],
  },
  {
    id: "quick-satisfaction",
    name: "Quick satisfaction check",
    description: "3 quick questions, 1 minute",
    estimatedMinutes: 1,
    questions: [
      rating("How satisfied were you with your visit today?", "ما مدى رضاك عن زيارتك اليوم؟"),
      {
        type: "yes_no",
        isRequired: true,
        questionTextEn: "Would you visit us again?",
        questionTextAr: "هل ستزورنا مرة أخرى؟",
        settings: {},
      },
      {
        type: "long_text",
        isRequired: false,
        questionTextEn: "Anything else you'd like to tell us?",
        questionTextAr: "هل هناك أي شيء آخر تود إخبارنا به؟",
        settings: {},
      },
    ],
  },
];

const getTemplates = () => TEMPLATES;
const getTemplate = (id) => TEMPLATES.find((t) => t.id === id) || null;

module.exports = { getTemplates, getTemplate };
