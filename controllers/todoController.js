const { validationResult } = require('express-validator');
const Todo = require('../models/todoModel');
const logger = require('../utils/logger');

const getTodos = async (req, res, next) => {
  try {
    const { status = 'all', sort = 'createdAt', order = 'desc' } = req.query;
    
    let filter = { userId: req.session.user.id };
    if (status !== 'all' && status !== 'deleted') {
      filter.status = status;
    }
    
    // Don't show deleted todos unless specifically requested
    if (status !== 'deleted') {
      filter.status = { $ne: 'deleted' };
    }
    
    const sortObj = {};
    sortObj[sort] = order === 'asc' ? 1 : -1;
    
    const todos = await Todo.find(filter).sort(sortObj);
    
    const stats = {
      total: await Todo.countDocuments({ userId: req.session.user.id, status: { $ne: 'deleted' } }),
      pending: await Todo.countDocuments({ userId: req.session.user.id, status: 'pending' }),
      completed: await Todo.countDocuments({ userId: req.session.user.id, status: 'completed' })
    };
    
    res.render('todos/index', { 
      title: 'My Todos',
      todos,
      stats,
      currentStatus: status,
      currentSort: sort,
      currentOrder: order
    });
  } catch (error) {
    next(error);
  }
};

const createTodo = async (req, res, next) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      const todos = await Todo.find({ userId: req.session.user.id, status: { $ne: 'deleted' } });
      return res.render('todos/index', { 
        title: 'My Todos',
        todos,
        errors: errors.array(),
        formData: req.body
      });
    }

    const { title, description, priority, dueDate } = req.body;
    
    const todo = new Todo({
      title,
      description,
      priority,
      dueDate: dueDate || undefined,
      userId: req.session.user.id
    });
    
    await todo.save();
    
    logger.info(`Todo created by ${req.session.user.username}: ${title}`);
    
    res.redirect('/todos');
  } catch (error) {
    next(error);
  }
};

const updateTodoStatus = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { status } = req.body;
    
    const todo = await Todo.findOne({ _id: id, userId: req.session.user.id });
    if (!todo) {
      return res.status(404).json({ error: 'Todo not found' });
    }
    
    todo.status = status;
    await todo.save();
    
    logger.info(`Todo status updated by ${req.session.user.username}: ${todo.title} -> ${status}`);
    
    res.json({ success: true, todo });
  } catch (error) {
    next(error);
  }
};

const deleteTodo = async (req, res, next) => {
  try {
    const { id } = req.params;
    
    const todo = await Todo.findOne({ _id: id, userId: req.session.user.id });
    if (!todo) {
      return res.status(404).json({ error: 'Todo not found' });
    }
    
    todo.status = 'deleted';
    await todo.save();
    
    logger.info(`Todo deleted by ${req.session.user.username}: ${todo.title}`);
    
    res.json({ success: true });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getTodos,
  createTodo,
  updateTodoStatus,
  deleteTodo
};