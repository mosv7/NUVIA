const branchService = require("../services/branch.service");
const { handleError } = require("../utils/errors");

const list = async (req, res) => {
  try {
    res.json({ data: await branchService.list(req.user, req.query) });
  } catch (error) {
    handleError(res, error);
  }
};

const getSummary = async (req, res) => {
  try {
    res.json({ data: await branchService.getSummary(req.user) });
  } catch (error) {
    handleError(res, error);
  }
};

const getById = async (req, res) => {
  try {
    res.json({ data: await branchService.getById(req.user, req.params.id) });
  } catch (error) {
    handleError(res, error);
  }
};

const getHistory = async (req, res) => {
  try {
    res.json({ data: await branchService.getHistory(req.user, req.params.id) });
  } catch (error) {
    handleError(res, error);
  }
};

const create = async (req, res) => {
  try {
    const { name, country, city, address } = req.body;
    const branch = await branchService.create(req.user, { name, country, city, address });
    res.status(201).json({ message: "Branch added", data: branch });
  } catch (error) {
    handleError(res, error);
  }
};

const update = async (req, res) => {
  try {
    const { name, country, city, address } = req.body;
    const branch = await branchService.update(req.user, req.params.id, { name, country, city, address });
    res.json({ message: "Branch saved", data: branch });
  } catch (error) {
    handleError(res, error);
  }
};

const archive = async (req, res) => {
  try {
    res.json({ message: "Branch archived", data: await branchService.archive(req.user, req.params.id) });
  } catch (error) {
    handleError(res, error);
  }
};

module.exports = { list, getSummary, getById, getHistory, create, update, archive };
