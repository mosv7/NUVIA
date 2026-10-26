const onboardingService = require('../services/onboarding.service');
const { setAuthCookie } = require('../utils/browserSession');
const { handleError } = require('../utils/errors');

const getStatus = async (req, res) => {
  try {
    const data = await onboardingService.getStatus(req.user.id);
    return res.status(200).json({ data });
  } catch (error) {
    return handleError(res, error);
  }
};

const saveBusiness = async (req, res) => {
  try {
    const { name, type } = req.body;
    const data = await onboardingService.saveBusiness(req.user.id, { name, type });
    setAuthCookie(res, data.token);

    return res.status(200).json({
      message: 'Business information saved',
      data,
    });
  } catch (error) {
    return handleError(res, error);
  }
};

const saveSetup = async (req, res) => {
  try {
    const { hasMultipleBranches, primaryBranchName } = req.body;
    const data = await onboardingService.saveSetup(req.user.id, {
      hasMultipleBranches,
      primaryBranchName,
    });

    return res.status(200).json({
      message: 'Business setup saved',
      data,
    });
  } catch (error) {
    return handleError(res, error);
  }
};

const complete = async (req, res) => {
  try {
    const data = await onboardingService.complete(req.user.id);

    return res.status(200).json({
      message: 'Onboarding completed',
      data,
    });
  } catch (error) {
    return handleError(res, error);
  }
};

module.exports = { getStatus, saveBusiness, saveSetup, complete };
