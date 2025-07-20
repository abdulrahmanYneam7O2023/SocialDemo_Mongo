const mongoose = require('mongoose');
const logger = require('../utils/logger');

const connectDB = async () => {
  try {
    // قراءة إعدادات من ملف النص إذا لم يوجد MONGODB_URI
    if (!process.env.MONGODB_URI) {
      try {
        const fs = require('fs');
        const envData = fs.readFileSync('./cd411483-63a0-44d6-b48c-706cfddb2264.txt', 'utf8');
        const lines = envData.split('\n');
        lines.forEach(line => {
          const [key, value] = line.split('=');
          if (key && value) {
            process.env[key.trim()] = value.trim();
          }
        });
        logger.info('📋 Loaded configuration from text file');
      } catch (e) {
        logger.warn('⚠️  MongoDB URI not found and no config file available');
        throw new Error('Database configuration not found');
      }
    }

    await mongoose.connect(process.env.MONGODB_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    
    logger.info('✅ Connected to MongoDB successfully');
    logger.info(`🗄️  Database: ${mongoose.connection.name}`);
    
    // إضافة event listeners للاتصال
    mongoose.connection.on('error', (err) => {
      logger.error('MongoDB connection error:', err);
    });
    
    mongoose.connection.on('disconnected', () => {
      logger.warn('MongoDB disconnected');
    });
    
    mongoose.connection.on('reconnected', () => {
      logger.info('MongoDB reconnected');
    });
    
  } catch (err) {
    logger.error('❌ MongoDB connection failed:', err.message);
    logger.error('💡 Make sure MongoDB is running on the correct port');
    throw err; // إيقاف التطبيق إذا فشل الاتصال بقاعدة البيانات
  }
};

module.exports = connectDB;