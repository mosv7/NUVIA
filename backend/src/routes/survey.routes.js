const express = require('express');

const authenticate = require('../middlewares/auth.middleware');
const { authorize } = require('../middlewares/auth.middleware');
const validate = require('../middlewares/validation.middleware');
const v = require('../validations/survey.validation');
const survey = require('../controllers/survey.controller');
const question = require('../controllers/question.controller');
// const share = require("../controllers/share.controller");

const router = express.Router();

const canRead = authorize('owner', 'manager', 'viewer');
const canWrite = authorize('owner', 'manager');

router.use(authenticate);

// Manage surveys screen
// (fixed paths like /summary and /export must stay above /:id)
router.get('/summary', canRead, survey.getSummary);
router.get('/export', canRead, v.listQuery, validate, survey.exportCsv);
router.get('/', canRead, v.listQuery, validate, survey.list);
router.patch('/:id/status', canWrite, v.surveyId, v.updateStatus, validate, survey.updateStatus);
router.post('/:id/duplicate', canWrite, v.surveyId, validate, survey.duplicate);
router.delete('/:id', canWrite, v.surveyId, validate, survey.remove);

// Create / edit survey screens
router.post('/', canWrite, v.createSurvey, validate, survey.create);
router.get('/:id', canRead, v.surveyId, validate, survey.getById);
router.patch('/:id', canWrite, v.surveyId, v.updateSurvey, validate, survey.update);
router.post('/:id/publish', canWrite, v.surveyId, validate, survey.publish);

// Questions of one survey
router.post('/:id/questions', canWrite, v.surveyId, v.createQuestion, validate, question.add);
router.put(
  '/:id/questions/reorder',
  canWrite,
  v.surveyId,
  v.reorderQuestions,
  validate,
  question.reorder,
);
router.patch(
  '/:id/questions/:questionId',
  canWrite,
  v.surveyId,
  v.questionId,
  v.updateQuestion,
  validate,
  question.update,
);
router.delete(
  '/:id/questions/:questionId',
  canWrite,
  v.surveyId,
  v.questionId,
  validate,
  question.remove,
);
router.post(
  '/:id/questions/:questionId/duplicate',
  canWrite,
  v.surveyId,
  v.questionId,
  validate,
  question.duplicate,
);

// Share survey screen
// router.get("/:id/share", canRead, v.surveyId, validate, share.getShare);
// router.get("/:id/qr", canRead, v.surveyId, v.qrQuery, validate, share.getQr);

module.exports = router;
