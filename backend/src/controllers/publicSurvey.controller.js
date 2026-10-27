const publicSurveyService = require('../services/publicSurvey.service');
const { handleError } = require('../utils/errors');

const getSurvey = async (req, res) => {
  try {
    const data = await publicSurveyService.getPublicSurvey(req.params.shortCode, req.query.branch);
    res.json({ data });
  } catch (error) {
    handleError(res, error);
  }
};

module.exports = { getSurvey };
