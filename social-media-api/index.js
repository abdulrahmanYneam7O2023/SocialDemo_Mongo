require('dotenv').config();

const { ApolloServer } = require('@apollo/server');
const { startStandaloneServer } = require('@apollo/server/standalone');
const express = require('express');
const connectDB = require('./src/config/db');
const { typeDefs, resolvers } = require('./src/graphql');
const authRoutes = require('./src/routes/auth');
const logger = require('./src/utils/logger');

const app = express();
app.use(express.json());
app.use('/auth', authRoutes);

const startServer = async () => {
  try {
    await connectDB();
    const server = new ApolloServer({
      typeDefs,
      resolvers,
      validationRules: [require('graphql-depth-limit')(5)],
      context: ({ req }) => {
        const token = req.headers.authorization?.replace('Bearer ', '');
        if (!token) return { user: null };
        try {
          const jwt = require('jsonwebtoken');
          const user = jwt.verify(token, process.env.JWT_SECRET);
          return { user };
        } catch {
          return { user: null };
        }
      },
    });
    const { url } = await startStandaloneServer(server, {
      listen: { port: process.env.PORT || 4000 },
    });
    logger.info(`🚀 Server ready at ${url}`);
  } catch (err) {
    logger.error('Server startup error:', err);
    process.exit(1);
  }
};

startServer();