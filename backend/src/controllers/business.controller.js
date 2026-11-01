const businessService = require('../services/business.service');
const { handleError } = require('../utils/errors');

const getProfile = async (req, res) => {
  try {
    res.json({ data: await businessService.getProfile(req.user) });
  } catch (error) {
    handleError(res, error);
  }
};

const updateProfile = async (req, res) => {
  try {
    const { name, type } = req.body;
    const data = await businessService.updateProfile(req.user, { name, type });
    res.json({ message: 'Business profile saved', data });
  } catch (error) {
    handleError(res, error);
  }
};

module.exports = { getProfile, updateProfile };
