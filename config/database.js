/*const mongoose = require('mongoose');
const logger = require('../utils/logger');

const connectDB = async () => {
  try {
    let mongoUri;
    
    if (process.env.NODE_ENV === 'development') {
      // Use in-memory MongoDB for development
      const mongod = await MongoMemoryServer.create();
      mongoUri = mongod.getUri();
      console.log('Using in-memory MongoDB for development');
    } else {
      // Using Atlas for production
      mongoUri = process.env.MONGODB_URI;
    }
    
    const conn = await mongoose.connect(mongoUri);
    console.log(`MongoDB Connected: ${conn.connection.host}`);
  } catch (error) {
    console.error('Database connection error:', error.message);
    process.exit(1);
  }
};

module.exports = connectDB;


const mongoose = require('mongoose');
const { MongoMemoryServer } = require('mongodb-memory-server');

let mongod;

const connectDB = async () => {
  try {
    let mongoUri;
    
    if (process.env.NODE_ENV === 'production') {
      // Use Atlas for production
      mongoUri = process.env.MONGODB_URI;
      console.log('Connecting to MongoDB Atlas...');
    } else {
      // Use in-memory MongoDB for development
      console.log('Starting local MongoDB instance...');
      mongod = await MongoMemoryServer.create({
        instance: {
          port: 27017, // Use standard MongoDB port
          dbName: 'todoapp' // Your database name
        }
      });
      mongoUri = mongod.getUri();
      console.log('Local MongoDB instance started');
    }
    
    const conn = await mongoose.connect(mongoUri, {
      serverSelectionTimeoutMS: 5000,
      socketTimeoutMS: 45000,
    });
    
    console.log(`MongoDB Connected: ${conn.connection.host}`);
    console.log(`Database: ${conn.connection.name}`);
    
    return conn;
  } catch (error) {
    console.error('Database connection error:', error.message);
    process.exit(1);
  }
};

// Graceful shutdown
const closeDB = async () => {
  try {
    await mongoose.connection.close();
    if (mongod) {
      await mongod.stop();
      console.log('Local MongoDB instance stopped');
    }
  } catch (error) {
    console.error('Error closing database:', error.message);
  }
};

// Handle app termination
process.on('SIGINT', async () => {
  console.log('\nShutting down...');
  await closeDB();
  process.exit(0);
});

process.on('SIGTERM', async () => {
  console.log('\nShutting down...');
  await closeDB();
  process.exit(0);
});

module.exports = { connectDB, closeDB };
*/


const mongoose = require('mongoose');

const connectDB = async () => {
  try {
    //const conn = await mongoose.connect(process.env.MONGODB_URI, {
      //useNewUrlParser: true,
      //useUnifiedTopology: true,
      //serverSelectionTimeoutMS: 5000, // Reduce timeout for faster feedback
     // socketTimeoutMS: 45000,
      const client = new MongoClient(uri, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  tls: true,
  tlsAllowInvalidCertificates: true,
  tlsAllowInvalidHostnames: true,
   ssl: true,
});
   // });

    console.log(`MongoDB Connected: ${conn.connection.host}`);
  } catch (error) {
    console.error('Database connection error:', error.message);
    process.exit(1);
  }
};  

// Handle connection events
mongoose.connection.on('disconnected', () => {
  console.log('MongoDB disconnected');
});

mongoose.connection.on('error', (err) => {
  console.error('MongoDB connection error:', err);
});
mongoose.set('debug', true); // If using Mongoose
// or
client.on('serverHeartbeatFailed', (event) => {
  console.log('Heartbeat failed:', event);
});

process.on('SIGINT', async () => {
  await mongoose.connection.close();
  console.log('MongoDB connection closed through app termination');
  process.exit(0);
});
      
module.exports = connectDB;


// simple-test.js
/*require('dotenv').config();
const mongoose = require('mongoose');

console.log('🚀 Starting MongoDB connection test...');
console.log('📍 Environment:', process.env.NODE_ENV);
console.log('🔗 URI (masked):', process.env.MONGODB_URI?.replace(/:([^:@]{2})[^:@]*@/, ':****@'));

mongoose.connect(process.env.MONGODB_URI, {
    serverSelectionTimeoutMS: 15000,
    socketTimeoutMS: 45000,
    family: 4,
    bufferCommands: false,
})
.then(() => {
    console.log('✅ SUCCESS: Connected to MongoDB!');
    console.log('🏠 Host:', mongoose.connection.host);
    console.log('🗄️  Database:', mongoose.connection.name);
    process.exit(0);
})
.catch((error) => {
    console.log('❌ FAILED: Could not connect to MongoDB');
    console.log('🔍 Error details:');
    console.log('   Message:', error.message);
    console.log('   Name:', error.name);
    console.log('   Code:', error.code || 'N/A');
    
    if (error.reason) {
        console.log('🌐 Topology info:');
        console.log('   Type:', error.reason.type);
        console.log('   Servers:', error.reason.servers.size);
        
        error.reason.servers.forEach((server, address) => {
            console.log(`   📍 ${address}: ${server.type} (RTT: ${server.roundTripTime}ms)`);
        });
    }   
    
    console.log('\n💡 Next steps:');
    console.log('1. Try connecting from mobile hotspot');
    console.log('2. Check if you\'re using VPN');
    console.log('3. Try from different network');
    
    process.exit(1); 
}); */