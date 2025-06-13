const { validationResult } = require('express-validator');
const User = require('../models/userModel');
const logger = require('../utils/logger');

const register = async (req, res, next) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.render('auth/register', { 
        title: 'Register',
        errors: errors.array(),
        formData: req.body
      });
    }

    const { username, password } = req.body;
    
    const user = new User({ username, password });
    await user.save();
    
    logger.info(`New user registered: ${username}`);
    
    req.session.user = {
      id: user._id,
      username: user.username
    };
    
    res.redirect('/todos');
  } catch (error) {
    next(error);
  }
};

const login = async (req, res, next) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.render('auth/login', { 
        title: 'Login',
        errors: errors.array(),
        formData: req.body
      });
    }

    const { username, password } = req.body;
    
    const user = await User.findOne({ username });
    if (!user || !await user.comparePassword(password)) {
      return res.render('auth/login', { 
        title: 'Login',
        errors: [{ msg: 'Invalid username or password' }],
        formData: req.body
      });
    }
    
    logger.info(`User logged in: ${username}`);
    
    req.session.user = {
      id: user._id,
      username: user.username
    };
    
    res.redirect('/todos');
  } catch (error) {
    next(error);
  }
};

const logout = (req, res) => {
  const username = req.session.user?.username;
  req.session.destroy((err) => {
    if (err) {
      logger.error('Session destruction error:', err);
    } else {
      logger.info(`User logged out: ${username}`);
    }
    res.redirect('/auth/login');
  });
};

module.exports = {
  register,
  login,
  logout
};