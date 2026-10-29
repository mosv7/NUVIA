const mongoose = require("mongoose");
const { USER_STATUS, DATE_FORMAT, TIME_FORMAT, FEEDBACK_DELIVERY } = require("./enums");

const businessOwnerSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true, maxlength: 150 },
    email: { type: String, required: true, unique: true, lowercase: true, trim: true, maxlength: 255 },
    passwordHash: { type: String, required: true, select: false },
    phone: { type: String, trim: true, maxlength: 30 },
    preferredLanguage: { type: String, required: true, trim: true, maxlength: 10 }, // Arabic or English
    lastLogin: { type: Date },

    // ----- account settings -----
    jobTitle: { type: String, trim: true, maxlength: 100 },
    country: { type: String, trim: true, uppercase: true, maxlength: 2 }, // ISO code, e.g. "EG"
    avatar: {
      data: { type: Buffer, select: false },
      contentType: { type: String },
      updatedAt: { type: Date },
    },
    emailVerified: { type: Boolean, required: true, default: false },
    passwordChangedAt: { type: Date },

    language: {
      displayLanguage: { type: String, default: "en-GB" },
      region: { type: String, default: "EG" },
      timeZone: { type: String, default: "Africa/Cairo" },
      dateFormat: { type: String, enum: DATE_FORMAT, default: "DD/MM/YYYY" },
      timeFormat: { type: String, enum: TIME_FORMAT, default: "12h" },
    },

    notifications: {
      channels: {
        email: { type: Boolean, default: true },
        inApp: { type: Boolean, default: true },
      },
      email: {
        newFeedback: { type: Boolean, default: true },
        lowRating: { type: Boolean, default: false },
        weeklyReport: { type: Boolean, default: true },
        productNews: { type: Boolean, default: true },
        // Security notices are always sent; this is kept so the UI can show the switch as locked on.
        accountSecurity: { type: Boolean, default: true },
        feedbackDelivery: { type: String, enum: FEEDBACK_DELIVERY, default: "daily_09:00" },
      },
      inApp: {
        newFeedback: { type: Boolean, default: true },
        lowRating: { type: Boolean, default: false },
        reportsReady: { type: Boolean, default: true },
        sound: { type: Boolean, default: true },
        popups: { type: Boolean, default: false },
      },
    },

    twoFactor: {
      enabled: { type: Boolean, default: false },
      enabledAt: { type: Date },
      lastUsedStep: { type: Number },              // blocks reusing the same code
      secretEnc: { type: String, select: false },  // encrypted TOTP secret
      pendingSecretEnc: { type: String, select: false }, // set during setup, moved to secretEnc on enable
      recoveryCodeHashes: { type: [String], select: false },
    },
    status: { type: String, enum: USER_STATUS, required: true, default: "active" },
  },
  { timestamps: { createdAt: true, updatedAt: false } }
);

module.exports = mongoose.model("BusinessOwner", businessOwnerSchema);
