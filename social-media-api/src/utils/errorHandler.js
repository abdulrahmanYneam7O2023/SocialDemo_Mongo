const { GraphQLError } = require('graphql');

const handleError = (message, code, statusCode = 400) => {
  return new GraphQLError(message, {
    extensions: { 
      code: code,
      statusCode: statusCode 
    }
  });
};

module.exports = { handleError };