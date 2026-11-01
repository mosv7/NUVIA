const feedbackService = require("../services/feedback.service");
const { handleError } = require("../utils/errors");

const list = async (req, res) => {
  try {
    res.json({ data: await feedbackService.list(req.user, req.query) });
  } catch (error) {
    handleError(res, error);
  }
};

const filters = async (req, res) => {
  try {
    res.json({ data: await feedbackService.getFilters(req.user) });
  } catch (error) {
    handleError(res, error);
  }
};

const exportCsv = async (req, res) => {
  try {
    const csv = await feedbackService.exportCsv(req.user, req.query);
    res.setHeader("Content-Type", "text/csv; charset=utf-8");
    res.setHeader("Content-Disposition", `attachment; filename="feedbacks-${new Date().toISOString().slice(0, 10)}.csv"`);
    res.send(csv);
  } catch (error) {
    handleError(res, error);
  }
};

const getById = async (req, res) => {
  try {
    res.json({ data: await feedbackService.getById(req.user, req.params.id) });
  } catch (error) {
    handleError(res, error);
  }
};

const getAnalysis = async (req, res) => {
  try {
    res.json({ data: await feedbackService.getAnalysis(req.user, req.params.id) });
  } catch (error) {
    handleError(res, error);
  }
};

const retry = async (req, res) => {
  try {
    res.status(202).json({ message: "Analysis restarted", data: await feedbackService.retry(req.user, req.params.id) });
  } catch (error) {
    handleError(res, error);
  }
};

module.exports = { list, filters, exportCsv, getById, getAnalysis, retry };
