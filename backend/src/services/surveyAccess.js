const mongoose = require('mongoose');

const Survey = require('../models/survey.model');
const { fail } = require('../utils/errors');

// Tokens of owners who haven't finished onboarding have businessId = null.
const requireBusinessId = (user) => {
  if (!user.businessId) throw fail('Complete business setup first', 409);
  return user.businessId;
};

// Every survey query is scoped to the caller's business, so another business's id gives a 404.
const getOwnedSurvey = async (businessId, surveyId) => {
  const survey = await Survey.findOne({ _id: surveyId, businessId });
  if (!survey) throw fail('Survey not found', 404);
  return survey;
};

const assertEditable = (survey) => {
  if (survey.status === 'closed') throw fail("Closed surveys can't be edited", 409);
};

// Changing a question should move "Last updated" on the surveys list.
const touchSurvey = (surveyId) =>
  Survey.updateOne({ _id: surveyId }, { $set: { updatedAt: new Date() } });

// Aggregation pipelines don't cast strings to ObjectId like find() does.
const oid = (id) => new mongoose.Types.ObjectId(String(id));

module.exports = { requireBusinessId, getOwnedSurvey, assertEditable, touchSurvey, oid };
