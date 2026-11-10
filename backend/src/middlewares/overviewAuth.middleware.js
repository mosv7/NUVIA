const authenticate = require('./auth.middleware');

const overviewAuth = (req, res, next) => {
  authenticate(req, res, (error) => {
    if (error) {
      return next(error);
    }

    // Make sure user is authenticated
    if (!req.user) {
      return res.status(401).json({
        success: false,
        message: 'Authentication required',
      });
    }

    // Overview is available to business owners
    if (req.user.type !== 'owner') {
      return res.status(403).json({
        success: false,
        message: 'Access denied',
      });
    }

    // Make sure owner has an associated business
    if (!req.user.businessId) {
      return res.status(403).json({
        success: false,
        message: 'No business associated with this account',
      });
    }

    return next();
  });
};

module.exports = overviewAuth;