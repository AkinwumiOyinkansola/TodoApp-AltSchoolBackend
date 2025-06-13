const logger = require('../utils/logger');

const requireAuth = (req, res, next) => {
  if (!req.session.user) {
    logger.warn(`Unauthorized access attempt to ${req.originalUrl}`);
    return res.redirect('/auth/login');
  }
  next();
};

const redirectIfAuthenticated = (req, res, next) => {
  if (req.session.user) {
    return res.redirect('/todos');
  }
  next();
};

module.exports = {
  requireAuth,
  redirectIfAuthenticated
};