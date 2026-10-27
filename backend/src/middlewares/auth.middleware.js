const { verifyToken } = require("../utils/jwt");
const { touchSession } = require("../services/session.service");

const authenticate = async (req, res, next) => {
  let payload;

  try {
    const authHeader = req.headers.authorization;

    if (!authHeader) {
      return res.status(401).json({
        message: "Authentication required",
      });
    }

    const parts = authHeader.split(" ");

    if (parts.length !== 2 || parts[0] !== "Bearer") {
      return res.status(401).json({
        message: "Invalid authorization format",
      });
    }

    payload = verifyToken(parts[1]);

    // The short token handed out for the 2FA step is not a login.
    if (payload.purpose) throw new Error("Wrong token type");

    // Tokens issued before sessions existed have no sid; they keep working until they expire.
    if (payload.sid && !(await touchSession(payload.sid, payload.id))) {
      return res.status(401).json({ message: "This session has ended, please sign in again" });
    }
  } catch (error) {
    return res.status(401).json({
      message: "Invalid or expired token",
    });
  }

  // req.user = { id, type, role, businessId, sid }
  req.user = payload;
  next();
};

// Usage: router.post("/branches", authenticate, authorize("owner", "manager"), ...)
const authorize = (...allowedRoles) => (req, res, next) => {
  if (!allowedRoles.includes(req.user.role)) {
    return res.status(403).json({
      message: "You do not have permission to do this",
    });
  }

  next();
};

module.exports = authenticate;          // keeps your existing import working
module.exports.authorize = authorize;   // const { authorize } = require(...)