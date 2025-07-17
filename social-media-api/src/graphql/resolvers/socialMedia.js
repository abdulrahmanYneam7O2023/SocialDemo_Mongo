const { SocialContent } = require('../../models/SocialContent');
const { handleError } = require('../../utils/errorHandler');
const { authMiddleware } = require('../../middleware/auth');
const { mockDB } = require('../../utils/mockData');
const mongoose = require('mongoose');

const socialMediaResolvers = {
  Query: {
    allPosts: authMiddleware(async (parent, { filter, sort, limit = 10, skip = 0 }) => {
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
    }),
    postsByPlatform: authMiddleware(async (parent, { platform, filter, sort }) => {
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
    }),
    postsByContentType: authMiddleware(async (parent, { contentType, filter, sort }) => {
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
    }),
  },
  Mutation: {
    addPost: authMiddleware(async (parent, { input }, { user }) => {
      console.log('📝 Using mock database for addPost');
      
      if (!user) throw handleError('Unauthorized', 'UNAUTHORIZED', 401);
      
      const post = mockDB.createPost(input, user.id);
      
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
        author: post.author || user.username || 'Unknown',
        createdBy: post.createdBy,
      };
    }),
    updatePost: authMiddleware(async (parent, { id, input }, { user }) => {
      console.log(`📝 Using mock database for updatePost: ${id}`);
      
      if (!user) throw handleError('Unauthorized', 'UNAUTHORIZED', 401);
      
      const post = mockDB.updatePost(id, input);
      if (!post) throw handleError('Post not found or unauthorized', 'POST_NOT_FOUND', 404);
      
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
    }),
    deletePost: authMiddleware(async (parent, { id }, { user }) => {
      console.log(`📝 Using mock database for deletePost: ${id}`);
      
      if (!user) throw handleError('Unauthorized', 'UNAUTHORIZED', 401);
      
      const success = mockDB.deletePost(id);
      if (!success) throw handleError('Post not found or unauthorized', 'POST_NOT_FOUND', 404);
      
      return true;
    }),
  },
};

module.exports = socialMediaResolvers;