require('dotenv').config();

const { ApolloServer } = require('@apollo/server');
const { expressMiddleware } = require('@apollo/server/express4');
const express = require('express');
const cors = require('cors');
const { connectDB, checkDatabaseConnection } = require('./src/config/db');
const { typeDefs, resolvers } = require('./src/graphql');
const logger = require('./src/utils/logger');

const startServer = async () => {
  try {
    // الاتصال بقاعدة البيانات (أو تشغيل بدونها)
    await connectDB();

    // إنشاء Express app
    const app = express();
    
    // Middleware أساسي
    app.use(cors());
    app.use(express.json());
    
    // صفحة ترحيب
        app.get('/', (req, res) => {
      const dbStatus = checkDatabaseConnection();
      
      res.json({
        message: '🚀 Enhanced Social Media API is running!',
        status: `✅ Connected to MongoDB: ${dbStatus.database}`,
        database: {
          connected: dbStatus.isConnected,
          host: dbStatus.host,
          port: dbStatus.port,
          database: dbStatus.database,
          state: dbStatus.state
        },
        endpoints: {
          graphql: '/graphql',
          playground: '/graphql (GraphQL Playground)',
          docs: '/graphql (for schema exploration)'
        },
        features: {
          genericQuery: 'استعلام موحد لجميع النماذج',
          genericMutation: 'عمليات موحدة (CRUD + أكثر)',
          socialMedia: 'إدارة محتوى السوشيال ميديا',
          analytics: 'تحليلات وإحصائيات مفصلة',
          scheduling: 'جدولة المحتوى للنشر',
          multiPlatform: 'دعم منصات متعددة'
        },
        platforms: [
          'Instagram', 'Facebook', 'Twitter', 
          'LinkedIn', 'TikTok', 'YouTube'
        ],
        operations: [
          'CREATE', 'UPDATE', 'DELETE', 'DUPLICATE',
          'BULK_CREATE', 'BULK_UPDATE', 'BULK_DELETE',
          'ARCHIVE', 'UNARCHIVE'
        ]
      });
    });

    // إعداد Apollo Server
    const server = new ApolloServer({
      typeDefs,
      resolvers,
      validationRules: [require('graphql-depth-limit')(5)],
      introspection: true, // تفعيل للتطوير
      playground: true,   // تفعيل GraphQL Playground
    });

    // تشغيل Apollo Server
    await server.start();

    // إضافة GraphQL middleware إلى Express (بدون مصادقة)
    app.use('/graphql', expressMiddleware(server));

    // تشغيل السيرفر
            const PORT = process.env.PORT || 4000;
        app.listen(PORT, () => {
          const dbStatus = checkDatabaseConnection();
          
          logger.info(`🚀 Enhanced Social Media API Server running on http://localhost:${PORT}`);
          logger.info(`📊 GraphQL endpoint: http://localhost:${PORT}/graphql`);
          logger.info(`🎮 GraphQL Playground: http://localhost:${PORT}/graphql`);
          logger.info(`🗄️  Database: ${dbStatus.database} (${dbStatus.state})`);
          logger.info(`🔧 Generic Operations: Query & Mutation available`);
          logger.info(`📱 Social Media Platforms: Instagram, Facebook, Twitter, LinkedIn, TikTok, YouTube`);
          logger.info(`⚡ Ready for production workloads!`);
        });
    
  } catch (err) {
    logger.error('❌ Server startup error:', err);
    process.exit(1);
  }
};

startServer();