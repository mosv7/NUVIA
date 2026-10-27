const mongoose = require('mongoose');
const { BUSINESS_TYPE, USER_STATUS } = require('./enums');

const businessSchema = new mongoose.Schema(
  {
    ownerId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'BusinessOwner',
      required: true,
      unique: true,
    }, // 1 owner = 1 business
    name: { type: String, required: true, trim: true, maxlength: 200 },
    type: { type: String, enum: BUSINESS_TYPE, required: true },
    description: { type: String, trim: true },
    reportLanguage: { type: String, required: true, trim: true, maxlength: 10 },
    slug: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
      maxlength: 200,
    },
    publicPageEnabled: { type: Boolean, required: true, default: false },
    hasMultipleBranches: { type: Boolean, required: true, default: false },
    onboardingCompleted: { type: Boolean, required: true, default: false },
    status: { type: String, enum: USER_STATUS, required: true, default: 'active' },
  },
  { timestamps: true }, // createdAt + updatedAt
);

module.exports = mongoose.model('Business', businessSchema);
