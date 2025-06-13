const express = require('express');
const { body } = require('express-validator');
const authController = require('../controllers/authController');
const { redirectIfAuthenticated } = require('../middleware/authMiddleware');

const router = express.Router();

// Validation rules
const registerValidation = [
  body('username')
    .trim()
    .isLength({ min: 3, max: 30 })
    .withMessage('Username must be between 3 and 30 characters')
    .matches(/^[a-zA-Z0-9_]+$/)
    .withMessage('Username can only contain letters, numbers, and underscores'),
  body('password')
    .isLength({ min: 6 })
    .withMessage('Password must be at least 6 characters long'),
  body('confirmPassword')
    .custom((value, { req }) => {
      if (value !== req.body.password) {
        throw new Error('Passwords do not match');
      }
      return true;
    })
];

const loginValidation = [
  body('username').trim().notEmpty().withMessage('Username is required'),
  body('password').notEmpty().withMessage('Password is required')
];

// Routes
router.get('/register', redirectIfAuthenticated, (req, res) => {
  res.render('auth/register', { title: 'Register' });
});

router.post('/register', redirectIfAuthenticated, registerValidation, authController.register);

router.get('/login', redirectIfAuthenticated, (req, res) => {
  res.render('auth/login', { title: 'Login' });
});

router.post('/login', redirectIfAuthenticated, loginValidation, authController.login);

router.post('/logout', authController.logout);

module.exports = router;