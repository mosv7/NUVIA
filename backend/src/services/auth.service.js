const bcrypt = require('bcrypt');

const BusinessOwner = require('../models/businessOwner.model');
const Business = require('../models/business.model');
const { generateToken } = require('../utils/jwt');
const Branch = require('../models/branch.model');
const { fail } = require('../utils/errors');

const toUser = (account, businessId) => ({
  id: String(account._id),
  name: account.name,
  email: account.email,
  type: 'owner',
  role: 'owner',
  businessId: businessId ? String(businessId) : null,
  locale: account.preferredLanguage === 'ar' ? 'ar' : 'en',
  emailVerificationAvailable: false,
});

// businessId: the Business the account belongs to
// (owners: the business they own, may be null until they create it; members: their business)
const buildAuthResponse = (account, type, businessId) => {
  const user = toUser(account, businessId);

  return { user, token: generateToken({ ...user, tokenVersion: account.tokenVersion || 0 }) };
};

const findBusinessIdByOwner = async (ownerId) => {
  const business = await Business.findOne({ ownerId }).select('_id');
  return business ? business._id : null;
};

// Business owners sign up on their own. They create their business afterwards.
// Team members are NOT created here: the owner invites them.
const register = async ({ name, email, password, phone, preferredLanguage }) => {
  const existingOwner = await BusinessOwner.findOne({ email });

  if (existingOwner) {
    throw fail('Email already exists', 409);
  }

  const passwordHash = await bcrypt.hash(password, 10);

  const owner = await BusinessOwner.create({
    name,
    email,
    passwordHash,
    phone,
    preferredLanguage: preferredLanguage || 'en',
  });

  return buildAuthResponse(owner, 'owner', null);
};

const login = async ({ email, password }) => {
  // 1) business owner
  const owner = await BusinessOwner.findOne({ email }).select('+passwordHash +tokenVersion');

  if (owner && (await bcrypt.compare(password, owner.passwordHash))) {
    if (owner.status !== 'active') {
      throw new Error('Account is not active');
    }

    const businessId = await findBusinessIdByOwner(owner._id);
    return buildAuthResponse(owner, 'owner', businessId);
  }
  const error = fail('Invalid email or password', 401);
  error.code = 'INVALID_CREDENTIALS';
  throw error;
};

const getMe = async (userId) => {
  const user = await BusinessOwner.findById(userId);

  if (!user) {
    throw new Error('User not found');
  }

  return user;
};

const getWorkspace = async (owner) => {
  const business = await Business.findOne({ ownerId: owner._id }).lean();
  if (!business) return null;
  const branches = await Branch.find({ businessId: business._id })
    .sort({ createdAt: 1, _id: 1 })
    .lean();
  const primary = branches.find((branch) => branch.status === 'active');
  return {
    id: String(business._id),
    businessName: business.name,
    industry: business.type,
    locale: business.reportLanguage === 'ar' ? 'ar' : 'en',
    reportingTimezone: 'UTC',
    branchType: primary ? (business.hasMultipleBranches ? 'multiple' : 'single') : null,
    primaryBranchId: primary ? String(primary._id) : null,
    onboardingStep: business.onboardingCompleted ? 'complete' : primary ? 'welcome' : 'branches',
    branches: branches.map((branch) => ({
      id: String(branch._id),
      name: branch.name,
      country: branch.country || '',
      city: branch.city || '',
      address: branch.address || '',
      status: branch.status,
      archivedAt: branch.archivedAt || null,
      isPrimary: String(branch._id) === String(primary?._id),
    })),
  };
};
module.exports = { register, login, getMe, getWorkspace, toUser };
