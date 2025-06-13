const logger = require('../utils/logger');

const errorHandler = (err, req, res, next) => {
  logger.error('Error occurred:', {
    message: err.message,
    stack: err.stack,
    url: req.originalUrl,
    method: req.method,
    ip: req.ip
  });

  // Mongoose validation error
  if (err.name === 'ValidationError') {
    const errors = Object.values(err.errors).map(e => e.message);
    return res.status(400).render('error', {
      title: 'Validation Error',
      message: errors.join(', '),
      error: { status: 400 }
    });
  }

  // Mongoose duplicate key error
  if (err.code === 11000) {
    return res.status(400).render('error', {
      title: 'Duplicate Error',
      message: 'Username already exists',
      error: { status: 400 }
    });
  }

  // Default error
  res.status(err.status || 500).render('error', {
    title: 'Server Error',
    message: process.env.NODE_ENV === 'production' 
      ? 'Something went wrong!' 
      : err.message,
    error: process.env.NODE_ENV === 'production' 
      ? { status: 500 } 
      : err
  });
};

module.exports = errorHandler;