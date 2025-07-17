const { loadFilesSync } = require('@graphql-tools/load-files');
const { mergeTypeDefs, mergeResolvers } = require('@graphql-tools/merge');
const path = require('path');

const typeDefs = mergeTypeDefs(
  loadFilesSync(path.join(__dirname, 'schemas'), { extensions: ['js'] })
);
const resolvers = mergeResolvers([
  require('./resolvers/socialMedia'),
  require('./resolvers/analytics'),
  require('./resolvers/user'),
]);

module.exports = { typeDefs, resolvers };