const express = require('express');
const { body } = require('express-validator');
const todoController = require('../controllers/todoController');
const { requireAuth } = require('../middleware/authMiddleware');

const router = express.Router();

// Apply authentication middleware to all routes
router.use(requireAuth);

// Validation rules
const todoValidation = [
  body('title')
    .trim()
    .notEmpty()
    .withMessage('Todo title is required')
    .isLength({ max: 200 })
    .withMessage('Title cannot exceed 200 characters'),
  body('description')
    .optional()
    .trim()
    .isLength({ max: 1000 })
    .withMessage('Description cannot exceed 1000 characters'),
  body('priority')
    .optional()
    .isIn(['low', 'medium', 'high'])
    .withMessage('Invalid priority level'),
  body('dueDate')
    .optional()
    .isISO8601()
    .withMessage('Invalid due date format')
];

// Routes 
router.get('/', todoController.getTodos);
router.post('/', todoValidation, todoController.createTodo);
router.put('/:id/status', todoController.updateTodoStatus);
router.delete('/:id', todoController.deleteTodo);  

module.exports = router; 
 