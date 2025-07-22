// Import all schema and resolvers
const socialMediaResolvers = require('./resolvers/socialMedia');
const userResolvers = require('./resolvers/user');
const analyticsResolvers = require('./resolvers/analytics');
const genericResolvers = require('./resolvers/generic');

const socialMediaTypeDefs = require('./schemas/socialMedia');
const userTypeDefs = require('./schemas/user');
const analyticsTypeDefs = require('./schemas/analytics');
const genericTypeDefs = require('./schemas/generic');

// Combine all typeDefs including generic schemas
const typeDefs = [
  genericTypeDefs,      // Generic operations first
  socialMediaTypeDefs,
  userTypeDefs,
  analyticsTypeDefs
];

// Combine all resolvers including generic operations
const resolvers = {
  Query: {
    ...genericResolvers.Query,        // Generic queries first
    ...socialMediaResolvers.Query,
    ...userResolvers.Query,
    ...analyticsResolvers.Query
  },
  Mutation: {
    ...genericResolvers.Mutation,     // Generic mutations first
    ...socialMediaResolvers.Mutation
  }
};

module.exports = { typeDefs, resolvers };