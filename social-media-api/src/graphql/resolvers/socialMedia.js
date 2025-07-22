const { SocialContent } = require('../../models/SocialContent');
const { handleError } = require('../../utils/errorHandler');
const { mockDB } = require('../../utils/mockData');

const socialMediaResolvers = {
  Query: {
    allPosts: async (parent, { filter, sort, limit = 10, skip = 0 }) => {
      console.log('📝 Using mock database for allPosts');
      
      // استخدام البيانات الوهمية
      const posts = mockDB.getAllPosts(filter || {}, sort || {}, limit, skip);
      
      return posts.map(post => ({
        id: post.contentId || post.id,
        platform: post.platform,
        contentType: post.contentType,
        content: post.content || '',
        createdAt: post.createdAt,
        likes: post.metrics?.likes || 0,
        comments: post.metrics?.comments || 0,
        shares: post.metrics?.shares || 0,
        views: post.metrics?.views || 0,
        author: post.author || 'Unknown',
        createdBy: post.createdBy,
      }));
    },

    postsByPlatform: async (parent, { platform, filter, sort }) => {
      console.log(`📝 Using mock database for postsByPlatform: ${platform}`);
      
      const filterWithPlatform = { ...filter, platform };
      const posts = mockDB.getAllPosts(filterWithPlatform, sort || {}, 50, 0);
      
      return posts.map(post => ({
        id: post.contentId || post.id,
        platform: post.platform,
        contentType: post.contentType,
        content: post.content || '',
        createdAt: post.createdAt,
        likes: post.metrics?.likes || 0,
        comments: post.metrics?.comments || 0,
        shares: post.metrics?.shares || 0,
        views: post.metrics?.views || 0,
        author: post.author || 'Unknown',
        createdBy: post.createdBy,
      }));
    },

    postsByContentType: async (parent, { contentType, filter, sort }) => {
      console.log(`📝 Using mock database for postsByContentType: ${contentType}`);
      
      const filterWithContentType = { ...filter, contentType };
      const posts = mockDB.getAllPosts(filterWithContentType, sort || {}, 50, 0);
      
      return posts.map(post => ({
        id: post.contentId || post.id,
        platform: post.platform,
        contentType: post.contentType,
        content: post.content || '',
        createdAt: post.createdAt,
        likes: post.metrics?.likes || 0,
        comments: post.metrics?.comments || 0,
        shares: post.metrics?.shares || 0,
        views: post.metrics?.views || 0,
        author: post.author || 'Unknown',
        createdBy: post.createdBy,
      }));
    },
  },

  Mutation: {
    addPost: async (parent, { input }) => {
      console.log('📝 Using mock database for addPost');
      
      // استخدام مستخدم افتراضي
      const defaultUserId = '1';
      const post = mockDB.createPost(input, defaultUserId);
      
      return {
        id: post.contentId || post.id,
        platform: post.platform,
        contentType: post.contentType,
        content: post.content || '',
        createdAt: post.createdAt,
        likes: post.metrics?.likes || 0,
        comments: post.metrics?.comments || 0,
        shares: post.metrics?.shares || 0,
        views: post.metrics?.views || 0,
        author: post.author || 'Unknown',
        createdBy: post.createdBy,
      };
    },

    updatePost: async (parent, { id, input }) => {
      console.log(`📝 Using mock database for updatePost: ${id}`);
      
      const post = mockDB.updatePost(id, input);
      if (!post) throw handleError('Post not found', 'POST_NOT_FOUND', 404);
      
      return {
        id: post.contentId || post.id,
        platform: post.platform,
        contentType: post.contentType,
        content: post.content || '',
        createdAt: post.createdAt,
        likes: post.metrics?.likes || 0,
        comments: post.metrics?.comments || 0,
        shares: post.metrics?.shares || 0,
        views: post.metrics?.views || 0,
        author: post.author || 'Unknown',
        createdBy: post.createdBy,
      };
    },

    deletePost: async (parent, { id }) => {
      console.log(`📝 Using mock database for deletePost: ${id}`);
      
      const success = mockDB.deletePost(id);
      if (!success) throw handleError('Post not found', 'POST_NOT_FOUND', 404);
      
      return true;
    },
  },
};

module.exports = socialMediaResolvers;