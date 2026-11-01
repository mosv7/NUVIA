const Survey = require('../models/survey.model');
const Branch = require('../models/branch.model');
const Business = require('../models/business.model');
const { fail } = require('../utils/errors');
const { loadQuestions } = require('./question.service');
const mongoose = require('mongoose');
const { snapshotForm } = require('./formRevision');

// What a customer's phone gets when it opens a survey link or QR code. No login.
//
// Not-found cases (unknown code, draft, branch that isn't on this survey) throw a 404.
// Cases where a friendly screen is better than an error return 200 with a `state`:
//   open                 -> show the survey
//   paused / closed      -> "this survey is paused / closed"
//   branch_unavailable   -> the branch was archived after its QR was printed
//   branch_required      -> survey has several branches and the link had none: `branches` is the picker list
const readPublicSurvey = async (shortCode, branchSlug, session) => {
  const survey = await Survey.findOne({ shortCode: String(shortCode).toLowerCase() })
    .session(session)
    .lean();

  // Drafts are invisible to customers, same answer as a code that doesn't exist.
  if (!survey || survey.status === 'draft') throw fail('Survey not found', 404);

  const business = await Business.findById(survey.businessId)
    .select('name')
    .session(session)
    .lean();
  const branches = await Branch.find({
    _id: { $in: survey.branchIds },
    businessId: survey.businessId,
  })
    .sort({ name: 1 })
    .session(session)
    .lean();

  const base = {
    survey: {
      name: survey.name,
      languages: survey.languages,
      defaultLanguage: survey.defaultLanguage,
      isAnonymous: survey.isAnonymous,
    },
    businessName: business?.name || '',
  };

  // Resolve the branch. A slug that isn't one of this survey's branches is a 404.
  let branch = null;
  if (branchSlug) {
    branch = branches.find((b) => b.slug === String(branchSlug).toLowerCase());
    if (!branch) throw fail('Survey not found', 404);
    if (branch.status !== 'active')
      return { state: 'branch_unavailable', ...base, branch: toBranch(branch) };
  }

  if (survey.status === 'paused' || survey.status === 'closed') {
    return { state: survey.status, ...base, ...(branch && { branch: toBranch(branch) }) };
  }

  if (!branch) {
    const active = branches.filter((b) => b.status === 'active');
    if (active.length === 0) return { state: 'branch_unavailable', ...base };
    if (active.length === 1)
      branch = active[0]; // single-branch survey: skip the picker
    else return { state: 'branch_required', ...base, branches: active.map(toBranch) };
  }

  const { formVersion, formSnapshot } = snapshotForm(
    survey,
    await loadQuestions(survey._id, session),
    branch,
  );
  return {
    state: 'open',
    formVersion,
    ...base,
    survey: {
      ...base.survey,
      welcomeMessage: survey.message || '',
      thankYouMessage: survey.thankYouMessage || '',
    },
    branch: toBranch(branch),
    questions: formSnapshot.questions,
  };
};

const toBranch = (b) => ({ name: b.name, slug: b.slug });

const getPublicSurvey = (shortCode, branchSlug) =>
  mongoose.connection.transaction((session) => readPublicSurvey(shortCode, branchSlug, session), {
    readConcern: { level: 'snapshot' },
  });

module.exports = { getPublicSurvey };
