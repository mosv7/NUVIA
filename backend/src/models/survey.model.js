const mongoose = require('mongoose');
const { QUESTIONNAIRE_STATUS, CREATION_METHOD, LANGUAGE } = require('./enums');

// "Survey" in the UI. One questionnaire belongs to one business and is shown at one or more branches.
const surveySchema = new mongoose.Schema(
  {
    businessId: { type: mongoose.Schema.Types.ObjectId, ref: 'Business', required: true },
    name: { type: String, required: true, trim: true, maxlength: 200 },
    message: { type: String, trim: true, maxlength: 1000 }, // welcome page
    thankYouMessage: { type: String, trim: true, maxlength: 1000 }, // thank-you page
    status: { type: String, enum: QUESTIONNAIRE_STATUS, required: true, default: 'draft' },
    isAnonymous: { type: Boolean, required: true, default: true },
    languages: {
      type: [{ type: String, enum: LANGUAGE }],
      default: ['en'],
      validate: { validator: (v) => v.length > 0, message: 'Choose at least one language' },
    },
    defaultLanguage: { type: String, enum: LANGUAGE, required: true, default: 'en' },
    branchIds: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Branch' }],
    creationMethod: { type: String, enum: CREATION_METHOD, required: true, default: 'manual' },
    templateKey: { type: String, trim: true },
    shortCode: { type: String, required: true, unique: true, lowercase: true, trim: true },
    publishedAt: { type: Date },
    createdBy: { type: mongoose.Schema.Types.ObjectId },
  },
  { timestamps: true }, // createdAt + updatedAt
);

surveySchema.index({ businessId: 1, status: 1, updatedAt: -1 });
surveySchema.index({ businessId: 1, updatedAt: -1 });

module.exports = mongoose.model('Survey', surveySchema);
