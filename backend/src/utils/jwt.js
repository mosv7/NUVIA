const jwt = require('jsonwebtoken');

/**
 * payload: { id, type, role, businessId }
 *  - type: "owner" | "member"
 *  - role: "owner" for owners, otherwise the team member role ("manager" or "viewer")
 *  - businessId: the _id of the Business (null for an owner who has not created it yet)
 */
const generateToken = ({ id, type, role, businessId, tokenVersion = 0, sid }) => {
  return jwt.sign({ id, type, role, businessId, tokenVersion, sid }, process.env.JWT_SECRET, {
    expiresIn: '7d',
  });
};

const verifyToken = (token) => {
  return jwt.verify(token, process.env.JWT_SECRET, { algorithms: ['HS256'] });
};

const SESSION_DAYS = 7;
const generateTwoFactorToken = (id, tokenVersion) =>
  jwt.sign({ id, tokenVersion, purpose: '2fa' }, process.env.JWT_SECRET, { expiresIn: '5m' });
const verifyTwoFactorToken = (token) => {
  const payload = verifyToken(token);
  if (payload.purpose !== '2fa') throw new Error('Invalid token');
  return payload;
};
module.exports = {
  SESSION_DAYS,
  generateTwoFactorToken,
  verifyTwoFactorToken,
  generateToken,
  verifyToken,
};
