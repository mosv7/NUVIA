const mongoose = require("mongoose");

// Answer choices for multiple_choice and dropdown questions.
const questionOptionSchema = new mongoose.Schema({
  questionId: { type: mongoose.Schema.Types.ObjectId, ref: "Question", required: true, index: true },
  label: {
    ar: { type: String, trim: true, maxlength: 200, default: "" },
    en: { type: String, trim: true, maxlength: 200, default: "" },
  },
  order: { type: Number, required: true, default: 0 },
});

module.exports = mongoose.model("QuestionOption", questionOptionSchema);
