const { verifyToken } = require("../utils/jwt");

const authenticate = (req, res, next) => {
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

    // req.user = { id, type, role, businessId }
    req.user = verifyToken(parts[1]);

    next();
  } catch (error) {
    return res.status(401).json({
      message: "Invalid or expired token",
    });
  }
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