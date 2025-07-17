const mongoose = require('mongoose');
const logger = require('../utils/logger');

const connectDB = async () => {
  try {
    // التحقق من وجود MONGODB_URI
    if (!process.env.MONGODB_URI) {
      logger.warn('⚠️  MongoDB URI not found. Running in memory mode...');
      logger.info('📝 Database operations will use mock data');
      return;
    }

    await mongoose.connect(process.env.MONGODB_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    logger.info('✅ Connected to MongoDB');
  } catch (err) {
    logger.warn('⚠️  MongoDB connection failed. Running without database...');
    logger.info('📝 You can still test GraphQL endpoints');
    // لا نوقف التطبيق، فقط نكمل بدون قاعدة البيانات
  }
};

module.exports = connectDB;