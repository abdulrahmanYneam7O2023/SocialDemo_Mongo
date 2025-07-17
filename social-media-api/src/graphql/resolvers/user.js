const { authMiddleware } = require('../../middleware/auth');
const { mockDB } = require('../../utils/mockData');

const userResolvers = {
  Query: {
    me: authMiddleware(async (parent, args, { user }) => {
      console.log('📝 Using mock database for user');
      
      if (!user) return null;
      
      const foundUser = mockDB.findUserById(user.id) || mockDB.users[0];
      
      return {
        id: foundUser.id || foundUser._id,
        username: foundUser.username,
        email: foundUser.email,
        createdAt: foundUser.createdAt,
      };
    }),
  },
};

module.exports = userResolvers;