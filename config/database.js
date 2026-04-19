const mongoose = require('mongoose');

const connectDB = async () => {
  try {
    const conn = await mongoose.connect(process.env.MONGO_URI, {
      serverSelectionTimeoutMS: 3000,
      socketTimeoutMS: 5000,
    });
    console.log(`[DB] MongoDB connected: ${conn.connection.host}`);
  } catch (err) {
    console.error(`[DB] Connection failed: ${err.message}`);
    console.error('[DB] Make sure MongoDB is running on localhost:27017');
    console.error('[DB] Continuing without database connection...');
    // Don't exit, continue without DB for now
  }
};

module.exports = connectDB;
