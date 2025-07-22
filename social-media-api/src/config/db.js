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
        logger.error('❌ MongoDB URI not found and no config file available');
        logger.info('💡 Please set MONGODB_URI in your .env file');
        logger.info('📝 Example: MONGODB_URI=mongodb://localhost:27017/social-media-api');
        throw new Error('Database configuration not found');
      }
    }

    // الاتصال بقاعدة البيانات مع إعدادات محسنة
    await mongoose.connect(process.env.MONGODB_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      maxPoolSize: 10,           // حد أقصى للاتصالات
      serverSelectionTimeoutMS: 5000,  // مهلة اختيار الخادم
      socketTimeoutMS: 45000,    // مهلة المقبس
      family: 4                  // استخدام IPv4
    });
    
    // معلومات قاعدة البيانات
    const dbInfo = mongoose.connection;
    logger.info('✅ Connected to MongoDB successfully');
    logger.info(`🗄️  Database: ${dbInfo.name}`);
    logger.info(`📡 Host: ${dbInfo.host}:${dbInfo.port}`);
    logger.info(`📊 Connection state: ${getConnectionState(dbInfo.readyState)}`);
    
    // مراقبة أحداث قاعدة البيانات
    dbInfo.on('connected', () => {
      logger.info('🟢 Mongoose connected to MongoDB');
    });
    
    dbInfo.on('error', (err) => {
      logger.error('❌ Mongoose connection error:', err);
    });
    
    dbInfo.on('disconnected', () => {
      logger.warn('🟡 Mongoose disconnected from MongoDB');
    });
    
    dbInfo.on('reconnected', () => {
      logger.info('🔄 Mongoose reconnected to MongoDB');
    });
    
    // إغلاق الاتصال عند إنهاء التطبيق
    process.on('SIGINT', async () => {
      await dbInfo.close();
      logger.info('🔐 MongoDB connection closed through app termination');
      process.exit(0);
    });
    
  } catch (err) {
    logger.error('❌ MongoDB connection failed:', err.message);
    logger.error('💡 Make sure MongoDB is running and the connection string is correct');
    throw err; // إيقاف التطبيق إذا فشل الاتصال بقاعدة البيانات
  }
};

/**
 * الحصول على حالة الاتصال كنص
 */
function getConnectionState(state) {
  const states = {
    0: 'Disconnected',
    1: 'Connected',
    2: 'Connecting',
    3: 'Disconnecting'
  };
  return states[state] || 'Unknown';
}

/**
 * فحص حالة قاعدة البيانات
 */
const checkDatabaseConnection = () => {
  const state = mongoose.connection.readyState;
  return {
    isConnected: state === 1,
    state: getConnectionState(state),
    host: mongoose.connection.host,
    port: mongoose.connection.port,
    database: mongoose.connection.name
  };
};

module.exports = { 
  connectDB, 
  checkDatabaseConnection 
};