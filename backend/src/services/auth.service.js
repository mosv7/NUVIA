const bcrypt = require("bcrypt");

const BusinessOwner = require("../models/businessOwner.model");
const Business = require("../models/business.model");
const { generateToken } = require("../utils/jwt");

// businessId: the Business the account belongs to
// (owners: the business they own, may be null until they create it; members: their business)
const buildAuthResponse = (account, type, businessId) => {
  const user = {
    id: account._id,
    name: account.name,
    email: account.email,
    type, // "owner" | "member"
    role: type === "owner" ? "owner" : account.role, // owner | manager | viewer
    businessId: businessId || null,
  };

  return { user, token: generateToken(user) };
};

const findBusinessIdByOwner = async (ownerId) => {
  const business = await Business.findOne({ ownerId }).select("_id");
  return business ? business._id : null;
};

// Business owners sign up on their own. They create their business afterwards.
// Team members are NOT created here: the owner invites them.
const register = async ({ name, email, password, phone, preferredLanguage }) => {
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

  return buildAuthResponse(owner, "owner", null);
};

const login = async ({ email, password }) => {
  // 1) business owner
  const owner = await BusinessOwner.findOne({ email }).select("+passwordHash");

  if (owner && (await bcrypt.compare(password, owner.passwordHash))) {
    if (owner.status !== "active") {
      throw new Error("Account is not active");
    }

    await BusinessOwner.updateOne({ _id: owner._id }, { lastLogin: new Date() });

    const businessId = await findBusinessIdByOwner(owner._id);
    return buildAuthResponse(owner, "owner", businessId);
  }
};

const getMe = async (userId) => {

  const user = await BusinessOwner.findById(userId);

  if (!user) {
    throw new Error("User not found");
  }

  return user;
};

module.exports = { register, login, getMe };