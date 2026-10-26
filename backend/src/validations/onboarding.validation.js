const { body } = require('express-validator');
const { BUSINESS_TYPE } = require('../models/enums');

// Step 1: Business information
const businessValidation = [
  body('name')
    .trim()
    .notEmpty()
    .withMessage('Enter your business name to continue')
    .isLength({ max: 200 })
    .withMessage('Business name must be at most 200 characters'),

  body('type')
    .trim()
    .notEmpty()
    .withMessage('Enter an industry to continue')
    .bail()
    .isIn(BUSINESS_TYPE)
    .withMessage('Please choose a valid industry'),
];

// Step 2: Business setup
const setupValidation = [
  body('hasMultipleBranches')
    .isBoolean({ strict: true })
    .withMessage('Choose single or multiple branches'),

  body('primaryBranchName')
    .if(body('hasMultipleBranches').equals('true'))
    .trim()
    .notEmpty()
    .withMessage('Required for multiple branches')
    .isLength({ max: 150 })
    .withMessage('Branch name must be at most 150 characters'),
];

module.exports = { businessValidation, setupValidation };
