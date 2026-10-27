const crypto = require('crypto');
const mongoose = require('mongoose');

const BusinessOwner = require('../models/businessOwner.model');
const Business = require('../models/business.model');
const Branch = require('../models/branch.model');
const { generateToken } = require('../utils/jwt');

const fail = (message, statusCode = 400) => {
  const error = new Error(message);
  error.statusCode = statusCode;
  return error;
};

const slugify = (text) =>
  text
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
    .slice(0, 150);

// Unique slug: "juniper-coffee", or "juniper-coffee-a1b2c3" on collision.
// Arabic-only names slugify to "", so fall back to "business".
const generateUniqueSlug = async (name) => {
  const base = slugify(name) || 'business';

  if (!(await Business.exists({ slug: base }))) return base;

  for (let i = 0; i < 5; i++) {
    const candidate = `${base}-${crypto.randomBytes(3).toString('hex')}`;
    if (!(await Business.exists({ slug: candidate }))) return candidate;
  }

  throw fail('Could not generate a unique business link, please try again', 500);
};

const findPrimaryBranch = (businessId, session = null) =>
  Branch.findOne({ businessId, status: 'active' }).sort({ createdAt: 1, _id: 1 }).session(session);

// The step is DERIVED from the data, nothing is stored:
//   no business             -> 1 (business information)
//   business, no branch     -> 2 (business setup)
//   business + branch       -> 3 (welcome / get started)
//   onboardingCompleted     -> completed = true
const buildState = (business, branch) => {
  let step = 1;
  if (business) step = branch ? 3 : 2;

  return {
    step,
    completed: Boolean(business && business.onboardingCompleted),
    business: business
      ? {
          id: business._id,
          name: business.name,
          type: business.type,
          slug: business.slug,
          hasMultipleBranches: business.hasMultipleBranches,
        }
      : null,
    branch: branch ? { id: branch._id, name: branch.name } : null,
  };
};

const getStatus = async (ownerId) => {
  const business = await Business.findOne({ ownerId });
  const branch = business ? await findPrimaryBranch(business._id) : null;

  return buildState(business, branch);
};

// Step 1. Create the business, or update it if the user comes back to edit.
// Returns a NEW token because the old one has businessId = null.
const saveBusiness = async (ownerId, { name, type }, sid) => {
  const owner = await BusinessOwner.findById(ownerId).select('+tokenVersion');
  if (!owner) throw fail('User not found', 404);

  let business = await Business.findOne({ ownerId });

  if (business) {
    business.name = name;
    business.type = type;
    await business.save();
  } else {
    business = await Business.create({
      ownerId,
      name,
      type,
      reportLanguage: owner.preferredLanguage || 'en',
      slug: await generateUniqueSlug(name),
    });
  }

  const branch = await findPrimaryBranch(business._id);

  const token = generateToken({
    id: owner._id,
    type: 'owner',
    role: 'owner',
    businessId: business._id,
    tokenVersion: owner.tokenVersion || 0,
    sid,
  });

  return { token, ...buildState(business, branch) };
};

// Step 2. Create (or update) the primary branch.
// Single branch  -> one branch named after the business.
// Multiple       -> one branch named primaryBranchName (more can be added later).
const saveSetup = async (ownerId, { hasMultipleBranches, primaryBranchName }) => {
  try {
    return await mongoose.connection.transaction(async (session) => {
      const business = await Business.findOne({ ownerId }).session(session);
      if (!business) throw fail('Complete business information first', 409);
      const branchName = hasMultipleBranches ? primaryBranchName : business.name;
      let branch = await findPrimaryBranch(business._id, session);
      if (branch) {
        branch.name = branchName;
        await branch.save({ session });
      } else {
        [branch] = await Branch.create([{ businessId: business._id, name: branchName }], {
          session,
        });
      }
      business.hasMultipleBranches = hasMultipleBranches;
      await business.save({ session });
      return buildState(business, branch);
    });
  } catch (error) {
    if (error.code === 11000) {
      throw fail('A branch with this name already exists', 409);
    }
    throw error;
  }
};

// Step 3. "Get Started"
const complete = async (ownerId) => {
  const business = await Business.findOne({ ownerId });
  if (!business) throw fail('Complete business information first', 409);

  const branch = await findPrimaryBranch(business._id);
  if (!branch) throw fail('Complete business setup first', 409);

  business.onboardingCompleted = true;
  await business.save();

  return buildState(business, branch);
};

module.exports = { getStatus, saveBusiness, saveSetup, complete };
