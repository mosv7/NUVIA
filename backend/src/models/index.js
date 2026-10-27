// Loads every model so they are all registered with mongoose.
// Usage: const { Business, Branch } = require("./models");
module.exports = {
  Session: require('./session.model'),
  EmailChange: require('./emailChange.model'),
  Branch: require('./branch.model.js'),
  Business: require('./business.model.js'),
  BusinessOwner: require('./businessOwner.model.js'),
  PasswordReset: require('./passwordReset.model.js'),
  Questions: require('./questions.model.js'),
  Survey: require('./survey.model.js'),
  QuestionOptions: require('./questionOptions.model.js'),
};
