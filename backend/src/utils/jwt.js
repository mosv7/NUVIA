const jwt = require('jsonwebtoken');

/**
 * payload: { id, type, role, businessId }
 *  - type: "owner" | "member"
 *  - role: "owner" for owners, otherwise the team member role ("manager" or "viewer")
 *  - businessId: the _id of the Business (null for an owner who has not created it yet)
 */
const generateToken = ({ id, type, role, businessId, tokenVersion = 0 }) => {
  return jwt.sign({ id, type, role, businessId, tokenVersion }, process.env.JWT_SECRET, {
    expiresIn: '7d',
  });
};

const verifyToken = (token) => {
  return jwt.verify(token, process.env.JWT_SECRET, { algorithms: ['HS256'] });
};

module.exports = {
  generateToken,
  verifyToken,
};
