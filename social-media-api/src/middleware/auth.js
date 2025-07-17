const { GraphQLError } = require('graphql');

const authMiddleware = (resolve) => {
  return async (parent, args, context, info) => {
    // في وضع التطوير بدون قاعدة بيانات، نتجاهل المصادقة
    if (process.env.NODE_ENV === 'development' && !context.user) {
      console.log('🔓 Development mode: Skipping authentication');
      // إنشاء مستخدم وهمي للتجربة
      context.user = { id: '1', username: 'testuser' };
    }
    
    if (!context.user) {
      throw new GraphQLError('You must be logged in', {
        extensions: { code: 'UNAUTHENTICATED' }
      });
    }
    return resolve(parent, args, context, info);
  };
};

module.exports = { authMiddleware };