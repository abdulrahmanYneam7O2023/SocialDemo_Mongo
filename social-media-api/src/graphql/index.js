// Import all schema and resolvers
const socialMediaResolvers = require('./resolvers/socialMedia');
const userResolvers = require('./resolvers/user');
const analyticsResolvers = require('./resolvers/analytics');
const genericResolvers = require('./resolvers/generic');
const socialConnectionResolvers = require('./resolvers/socialConnection'); // New import

const socialMediaTypeDefs = require('./schemas/socialMedia');
const userTypeDefs = require('./schemas/user');
const analyticsTypeDefs = require('./schemas/analytics');
const genericTypeDefs = require('./schemas/generic');
const socialConnectionTypeDefs = require('./schemas/socialConnection'); // New import

const { GraphQLJSON } = require('graphql-type-json');

// Combine all typeDefs including generic schemas
const typeDefs = [
  genericTypeDefs,      // Generic operations first
  socialConnectionTypeDefs, // Social connection operations
  socialMediaTypeDefs,
  userTypeDefs,
  analyticsTypeDefs
];

// Combine all resolvers with JSON scalar support
const resolvers = {
  // Add JSON scalar
  JSON: GraphQLJSON,
  
  Query: {
    ...genericResolvers.Query,        // Generic queries first
    ...socialConnectionResolvers.Query, // Social connection queries
    ...socialMediaResolvers.Query,
    ...userResolvers.Query,
    ...analyticsResolvers.Query
  },
  Mutation: {
    ...genericResolvers.Mutation,     // Generic mutations first
    ...socialConnectionResolvers.Mutation, // Social connection mutations
    ...socialMediaResolvers.Mutation
  },
  
  // Include field resolvers for SocialConnection
  SocialConnection: socialConnectionResolvers.SocialConnection
};

module.exports = {
  typeDefs,
  resolvers
};