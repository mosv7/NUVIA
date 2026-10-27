const mongoose = require("mongoose");
const { QUESTION_TYPE } = require("./enums");

// Text is optional while the survey is a draft (the builder adds blank questions).
// "Ready to publish" is checked in the publish endpoint, not here.
const questionSchema = new mongoose.Schema({
  surveyId: { type: mongoose.Schema.Types.ObjectId, ref: "Survey", required: true },
  questionTextAr: { type: String, trim: true, maxlength: 500, default: "" },
  questionTextEn: { type: String, trim: true, maxlength: 500, default: "" },
  type: { type: String, enum: QUESTION_TYPE, required: true },
  isRequired: { type: Boolean, required: true, default: false },
  settings: { type: mongoose.Schema.Types.Mixed, default: {} }, // depends on type, see question.service
  order: { type: Number, required: true, default: 0 },
});

questionSchema.index({ surveyId: 1, order: 1 });

module.exports = mongoose.model("Question", questionSchema);