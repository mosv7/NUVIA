const { body } = require('express-validator');
const { BUSINESS_TYPE } = require('../models/enums');

// "Edit business profile": both fields are required (red "Enter your business name" states).
const updateBusiness = [
  body('name')
    .isString()
    .withMessage('Enter your business name')
    .bail()
    .trim()
    .notEmpty()
    .withMessage('Enter your business name')
    .isLength({ max: 200 })
    .withMessage('Business name must be at most 200 characters'),

  body('type')
    .isString()
    .withMessage('Enter your business type / industry')
    .bail()
    .trim()
    .notEmpty()
    .withMessage('Enter your business type / industry')
    .bail()
    .isIn(BUSINESS_TYPE)
    .withMessage('Please choose a valid industry'),
];

module.exports = { updateBusiness };
