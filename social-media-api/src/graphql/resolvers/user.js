const { User } = require('../../models/User');
const { authMiddleware } = require('../../middleware/auth');
const { handleError } = require('../../utils/errorHandler');

const userResolvers = {
  Query: {
    me: authMiddleware(async (parent, args, { user }) => {
      try {
        console.log('👤 Fetching user profile from MongoDB...');
        
        if (!user) return null;
        
        const foundUser = await User.findById(user.id).select('-password');
        if (!foundUser) {
          throw handleError('User not found', 'USER_NOT_FOUND', 404);
        }
        
        console.log(`✅ Found user: ${foundUser.username}`);
        
        return {
          id: foundUser._id.toString(),
          username: foundUser.username,
          email: foundUser.email,
          createdAt: foundUser.createdAt.toISOString(),
        };
      } catch (error) {
        console.error('❌ Error fetching user:', error);
        if (error.name === 'CastError') {
          throw handleError('Invalid user ID', 'INVALID_ID', 400);
        }
        throw handleError('Failed to fetch user profile', 'FETCH_ERROR', 500);
      }
    }),
  },
};

module.exports = userResolvers;