const { body } = require('express-validator');
const { validateInput } = require('../integrations/ai-service/contracts');

const validateOperation = (operation) => [
  body().custom((value) => {
    if (!validateInput(operation, value)) throw new Error('Invalid AI request fields');
    return true;
  }),
];

module.exports = { validateOperation };
