const { SocialContent } = require('../../models/SocialContent');
const { User } = require('../../models/User');
const { handleError } = require('../../utils/errorHandler');
const { authMiddleware } = require('../../middleware/auth');
const mongoose = require('mongoose');

const socialMediaResolvers = {
  Query: {
    allPosts: authMiddleware(async (parent, { filter, sort, limit = 10, skip = 0 }) => {
      try {
        console.log('🔍 Fetching posts from MongoDB...');
        
        // بناء query للفلترة
        let mongoFilter = {};
        
        if (filter) {
          if (filter.author) {
            mongoFilter.author = { $regex: filter.author, $options: 'i' };
          }
          if (filter.likes && filter.likes.gte) {
            mongoFilter['metrics.likes'] = { $gte: filter.likes.gte };
          }
          if (filter.createdAt) {
            mongoFilter.createdAt = {};
            if (filter.createdAt.gte) mongoFilter.createdAt.$gte = new Date(filter.createdAt.gte);
            if (filter.createdAt.lte) mongoFilter.createdAt.$lte = new Date(filter.createdAt.lte);
          }
        }
        
        // بناء sort
        let mongoSort = {};
        if (sort) {
          const sortField = sort.field === 'likes' ? 'metrics.likes' : sort.field;
          mongoSort[sortField] = sort.order === 'DESC' ? -1 : 1;
        } else {
          mongoSort.createdAt = -1; // الافتراضي: الأحدث أولاً
        }
        
        const posts = await SocialContent.find(mongoFilter)
          .populate('createdBy', 'username email createdAt')
          .sort(mongoSort)
          .limit(limit)
          .skip(skip);
        
        console.log(`✅ Found ${posts.length} posts`);
        
        return posts.map(post => ({
          id: post._id.toString(),
          platform: post.platform,
          contentType: post.contentType,
          content: post.content || '',
          createdAt: post.createdAt.toISOString(),
          likes: post.metrics?.likes || 0,
          comments: post.metrics?.comments || 0,
          shares: post.metrics?.shares || 0,
          views: post.metrics?.views || 0,
          author: post.author || 'Unknown',
          createdBy: post.createdBy ? {
            id: post.createdBy._id.toString(),
            username: post.createdBy.username,
            email: post.createdBy.email,
            createdAt: post.createdBy.createdAt.toISOString()
          } : null,
        }));
      } catch (error) {
        console.error('❌ Error fetching posts:', error);
        throw handleError('Failed to fetch posts', 'FETCH_ERROR', 500);
      }
    }),
    postsByPlatform: authMiddleware(async (parent, { platform, filter, sort }) => {
      try {
        console.log(`🔍 Fetching posts for platform: ${platform}`);
        
        let mongoFilter = { platform };
        
        if (filter) {
          if (filter.author) {
            mongoFilter.author = { $regex: filter.author, $options: 'i' };
          }
          if (filter.likes && filter.likes.gte) {
            mongoFilter['metrics.likes'] = { $gte: filter.likes.gte };
          }
          if (filter.createdAt) {
            mongoFilter.createdAt = {};
            if (filter.createdAt.gte) mongoFilter.createdAt.$gte = new Date(filter.createdAt.gte);
            if (filter.createdAt.lte) mongoFilter.createdAt.$lte = new Date(filter.createdAt.lte);
          }
        }
        
        let mongoSort = {};
        if (sort) {
          const sortField = sort.field === 'likes' ? 'metrics.likes' : sort.field;
          mongoSort[sortField] = sort.order === 'DESC' ? -1 : 1;
        } else {
          mongoSort.createdAt = -1;
        }
        
        const posts = await SocialContent.find(mongoFilter)
          .populate('createdBy', 'username email createdAt')
          .sort(mongoSort)
          .limit(50);
        
        console.log(`✅ Found ${posts.length} posts for ${platform}`);
        
        return posts.map(post => ({
          id: post._id.toString(),
          platform: post.platform,
          contentType: post.contentType,
          content: post.content || '',
          createdAt: post.createdAt.toISOString(),
          likes: post.metrics?.likes || 0,
          comments: post.metrics?.comments || 0,
          shares: post.metrics?.shares || 0,
          views: post.metrics?.views || 0,
          author: post.author || 'Unknown',
          createdBy: post.createdBy ? {
            id: post.createdBy._id.toString(),
            username: post.createdBy.username,
            email: post.createdBy.email,
            createdAt: post.createdBy.createdAt.toISOString()
          } : null,
        }));
      } catch (error) {
        console.error(`❌ Error fetching posts for platform ${platform}:`, error);
        throw handleError(`Failed to fetch posts for platform ${platform}`, 'FETCH_ERROR', 500);
      }
    }),
    postsByContentType: authMiddleware(async (parent, { contentType, filter, sort }) => {
      try {
        console.log(`🔍 Fetching posts for content type: ${contentType}`);
        
        let mongoFilter = { contentType };
        
        if (filter) {
          if (filter.author) {
            mongoFilter.author = { $regex: filter.author, $options: 'i' };
          }
          if (filter.likes && filter.likes.gte) {
            mongoFilter['metrics.likes'] = { $gte: filter.likes.gte };
          }
          if (filter.createdAt) {
            mongoFilter.createdAt = {};
            if (filter.createdAt.gte) mongoFilter.createdAt.$gte = new Date(filter.createdAt.gte);
            if (filter.createdAt.lte) mongoFilter.createdAt.$lte = new Date(filter.createdAt.lte);
          }
        }
        
        let mongoSort = {};
        if (sort) {
          const sortField = sort.field === 'likes' ? 'metrics.likes' : sort.field;
          mongoSort[sortField] = sort.order === 'DESC' ? -1 : 1;
        } else {
          mongoSort.createdAt = -1;
        }
        
        const posts = await SocialContent.find(mongoFilter)
          .populate('createdBy', 'username email createdAt')
          .sort(mongoSort)
          .limit(50);
        
        console.log(`✅ Found ${posts.length} posts for content type ${contentType}`);
        
        return posts.map(post => ({
          id: post._id.toString(),
          platform: post.platform,
          contentType: post.contentType,
          content: post.content || '',
          createdAt: post.createdAt.toISOString(),
          likes: post.metrics?.likes || 0,
          comments: post.metrics?.comments || 0,
          shares: post.metrics?.shares || 0,
          views: post.metrics?.views || 0,
          author: post.author || 'Unknown',
          createdBy: post.createdBy ? {
            id: post.createdBy._id.toString(),
            username: post.createdBy.username,
            email: post.createdBy.email,
            createdAt: post.createdBy.createdAt.toISOString()
          } : null,
        }));
      } catch (error) {
        console.error(`❌ Error fetching posts for content type ${contentType}:`, error);
        throw handleError(`Failed to fetch posts for content type ${contentType}`, 'FETCH_ERROR', 500);
      }
    }),
  },
  Mutation: {
    addPost: authMiddleware(async (parent, { input }, { user }) => {
      try {
        console.log('➕ Creating new post in MongoDB...');
        
        if (!user) throw handleError('Unauthorized', 'UNAUTHORIZED', 401);
        
        // البحث عن المستخدم في قاعدة البيانات
        const foundUser = await User.findById(user.id);
        if (!foundUser) throw handleError('User not found', 'USER_NOT_FOUND', 404);
        
        // إنشاء contentId فريد
        const contentId = `post_${Date.now()}_${Math.random().toString(36).substring(7)}`;
        
        const newPost = new SocialContent({
          contentId,
          platform: input.platform,
          contentType: input.contentType,
          content: input.content,
          author: input.author || foundUser.username,
          status: 'PUBLISHED',
          createdBy: foundUser._id,
          metrics: {
            likes: 0,
            comments: 0,
            shares: 0,
            views: 0
          }
        });
        
        const savedPost = await newPost.save();
        await savedPost.populate('createdBy', 'username email createdAt');
        
        console.log(`✅ Created new post: ${savedPost.contentId}`);
        
        return {
          id: savedPost._id.toString(),
          platform: savedPost.platform,
          contentType: savedPost.contentType,
          content: savedPost.content || '',
          createdAt: savedPost.createdAt.toISOString(),
          likes: savedPost.metrics?.likes || 0,
          comments: savedPost.metrics?.comments || 0,
          shares: savedPost.metrics?.shares || 0,
          views: savedPost.metrics?.views || 0,
          author: savedPost.author,
          createdBy: {
            id: savedPost.createdBy._id.toString(),
            username: savedPost.createdBy.username,
            email: savedPost.createdBy.email,
            createdAt: savedPost.createdBy.createdAt.toISOString()
          },
        };
      } catch (error) {
        console.error('❌ Error creating post:', error);
        if (error.name === 'ValidationError') {
          throw handleError('Invalid post data', 'VALIDATION_ERROR', 400);
        }
        throw handleError('Failed to create post', 'CREATE_ERROR', 500);
      }
    }),
    updatePost: authMiddleware(async (parent, { id, input }, { user }) => {
      try {
        console.log(`✏️ Updating post: ${id}`);
        
        if (!user) throw handleError('Unauthorized', 'UNAUTHORIZED', 401);
        
        // البحث عن المنشور والتأكد من ملكية المستخدم له
        const post = await SocialContent.findById(id).populate('createdBy', 'username email createdAt');
        if (!post) throw handleError('Post not found', 'POST_NOT_FOUND', 404);
        
        // التأكد من أن المستخدم هو مالك المنشور
        if (post.createdBy._id.toString() !== user.id) {
          throw handleError('Not authorized to update this post', 'FORBIDDEN', 403);
        }
        
        // تحديث البيانات
        const updateData = {};
        if (input.platform) updateData.platform = input.platform;
        if (input.contentType) updateData.contentType = input.contentType;
        if (input.content !== undefined) updateData.content = input.content;
        if (input.author) updateData.author = input.author;
        
        const updatedPost = await SocialContent.findByIdAndUpdate(
          id,
          updateData,
          { new: true, runValidators: true }
        ).populate('createdBy', 'username email createdAt');
        
        console.log(`✅ Updated post: ${updatedPost.contentId}`);
        
        return {
          id: updatedPost._id.toString(),
          platform: updatedPost.platform,
          contentType: updatedPost.contentType,
          content: updatedPost.content || '',
          createdAt: updatedPost.createdAt.toISOString(),
          likes: updatedPost.metrics?.likes || 0,
          comments: updatedPost.metrics?.comments || 0,
          shares: updatedPost.metrics?.shares || 0,
          views: updatedPost.metrics?.views || 0,
          author: updatedPost.author,
          createdBy: {
            id: updatedPost.createdBy._id.toString(),
            username: updatedPost.createdBy.username,
            email: updatedPost.createdBy.email,
            createdAt: updatedPost.createdBy.createdAt.toISOString()
          },
        };
      } catch (error) {
        console.error('❌ Error updating post:', error);
        if (error.name === 'ValidationError') {
          throw handleError('Invalid post data', 'VALIDATION_ERROR', 400);
        }
        if (error.name === 'CastError') {
          throw handleError('Invalid post ID', 'INVALID_ID', 400);
        }
        throw handleError('Failed to update post', 'UPDATE_ERROR', 500);
      }
    }),
    deletePost: authMiddleware(async (parent, { id }, { user }) => {
      try {
        console.log(`🗑️ Deleting post: ${id}`);
        
        if (!user) throw handleError('Unauthorized', 'UNAUTHORIZED', 401);
        
        // البحث عن المنشور والتأكد من ملكية المستخدم له
        const post = await SocialContent.findById(id);
        if (!post) throw handleError('Post not found', 'POST_NOT_FOUND', 404);
        
        // التأكد من أن المستخدم هو مالك المنشور
        if (post.createdBy.toString() !== user.id) {
          throw handleError('Not authorized to delete this post', 'FORBIDDEN', 403);
        }
        
        await SocialContent.findByIdAndDelete(id);
        
        console.log(`✅ Deleted post: ${post.contentId}`);
        
        return true;
      } catch (error) {
        console.error('❌ Error deleting post:', error);
        if (error.name === 'CastError') {
          throw handleError('Invalid post ID', 'INVALID_ID', 400);
        }
        throw handleError('Failed to delete post', 'DELETE_ERROR', 500);
      }
    }),
  },
};

module.exports = socialMediaResolvers;