const { createHash } = require('node:crypto');

const toPublicQuestion = (q) => ({
  id: String(q.id),
  type: q.type,
  isRequired: q.isRequired,
  questionTextEn: q.questionTextEn,
  questionTextAr: q.questionTextAr,
  settings: q.settings,
  options: q.options.map(({ id, label }) => ({ id: String(id), label })),
});
// Deliberately excludes timestamps and mutable owner-only metadata. Store exactly
// the serialized customer-facing fields used to generate this revision.
const snapshotForm = (survey, questions, branch) => {
  const snapshot = {
    surveyId: String(survey._id),
    branch: { id: String(branch._id), name: branch.name, slug: branch.slug },
    survey: {
      name: survey.name,
      languages: survey.languages,
      defaultLanguage: survey.defaultLanguage,
      isAnonymous: survey.isAnonymous,
      welcomeMessage: survey.message || '',
      thankYouMessage: survey.thankYouMessage || '',
    },
    questions: questions.map(toPublicQuestion),
  };
  const canonical = (value) =>
    Array.isArray(value)
      ? value.map(canonical)
      : value && typeof value === 'object'
        ? Object.fromEntries(
            Object.keys(value)
              .sort()
              .map((key) => [key, canonical(value[key])]),
          )
        : value;
  const formSnapshot = canonical(JSON.parse(JSON.stringify(snapshot)));
  const formVersion = createHash('sha256').update(JSON.stringify(formSnapshot)).digest('hex');
  return { formVersion, formSnapshot };
};
module.exports = { snapshotForm, toPublicQuestion };
