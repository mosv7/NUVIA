const mongoose = require("mongoose");
const { QUESTION_TYPE, LANGUAGE, CHANNEL_TYPE, ANALYSIS_STATUS, SENTIMENT_TYPE, POLARITY_TYPE } = require("./enums");

const labelSchema = new mongoose.Schema({ en: String, ar: String }, { _id: false });

// One answer. The question text is copied here, so editing or deleting the question later
// does not change what the customer was actually asked.
const answerSchema = new mongoose.Schema(
  {
    questionId: { type: mongoose.Schema.Types.ObjectId, ref: "Question", required: true },
    type: { type: String, enum: QUESTION_TYPE, required: true },
    questionTextEn: { type: String, default: "" },
    questionTextAr: { type: String, default: "" },
    text: { type: String }, // short_text, long_text
    rating: { type: Number }, // rating (1..ratingMax)
    ratingMax: { type: Number },
    yesNo: { type: Boolean }, // yes_no
    choices: [{ _id: false, optionId: mongoose.Schema.Types.ObjectId, label: labelSchema }], // dropdown, multiple_choice
  },
  { _id: false }
);

// One aspect row shown on Feedback details. Built from the AI mentions (see utils/aiAdapter.js).
const aspectSchema = new mongoose.Schema(
  {
    name: { type: String, required: true }, // category shown on screen and used by the Aspect filter: "Coffee", "Wait time"
    term: { type: String }, // the customer's own word the AI found: "flat white"
    evidence: { type: String, required: true }, // clause of the original feedback around the term (always an exact slice)
    polarity: { type: String, enum: POLARITY_TYPE, required: true },
    // Signed for display: +c positive, -c negative, 0 neutral. c is the model's confidence in that polarity (uncalibrated).
    score: { type: Number, default: null },
    confidence: { type: Number, default: null }, // 0..1, the unsigned value
    start: { type: Number }, // code-point offsets of `term` inside feedbackText
    end: { type: Number },
  },
  { _id: false }
);

// Which model produced the result and how far it is trusted (copied from the AI response, never shown raw).
const provenanceSchema = new mongoose.Schema(
  {
    qualityStatus: { type: String, enum: ["accepted", "baseline", "unavailable"] },
    qualityAccepted: { type: Boolean },
    models: { type: [String], default: undefined },
    profile: { type: String },
    methodVersion: { type: String },
    warnings: { type: [String], default: undefined },
  },
  { _id: false }
);

// The AI result + the backend-owned lifecycle. Lives inside the response,
// so the list screen can filter and sort on it without a join.
const analysisSchema = new mongoose.Schema(
  {
    status: { type: String, enum: ANALYSIS_STATUS, required: true, default: "pending" },
    attempts: { type: Number, default: 0 },
    requestedAt: { type: Date },
    startedAt: { type: Date },
    completedAt: { type: Date },
    // Only a safe code + message are stored for failures. Never the raw AI output or a stack trace.
    errorCode: { type: String },
    errorMessage: { type: String },
    // Sections the AI did not return (or returned invalid) when the status is "partial".
    missingSections: { type: [String], default: undefined },
    droppedAspects: { type: Number },

    overallSentiment: { type: String, enum: SENTIMENT_TYPE }, // missing = the AI found no clear aspects
    reason: { type: String, enum: ["insufficient_evidence"] }, // why overallSentiment is missing
    // Not filled yet: the summary endpoint of the AI service is switched off until a provider is approved.
    summary: { type: String },
    aspects: { type: [aspectSchema], default: undefined },
    provenance: { type: provenanceSchema, default: undefined },
  },
  { _id: false }
);

// "Feedback" in the UI: one submitted survey by one customer.
const customerResponseSchema = new mongoose.Schema(
  {
    businessId: { type: mongoose.Schema.Types.ObjectId, ref: "Business", required: true },
    surveyId: { type: mongoose.Schema.Types.ObjectId, ref: "Survey", required: true },
    branchId: { type: mongoose.Schema.Types.ObjectId, ref: "Branch", required: true },
    number: { type: Number, required: true }, // per business: #1248. Sent to the AI as "FB-1248".
    channel: { type: String, enum: CHANNEL_TYPE, required: true, default: "short_link" },

    answers: { type: [answerSchema], default: [] },
    // The text sent to the AI: every written answer, in question order, joined by a blank line.
    feedbackText: { type: String, default: "", maxlength: 10000 },
    // `language` is detected from feedbackText (what the AI is told); `declaredLanguage` is what the
    // customer's survey page was showing. They can differ: an English page with an Arabic answer.
    language: { type: String, enum: LANGUAGE, required: true },
    declaredLanguage: { type: String, enum: LANGUAGE },

    // Only filled when the survey is not anonymous.
    respondent: { name: { type: String, trim: true, maxlength: 150 }, email: { type: String, trim: true, lowercase: true, maxlength: 255 } },

    // Optional id the customer's browser makes once per form, so a double tap or a retry on bad
    // network does not create two responses.
    submissionId: { type: String, maxlength: 64 },
    submittedAt: { type: Date, required: true, default: Date.now },

    analysis: { type: analysisSchema, default: () => ({}) },
  },
  { timestamps: false }
);

customerResponseSchema.index({ businessId: 1, number: 1 }, { unique: true });
customerResponseSchema.index({ businessId: 1, submittedAt: -1, _id: -1 }); // list, newest first
customerResponseSchema.index({ businessId: 1, branchId: 1, submittedAt: -1 });
customerResponseSchema.index({ surveyId: 1, submittedAt: -1 });
customerResponseSchema.index({ businessId: 1, "analysis.overallSentiment": 1, submittedAt: -1 });
customerResponseSchema.index({ businessId: 1, "analysis.aspects.name": 1 });
customerResponseSchema.index({ "analysis.status": 1, "analysis.startedAt": 1 }); // recovery sweep
customerResponseSchema.index({ "analysis.status": 1, "analysis.requestedAt": 1 }); // worker queue
customerResponseSchema.index(
  { surveyId: 1, submissionId: 1 },
  { unique: true, partialFilterExpression: { submissionId: { $type: "string" } } }
);

module.exports = mongoose.model("CustomerResponse", customerResponseSchema);
