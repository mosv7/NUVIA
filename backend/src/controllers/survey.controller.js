const surveyService = require('../services/survey.service');
const { handleError } = require('../utils/errors');

const getSummary = async (req, res) => {
  try {
    res.json({ data: await surveyService.getSummary(req.user) });
  } catch (error) {
    handleError(res, error);
  }
};

const list = async (req, res) => {
  try {
    res.json({ data: await surveyService.list(req.user, req.query) });
  } catch (error) {
    handleError(res, error);
  }
};

const exportCsv = async (req, res) => {
  try {
    const csv = await surveyService.exportCsv(req.user, req.query);
    res.set({
      'Content-Type': 'text/csv; charset=utf-8',
      'Content-Disposition': 'attachment; filename="surveys.csv"',
    });
    res.send(csv);
  } catch (error) {
    handleError(res, error);
  }
};

const listTemplates = (req, res) => {
  res.json({ data: surveyService.listTemplates() });
};

const create = async (req, res) => {
  try {
    const survey = await surveyService.create(req.user, req.body);
    res.status(201).json({ message: 'Survey created', data: survey });
  } catch (error) {
    handleError(res, error);
  }
};

const getById = async (req, res) => {
  try {
    res.json({ data: await surveyService.getById(req.user, req.params.id) });
  } catch (error) {
    handleError(res, error);
  }
};

const update = async (req, res) => {
  try {
    res.json({
      message: 'Survey saved',
      data: await surveyService.update(req.user, req.params.id, req.body),
    });
  } catch (error) {
    handleError(res, error);
  }
};

const updateStatus = async (req, res) => {
  try {
    const data = await surveyService.updateStatus(req.user, req.params.id, req.body.status);
    res.json({ message: 'Survey status updated', data });
  } catch (error) {
    handleError(res, error);
  }
};

const duplicate = async (req, res) => {
  try {
    const survey = await surveyService.duplicate(req.user, req.params.id);
    res.status(201).json({ message: 'Survey duplicated', data: survey });
  } catch (error) {
    handleError(res, error);
  }
};

const remove = async (req, res) => {
  try {
    await surveyService.remove(req.user, req.params.id);
    res.json({ message: 'Survey deleted' });
  } catch (error) {
    handleError(res, error);
  }
};

const publish = async (req, res) => {
  try {
    res.json({
      message: 'Survey is live',
      data: await surveyService.publish(req.user, req.params.id),
    });
  } catch (error) {
    handleError(res, error);
  }
};

module.exports = {
  getSummary,
  list,
  exportCsv,
  listTemplates,
  create,
  getById,
  update,
  updateStatus,
  duplicate,
  remove,
  publish,
};
