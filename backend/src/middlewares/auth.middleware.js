const { verifyToken } = require('../utils/jwt');
const { AUTH_COOKIE } = require('../utils/browserSession');
const BusinessOwner = require('../models/businessOwner.model');
const Business = require('../models/business.model');

const resolveIdentity = async (req) => {
  const header = req.get('Authorization');
  let token = req.cookies?.[AUTH_COOKIE];
  if (header) {
    if (!/^Bearer [^ ]+$/.test(header)) return null;
    token = header.slice(7);
  }
  if (!token) return null;
  let payload;
  try {
    payload = verifyToken(token);
  } catch {
    return null;
  }
  if (payload.type !== 'owner' || !/^[a-f0-9]{24}$/i.test(payload.id)) return null;
  const owner = await BusinessOwner.findById(payload.id).select('+tokenVersion');
  if (
    !owner ||
    owner.status !== 'active' ||
    (owner.tokenVersion || 0) !== (payload.tokenVersion || 0)
  )
    return null;
  // Derive scope from the current owner relationship rather than stale token claims.
  const business = await Business.findOne({ ownerId: owner._id }).select('_id');
  return {
    owner,
    user: {
      id: String(owner._id),
      type: 'owner',
      role: 'owner',
      businessId: business ? String(business._id) : null,
    },
  };
};

const authenticate = async (req, res, next) => {
  try {
    const identity = await resolveIdentity(req);
    if (!identity)
      return res.status(401).json({
        error: { code: 'SESSION_EXPIRED', message: 'Sign in to continue' },
        message: 'Sign in to continue',
      });
    req.user = identity.user;
    req.account = identity.owner;
    next();
  } catch {
    res.status(503).json({
      error: { code: 'STORAGE_UNAVAILABLE', message: 'Service temporarily unavailable' },
      message: 'Service temporarily unavailable',
    });
  }
};
const authorize =
  (...roles) =>
  (req, res, next) => {
    if (!roles.includes(req.user.role))
      return res.status(403).json({ message: 'You do not have permission to do this' });
    next();
  };
module.exports = authenticate;
module.exports.authorize = authorize;
module.exports.resolveIdentity = resolveIdentity;
