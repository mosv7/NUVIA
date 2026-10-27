const mongoose = require("mongoose");

// A pending "change my email" request. One per owner; a new request replaces the old one.
const emailChangeSchema = new mongoose.Schema({
  ownerId: { type: mongoose.Schema.Types.ObjectId, ref: "BusinessOwner", required: true, unique: true },
  newEmail: { type: String, required: true, lowercase: true, trim: true },
  tokenHash: { type: String, required: true, unique: true },
  expiresAt: { type: Date, required: true },
});

emailChangeSchema.index({ expiresAt: 1 }, { expireAfterSeconds: 0 });

module.exports = mongoose.model("EmailChange", emailChangeSchema);
