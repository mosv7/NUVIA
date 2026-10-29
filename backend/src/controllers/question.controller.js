const questionService = require("../services/question.service");
const { handleError } = require("../utils/errors");

const add = async (req, res) => {
  try {
    const question = await questionService.addQuestion(req.user, req.params.id, req.body);
    res.status(201).json({ message: "Question added", data: question });
  } catch (error) {
    handleError(res, error);
  }
};

const update = async (req, res) => {
  try {
    const question = await questionService.updateQuestion(req.user, req.params.id, req.params.questionId, req.body);
    res.json({ message: "Question saved", data: question });
  } catch (error) {
    handleError(res, error);
  }
};

const remove = async (req, res) => {
  try {
    await questionService.deleteQuestion(req.user, req.params.id, req.params.questionId);
    res.json({ message: "Question deleted" });
  } catch (error) {
    handleError(res, error);
  }
};

const duplicate = async (req, res) => {
  try {
    const question = await questionService.duplicateQuestion(req.user, req.params.id, req.params.questionId);
    res.status(201).json({ message: "Question duplicated", data: question });
  } catch (error) {
    handleError(res, error);
  }
};

const reorder = async (req, res) => {
  try {
    const questions = await questionService.reorderQuestions(req.user, req.params.id, req.body.orderedIds);
    res.json({ message: "Questions reordered", data: questions });
  } catch (error) {
    handleError(res, error);
  }
};

module.exports = { add, update, remove, duplicate, reorder };
