const bcrypt = require("bcrypt");

const BusinessOwner = require("../models/businessOwner.model");
const Business = require("../models/business.model");
const { generateToken, generateTwoFactorToken } = require("../utils/jwt");
const { createSession } = require("./session.service");

// businessId: the Business the account belongs to
// (owners: the business they own, may be null until they create it; members: their business)
const buildAuthResponse = async (account, type, businessId, meta) => {
  const session = await createSession(account._id, meta);

  const user = {
    id: account._id,
    name: account.name,
    email: account.email,
    type, // "owner" | "member"
    role: type === "owner" ? "owner" : account.role, // owner | manager | viewer
    businessId: businessId || null,
  };

  return { user, token: generateToken({ ...user, sid: session._id }) };
};

const findBusinessIdByOwner = async (ownerId) => {
  const business = await Business.findOne({ ownerId }).select("_id");
  return business ? business._id : null;
};

// Business owners sign up on their own. They create their business afterwards.
// Team members are NOT created here: the owner invites them.
const register = async ({ name, email, password, phone, preferredLanguage, meta }) => {
  const existingOwner = await BusinessOwner.findOne({ email });

  if (existingOwner) {
    throw new Error("Email already exists");
  }

  const passwordHash = await bcrypt.hash(password, 10);

  const owner = await BusinessOwner.create({
    name,
    email,
    passwordHash,
    phone,
    preferredLanguage: preferredLanguage || "en",
  });

  return buildAuthResponse(owner, "owner", null, meta);
};

const login = async ({ email, password, meta }) => {
  const owner = await BusinessOwner.findOne({ email }).select("+passwordHash");

  if (!owner || !(await bcrypt.compare(password, owner.passwordHash))) {
    throw new Error("Invalid email or password");
  }

  if (owner.status !== "active") {
    throw new Error("Account is not active");
  }

  // Password was right but the account has 2FA: the app must now send the 6-digit code.
  if (owner.twoFactor?.enabled) {
    return { requiresTwoFactor: true, twoFactorToken: generateTwoFactorToken(owner._id) };
  }

  return completeLogin(owner, meta);
};

// Final step of every login: record it and create the session.
const completeLogin = async (owner, meta) => {
  await BusinessOwner.updateOne({ _id: owner._id }, { lastLogin: new Date() });

  const businessId = await findBusinessIdByOwner(owner._id);
  return buildAuthResponse(owner, "owner", businessId, meta);
};

const getMe = async (userId) => {

  const user = await BusinessOwner.findById(userId);

  if (!user) {
    throw new Error("User not found");
  }

  return user;
};

module.exports = { register, login, completeLogin, getMe };