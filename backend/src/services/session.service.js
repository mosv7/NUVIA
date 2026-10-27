const Session = require('../models/session.model');
const { SESSION_DAYS } = require('../utils/jwt');
const { fail } = require('../utils/errors');

const createSession = (ownerId, meta = {}) =>
  Session.create({
    ownerId,
    device: meta.device,
    deviceType: meta.deviceType,
    ip: meta.ip,
    expiresAt: new Date(Date.now() + SESSION_DAYS * 24 * 60 * 60 * 1000),
  });

// Used by the auth middleware on every request. Returns false when the device was signed out.
// "Last active" is only written once a minute so a busy page doesn't write on every call.
const touchSession = async (sid, ownerId) => {
  const session = await Session.findOne({
    _id: sid,
    ownerId,
    revokedAt: { $exists: false },
    expiresAt: { $gt: new Date() },
  })
    .select('lastActiveAt')
    .lean();
  if (!session) return false;

  if (Date.now() - new Date(session.lastActiveAt).getTime() > 60 * 1000) {
    await Session.updateOne({ _id: sid }, { $set: { lastActiveAt: new Date() } });
  }
  return true;
};

const toDTO = (s, currentSid) => ({
  id: s._id,
  device: s.device,
  deviceType: s.deviceType,
  ip: s.ip || null,
  location: null, // needs an IP-to-location service; not included
  signedInAt: s.createdAt,
  lastActiveAt: s.lastActiveAt,
  isCurrent: String(s._id) === String(currentSid),
});

const listSessions = async (ownerId, currentSid) => {
  const sessions = await Session.find({
    ownerId,
    revokedAt: { $exists: false },
    expiresAt: { $gt: new Date() },
  })
    .sort({ lastActiveAt: -1 })
    .lean();
  return sessions.map((s) => toDTO(s, currentSid));
};

const countActive = (ownerId) =>
  Session.countDocuments({
    ownerId,
    revokedAt: { $exists: false },
    expiresAt: { $gt: new Date() },
  });

const revokeSession = async (ownerId, sessionId, currentSid) => {
  if (String(sessionId) === String(currentSid)) throw fail('Use sign out to end this session', 400);
  const result = await Session.updateOne(
    { _id: sessionId, ownerId, revokedAt: { $exists: false }, expiresAt: { $gt: new Date() } },
    { $set: { revokedAt: new Date() } },
  );
  if (result.matchedCount === 0) throw fail('Session not found', 404);
};

// keepSid: leave one session alive (e.g. the device that just changed the password).
const revokeAll = (ownerId, keepSid, session) =>
  Session.updateMany(
    {
      ownerId,
      revokedAt: { $exists: false },
      expiresAt: { $gt: new Date() },
      ...(keepSid && { _id: { $ne: keepSid } }),
    },
    { $set: { revokedAt: new Date() } },
    { session },
  );

module.exports = {
  createSession,
  touchSession,
  listSessions,
  countActive,
  revokeSession,
  revokeAll,
};
