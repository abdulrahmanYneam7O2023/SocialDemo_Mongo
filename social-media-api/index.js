require('dotenv').config();

const { ApolloServer } = require('@apollo/server');
const { expressMiddleware } = require('@apollo/server/express4');
const express = require('express');
const cors = require('cors');
const connectDB = require('./src/config/db');
const { typeDefs, resolvers } = require('./src/graphql');
const authRoutes = require('./src/routes/auth');
const logger = require('./src/utils/logger');

const startServer = async () => {
  try {
    // الاتصال بقاعدة البيانات
    await connectDB();

    // إنشاء Express app
    const app = express();
    
    // Middleware أساسي
    app.use(cors());
    app.use(express.json());
    
    // REST Routes - يجب أن تكون قبل GraphQL
    app.use('/auth', authRoutes);
    
    // صفحة ترحيب
    app.get('/', (req, res) => {
      res.json({ 
        message: '🚀 Social Media API is running!',
        endpoints: {
          graphql: '/graphql',
          auth: '/auth',
          playground: '/graphql (for GraphQL Playground)'
        }
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

    // إضافة GraphQL middleware إلى Express
    app.use('/graphql', expressMiddleware(server, {
      context: async ({ req }) => {
        const token = req.headers.authorization?.replace('Bearer ', '');
        if (!token) return { user: null };
        
        try {
          const jwt = require('jsonwebtoken');
          const user = jwt.verify(token, process.env.JWT_SECRET);
          return { user };
        } catch (error) {
          logger.warn('Invalid token:', error.message);
          return { user: null };
        }
      },
    }));

    // تشغيل السيرفر
    const PORT = process.env.PORT || 4000;
    app.listen(PORT, () => {
      logger.info(`🚀 Server running on http://localhost:${PORT}`);
      logger.info(`🔐 Auth endpoints: http://localhost:${PORT}/auth`);
      logger.info(`📊 GraphQL endpoint: http://localhost:${PORT}/graphql`);
      logger.info(`🎮 GraphQL Playground: http://localhost:${PORT}/graphql`);
    });
    
  } catch (err) {
    logger.error('❌ Server startup error:', err);
    process.exit(1);
  }
};

startServer();