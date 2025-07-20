const { GraphQLError } = require('graphql');

const authMiddleware = (resolve) => {
  return async (parent, args, context, info) => {
    // التحقق من وجود المستخدم في السياق
    if (!context.user) {
      console.log('❌ Authentication required but no user found in context');
      throw new GraphQLError('You must be logged in to access this resource', {
        extensions: { 
          code: 'UNAUTHENTICATED',
          statusCode: 401
        }
      });
    }
    
    console.log(`✅ Authenticated user: ${context.user.id}`);
    return resolve(parent, args, context, info);
  };
};

module.exports = { authMiddleware };