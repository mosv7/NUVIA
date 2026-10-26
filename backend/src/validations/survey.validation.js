const { body, param, query } = require('express-validator');
const { QUESTIONNAIRE_STATUS, QUESTION_TYPE, LANGUAGE } = require('../models/enums');

// NOTE: no sanitizers (.trim(), .toInt()) on `query`: Express 5 rebuilds req.query on every access,
// so the cleaned value would be lost. The service trims and parses query values itself.

const surveyId = param('id').isMongoId().withMessage('Invalid survey id');
const questionId = param('questionId').isMongoId().withMessage('Invalid question id');

const listQuery = [
  query('status')
    .optional()
    .isIn(['all', ...QUESTIONNAIRE_STATUS])
    .withMessage('Invalid status'),
  query('branchId').optional().isMongoId().withMessage('Invalid branch id'),
  query('sort').optional().isIn(['updated', 'created', 'name']).withMessage('Invalid sort'),
  query('search').optional().isString().isLength({ max: 100 }).withMessage('Search is too long'),
  query('page').optional().isInt({ min: 1 }).withMessage('page must be 1 or more'),
  query('limit')
    .optional()
    .isInt({ min: 1, max: 50 })
    .withMessage('limit must be between 1 and 50'),
];

const detailFields = [
  body('message')
    .optional({ values: 'null' })
    .isString()
    .trim()
    .isLength({ max: 1000 })
    .withMessage('Welcome message is too long'),
  body('thankYouMessage')
    .optional({ values: 'null' })
    .isString()
    .trim()
    .isLength({ max: 1000 })
    .withMessage('Thank-you message is too long'),
  body('languages')
    .optional()
    .isArray({ min: 1, max: 2 })
    .withMessage('Choose at least one language'),
  body('languages.*').isIn(LANGUAGE).withMessage('Unsupported language'),
  body('defaultLanguage').optional().isIn(LANGUAGE).withMessage('Unsupported language'),
  body('branchIds').optional().isArray({ min: 1 }).withMessage('Choose at least one branch'),
  body('branchIds.*').isMongoId().withMessage('Invalid branch id'),
  body('isAnonymous')
    .optional()
    .isBoolean({ strict: true })
    .withMessage('isAnonymous must be true or false'),
];

const nameRule = (required) => {
  const rule = body('name');
  return (required ? rule : rule.optional())
    .isString()
    .trim()
    .notEmpty()
    .withMessage('Enter a survey name to continue')
    .isLength({ max: 200 })
    .withMessage('Survey name is too long');
};

const createSurvey = [
  nameRule(true),
  ...detailFields,
  body('templateId')
    .optional({ values: 'null' })
    .isString()
    .isLength({ max: 60 })
    .withMessage('Invalid template'),
];

const updateSurvey = [nameRule(false), ...detailFields];

const updateStatus = [
  body('status')
    .isIn(['live', 'paused', 'closed'])
    .withMessage('Status must be live, paused or closed'),
];

const questionFields = [
  body('questionTextEn')
    .optional({ values: 'null' })
    .isString()
    .trim()
    .isLength({ max: 500 })
    .withMessage('English text is too long'),
  body('questionTextAr')
    .optional({ values: 'null' })
    .isString()
    .trim()
    .isLength({ max: 500 })
    .withMessage('Arabic text is too long'),
  body('isRequired')
    .optional()
    .isBoolean({ strict: true })
    .withMessage('isRequired must be true or false'),
  body('settings').optional().isObject().withMessage('settings must be an object'),
  body('options')
    .optional()
    .isArray({ max: 20 })
    .withMessage('A question can have at most 20 options'),
  body('options.*.id').optional().isMongoId().withMessage('Invalid option id'),
  body('options.*.label').isObject().withMessage('Each option needs a label'),
  body('options.*.label.en')
    .optional({ values: 'null' })
    .isString()
    .trim()
    .isLength({ max: 200 })
    .withMessage('Option text is too long'),
  body('options.*.label.ar')
    .optional({ values: 'null' })
    .isString()
    .trim()
    .isLength({ max: 200 })
    .withMessage('Option text is too long'),
];

const createQuestion = [
  body('type').isIn(QUESTION_TYPE).withMessage('Invalid question type'),
  ...questionFields,
];

const updateQuestion = [
  body('type').optional().isIn(QUESTION_TYPE).withMessage('Invalid question type'),
  ...questionFields,
];

const reorderQuestions = [
  body('orderedIds').isArray({ min: 1 }).withMessage('orderedIds must be a list of question ids'),
  body('orderedIds.*').isMongoId().withMessage('Invalid question id'),
];

const qrQuery = [
  query('branchId').optional().isMongoId().withMessage('Invalid branch id'),
  query('format').optional().isIn(['svg', 'png']).withMessage('format must be svg or png'),
  query('size')
    .optional()
    .isInt({ min: 128, max: 2048 })
    .withMessage('size must be between 128 and 2048'),
  query('download')
    .optional()
    .isIn(['0', '1', 'true', 'false'])
    .withMessage('download must be 1 or 0'),
];

module.exports = {
  surveyId,
  questionId,
  listQuery,
  createSurvey,
  updateSurvey,
  updateStatus,
  createQuestion,
  updateQuestion,
  reorderQuestions,
  qrQuery,
};
