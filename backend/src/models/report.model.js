const mongoose = require('mongoose');
const { LANGUAGE } = require('./enums');

const subdocument = (fields) => new mongoose.Schema(fields, { _id: false });
const citation = subdocument({
  id: String,
  quote: String,
  responseId: mongoose.Schema.Types.ObjectId,
  number: Number,
});
const source = subdocument({
  evidenceId: String,
  feedbackId: mongoose.Schema.Types.ObjectId,
  displayId: String,
  submittedAt: Date,
  segment: Number,
  segmentCount: Number,
});
const provenance = subdocument({
  models: [String],
  profile: String,
  prompt_version: String,
  method_version: String,
  scores: String,
  quality_status: String,
  quality_accepted: Boolean,
  warnings: [String],
});

const reportSchema = new mongoose.Schema(
  {
    business: { type: mongoose.Schema.Types.ObjectId, ref: 'Business', required: true },
    reportName: { type: String, required: true },
    periodCovered: { type: String, required: true },
    period: subdocument({ from: String, to: String }),
    branchesCovered: { type: [String], default: [] },
    language: { type: String, enum: LANGUAGE, default: 'en' },
    totalReviewsAnalyzed: { type: Number, default: 0 },
    analyzedTextCount: Number,
    executiveSummary: String,
    qualityStatus: { type: String, enum: ['accepted', 'baseline'], default: null },
    qualityAccepted: { type: Boolean, default: false },
    strengths: [subdocument({ text: String, metricsText: String, citations: [citation] })],
    problems: [
      subdocument({
        priority: { type: String, enum: ['High', 'Medium', 'Low', 'Opportunity'] },
        category: String,
        text: String,
        metricsText: String,
        citations: [citation],
      }),
    ],
    suggestedActions: [
      subdocument({
        priority: String,
        category: String,
        suggestion: String,
        citations: [citation],
      }),
    ],
    evidenceBatches: {
      type: [
        subdocument({
          surveyId: mongoose.Schema.Types.ObjectId,
          requestId: String,
          provenance,
          sources: [source],
        }),
      ],
      default: undefined,
    },
  },
  { timestamps: true },
);

reportSchema.index({ business: 1, createdAt: -1, _id: -1 });

module.exports = mongoose.model('Report', reportSchema);
