// Account, Language and Notification settings of the signed-in owner.
const BusinessOwner = require('../models/businessOwner.model');
const Business = require('../models/business.model');
const { fail } = require('../utils/errors');
const { DISPLAY_LANGUAGES } = require('../utils/settingsOptions');

const loadOwner = async (ownerId) => {
  const owner = await BusinessOwner.findById(ownerId);
  if (!owner) throw fail('Account not found', 404);
  return owner;
};

/* ---------- Account settings ---------- */

const toAccountDTO = (owner, business) => ({
  id: owner._id,
  name: owner.name,
  email: owner.email,
  emailVerified: owner.emailVerified,
  phone: owner.phone || '',
  country: owner.country || '',
  jobTitle: owner.jobTitle || '',
  memberSince: owner.createdAt,
  hasAvatar: Boolean(owner.avatar?.contentType),
  avatarUrl: owner.avatar?.contentType
    ? `/api/settings/avatar?v=${new Date(owner.avatar.updatedAt || 0).getTime()}`
    : null,
  role: 'owner',
  workspace: business ? { id: business._id, name: business.name } : null,
});

const getAccount = async (ownerId) => {
  const [owner, business] = await Promise.all([
    loadOwner(ownerId),
    Business.findOne({ ownerId }).select('name').lean(),
  ]);
  return toAccountDTO(owner, business);
};

// Edit account details screen: full name, phone, country, job title.
const updateAccount = async (ownerId, { name, phone, country, jobTitle }) => {
  const owner = await loadOwner(ownerId);

  if (name !== undefined) owner.name = name;
  if (phone !== undefined) owner.phone = phone;
  if (country !== undefined) owner.country = country || undefined;
  if (jobTitle !== undefined) owner.jobTitle = jobTitle || undefined;

  await owner.save();
  return getAccount(ownerId);
};

/* ---------- Avatar ---------- */

const MAX_AVATAR_BYTES = 2 * 1024 * 1024;

// Check the real file signature, not just the Content-Type header the client sent.
const detectImageType = (buf) => {
  if (
    buf.length > 8 &&
    buf.subarray(0, 8).equals(Buffer.from([0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a]))
  )
    return 'image/png';
  if (buf.length > 3 && buf[0] === 0xff && buf[1] === 0xd8 && buf[2] === 0xff) return 'image/jpeg';
  return null;
};

const setAvatar = async (ownerId, buffer) => {
  if (!Buffer.isBuffer(buffer) || buffer.length === 0)
    throw fail('Send the image as the request body (PNG or JPG)', 400);
  if (buffer.length > MAX_AVATAR_BYTES) throw fail('The photo must be 2 MB or smaller', 413);

  const contentType = detectImageType(buffer);
  if (!contentType) throw fail('The photo must be a JPG or PNG image', 415);

  await BusinessOwner.updateOne(
    { _id: ownerId },
    { $set: { avatar: { data: buffer, contentType, updatedAt: new Date() } } },
  );
  return getAccount(ownerId);
};

const getAvatar = async (ownerId) => {
  const owner = await BusinessOwner.findById(ownerId).select('+avatar.data avatar.contentType');
  if (!owner?.avatar?.data) throw fail('No photo', 404);
  return { contentType: owner.avatar.contentType, body: owner.avatar.data };
};

const removeAvatar = async (ownerId) => {
  await BusinessOwner.updateOne({ _id: ownerId }, { $unset: { avatar: 1 } });
  return getAccount(ownerId);
};

/* ---------- Language settings ---------- */

const languageDTO = (owner) => ({
  displayLanguage: owner.language.displayLanguage,
  region: owner.language.region,
  timeZone: owner.language.timeZone,
  dateFormat: owner.language.dateFormat,
  timeFormat: owner.language.timeFormat,
});

const getLanguage = async (ownerId) => ({
  ...languageDTO(await loadOwner(ownerId)),
  options: { displayLanguages: DISPLAY_LANGUAGES },
});

const updateLanguage = async (ownerId, changes) => {
  const owner = await loadOwner(ownerId);

  for (const key of ['displayLanguage', 'region', 'timeZone', 'dateFormat', 'timeFormat']) {
    if (changes[key] !== undefined) owner.language[key] = changes[key];
  }
  // The rest of the app (and the survey tools) still read preferredLanguage: "en" or "ar".
  if (changes.displayLanguage) owner.preferredLanguage = changes.displayLanguage.split('-')[0];

  await owner.save();
  return languageDTO(owner);
};

/* ---------- Notification settings ---------- */

const notificationsDTO = (owner) => {
  const n = owner.notifications;
  return {
    channels: { email: n.channels.email, inApp: n.channels.inApp },
    email: {
      newFeedback: n.email.newFeedback,
      lowRating: n.email.lowRating,
      weeklyReport: n.email.weeklyReport,
      productNews: n.email.productNews,
      accountSecurity: true, // always on, can't be switched off
      feedbackDelivery: n.email.feedbackDelivery,
    },
    inApp: {
      newFeedback: n.inApp.newFeedback,
      lowRating: n.inApp.lowRating,
      reportsReady: n.inApp.reportsReady,
      sound: n.inApp.sound,
      popups: n.inApp.popups,
    },
  };
};

const getNotifications = async (ownerId) => notificationsDTO(await loadOwner(ownerId));

// Partial update: send only what changed, for example { channels: { email: false } }.
const updateNotifications = async (ownerId, changes) => {
  const owner = await loadOwner(ownerId);

  for (const group of ['channels', 'email', 'inApp']) {
    for (const [key, value] of Object.entries(changes[group] || {})) {
      if (group === 'email' && key === 'accountSecurity') continue;
      owner.notifications[group][key] = value;
    }
  }

  await owner.save();
  return notificationsDTO(owner);
};

module.exports = {
  getAccount,
  updateAccount,
  setAvatar,
  getAvatar,
  removeAvatar,
  getLanguage,
  updateLanguage,
  getNotifications,
  updateNotifications,
};
