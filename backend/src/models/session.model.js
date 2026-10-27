const mongoose = require('mongoose');

// One row per signed-in device. The JWT carries the session id (`sid`);
// signing out a device = setting revokedAt, and the auth middleware then rejects that token.
const sessionSchema = new mongoose.Schema({
  ownerId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'BusinessOwner',
    required: true,
    index: true,
  },
  device: { type: String, default: 'Unknown device' }, // "Chrome on macOS"
  deviceType: { type: String, enum: ['desktop', 'mobile', 'tablet'], default: 'desktop' },
  ip: { type: String },
  createdAt: { type: Date, default: Date.now },
  lastActiveAt: { type: Date, default: Date.now },
  revokedAt: { type: Date },
  expiresAt: { type: Date, required: true }, // same as the JWT lifetime; Mongo deletes the row afterwards
});

sessionSchema.index({ expiresAt: 1 }, { expireAfterSeconds: 0 });

module.exports = mongoose.model('Session', sessionSchema);
