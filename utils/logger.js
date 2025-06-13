//const fs = require('fs');
//const path = require('path');

// Ensure logs directory exists
/*const logsDir = path.join(__dirname, '../logs');
if (!fs.existsSync(logsDir)) {
  fs.mkdirSync(logsDir);
}

const logger = {
  info: (message, meta = {}) => {
    const logEntry = {
      timestamp: new Date().toISOString(),
      level: 'INFO',
      message,
      ...meta
    };
    console.log(`[INFO] ${logEntry.timestamp}: ${message}`);
    fs.appendFileSync(path.join(logsDir, 'app.log'), JSON.stringify(logEntry) + '\n');
  },

  error: (message, meta = {}) => {
    const logEntry = {
      timestamp: new Date().toISOString(),
      level: 'ERROR',
      message,
      ...meta
    };
    console.error(`[ERROR] ${logEntry.timestamp}: ${message}`);
    fs.appendFileSync(path.join(logsDir, 'error.log'), JSON.stringify(logEntry) + '\n');
  },

  warn: (message, meta = {}) => {
    const logEntry = {
      timestamp: new Date().toISOString(),
      level: 'WARN',
      message,
      ...meta
    };
    console.warn(`[WARN] ${logEntry.timestamp}: ${message}`);
    fs.appendFileSync(path.join(logsDir, 'app.log'), JSON.stringify(logEntry) + '\n');
  }
};

module.exports = logger;*/
const fs = require('fs');
const path = require('path');

// Ensure logs directory exists
const logsDir = path.join(__dirname, '../logs');
if (!fs.existsSync(logsDir)) {
  fs.mkdirSync(logsDir, { recursive: true });
}

const safeWrite = (filePath, data) => {
  try {
    fs.appendFileSync(filePath, data);
  } catch (err) {
    console.error(`[LOGGER ERROR] Failed to write to ${filePath}:`, err.message);
  }
};

const logger = {
  info: (message, meta = {}) => {
    const logEntry = {
      timestamp: new Date().toISOString(),
      level: 'INFO',
      message,
      ...meta
    };
    console.log(`[INFO] ${logEntry.timestamp}: ${message}`);
    safeWrite(path.join(logsDir, 'app.log'), JSON.stringify(logEntry) + '\n');
  },

  error: (message, meta = {}) => {
    const logEntry = {
      timestamp: new Date().toISOString(),
      level: 'ERROR',
      message,
      ...meta
    };
    console.error(`[ERROR] ${logEntry.timestamp}: ${message}`);
    safeWrite(path.join(logsDir, 'error.log'), JSON.stringify(logEntry) + '\n');
  },

  warn: (message, meta = {}) => {
    const logEntry = {
      timestamp: new Date().toISOString(),
      level: 'WARN',
      message,
      ...meta 
    };
    console.warn(`[WARN] ${logEntry.timestamp}: ${message}`);
    safeWrite(path.join(logsDir, 'app.log'), JSON.stringify(logEntry) + '\n');
  }
};  

module.exports = logger;
