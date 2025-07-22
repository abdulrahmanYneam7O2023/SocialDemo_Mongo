const { mockDB } = require('../../utils/mockData');

const userResolvers = {
  Query: {
    me: async () => {
      console.log('📝 Using mock database for user');
      
      // إرجاع أول مستخدم وهمي
      const foundUser = mockDB.users[0];
      
      return {
        id: foundUser.id || foundUser._id,
        username: foundUser.username,
        email: foundUser.email,
        createdAt: foundUser.createdAt,
      };
    },
  },
};

module.exports = userResolvers;