const express = require('express');
const mongoose = require('mongoose');
const session = require('express-session');
//const {connectDB} = require('./config/database');
const MongoStore = require('connect-mongo');
const path = require('path');
const helmet = require('helmet');
const morgan = require('morgan');
require('dotenv').config();
const logger = require('./utils/logger');
const errorHandler = require('./middleware/errorHandler');
const authRoutes = require('./routes/authRoutes');
const todoRoutes = require('./routes/todoRoutes');

const app = express();
 
// Security middleware   
app.use(helmet()); 
    
// Logging middleware
app.use(morgan('combined', { stream: { write: message => logger.info(message.trim()) } }));
  
// View engine setup
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

// Static files
app.use(express.static(path.join(__dirname, 'public'))); 

// Body parsing middleware
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

//Session configuration 
app.use(session({
secret: process.env.SESSION_SECRET,
  resave: false,
  saveUninitialized: false,
  store: MongoStore.create({
    mongoUrl: process.env.MONGODB_URI
  }),
  cookie: { 
   secure: process.env.NODE_ENV === 'production',
    maxAge: 24 * 60 * 60 * 1000 // 24 hours
  }
})); 
 
// Make user available in all views
app.use((req, res, next) => {
  res.locals.user = req.session.user || null;
  next();
});

// Routes
app.use('/auth', authRoutes);
app.use('/todos', todoRoutes);

// Home route
app.get('/', (req, res) => {
  if (req.session.user) {
    res.redirect('/todos');
  } else {
    res.redirect('/auth/login');
  }
});

// 404 handler
app.use( (req, res) => {
  res.status(404).render('error', { 
    title: 'Page Not Found',
    message: 'The page you are looking for does not exist.',
    error: { status: 404 }
  });
});
  
// Global error handler
app.use(errorHandler);

// Database connection and server start
const PORT = process.env.PORT || 3000;

const dns = require('dns');
dns.setDefaultResultOrder('ipv4first');
mongoose.connect(process.env.MONGODB_URI)
  .then(() => {
    logger.info('Connected to MongoDB');
    app.listen(PORT, () => {
      logger.info(`Server running on port ${PORT}`);
    });
  })
  .catch(err => {
    logger.error('Database connection error:', err);
    process.exit(1);
  });

module.exports = app;   