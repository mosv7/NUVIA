const jwt = require("jsonwebtoken");

const SESSION_DAYS = 7;

/**
 * payload: { id, type, role, businessId, sid }
 *  - type: "owner" | "member"
 *  - role: "owner" for owners, otherwise the team member role ("manager" or "viewer")
 *  - businessId: the _id of the Business (null for an owner who has not created it yet)
 *  - sid: the Session id. Signing a device out revokes that session, so its token stops working.
 */
const generateToken = ({ id, type, role, businessId, sid }) => {
  return jwt.sign(
    { id, type, role, businessId, ...(sid && { sid }) },
    process.env.JWT_SECRET,
    { expiresIn: `${SESSION_DAYS}d` }
  );
};

const verifyToken = (token) => {
  return jwt.verify(token, process.env.JWT_SECRET);
};

// Short-lived token handed out after the password step when 2FA is on. It only works on /auth/login/2fa.
const generateTwoFactorToken = (id) =>
  jwt.sign({ id, purpose: "2fa" }, process.env.JWT_SECRET, { expiresIn: "5m" });

const verifyTwoFactorToken = (token) => {
  const payload = jwt.verify(token, process.env.JWT_SECRET);
  if (payload.purpose !== "2fa") throw new Error("Invalid token");
  return payload;
};

module.exports = {
  SESSION_DAYS,
  generateToken,
  verifyToken,
  generateTwoFactorToken,
  verifyTwoFactorToken,
};
