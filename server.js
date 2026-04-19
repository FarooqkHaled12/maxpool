require('dotenv').config();
const app       = require('./app');
const connectDB = require('./config/database');

const PORT = process.env.PORT || 5000;

const start = async () => {
  // Start server first, then try to connect to database
  app.listen(PORT, () => {
    console.log(`[Server] Max Pool API running on http://localhost:${PORT}`);
    console.log(`[Server] Environment: ${process.env.NODE_ENV || 'development'}`);
  });
  
  // Try to connect to database (non-blocking)
  try {
    await connectDB();
  } catch (error) {
    console.log('[Server] Starting without database connection');
  }
};

start();
