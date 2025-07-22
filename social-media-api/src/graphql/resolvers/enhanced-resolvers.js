const { SocialContent } = require('../../models/SocialContent');
const { User } = require('../../models/User');
const { SocialAnalytics } = require('../../models/SocialAnalytics');
const { handleError } = require('../../utils/errorHandler');
const { authMiddleware } = require('../../middleware/auth');
const mongoose = require('mongoose');

const enhancedResolvers = {
  Query: {
    // ==============================
    // User Queries
    // ==============================
    me: authMiddleware(async (parent, args, { user }) => {
      try {
        const foundUser = await User.findById(user.id).select('-password');
        if (!foundUser) throw handleError('User not found', 'USER_NOT_FOUND', 404);
        return foundUser;
      } catch (error) {
        throw handleError('Failed to fetch user profile', 'FETCH_ERROR', 500);
      }
    }),

    user: authMiddleware(async (parent, { id }) => {
      try {
        const foundUser = await User.findById(id).select('-password');
        if (!foundUser) throw handleError('User not found', 'USER_NOT_FOUND', 404);
        return foundUser;
      } catch (error) {
        throw handleError('Failed to fetch user', 'FETCH_ERROR', 500);
      }
    }),

    users: authMiddleware(async (parent, { limit = 10, skip = 0 }) => {
      try {
        const users = await User.find({})
          .select('-password')
          .sort({ createdAt: -1 })
          .limit(limit)
          .skip(skip);
        return users;
      } catch (error) {
        throw handleError('Failed to fetch users', 'FETCH_ERROR', 500);
      }
    }),

    // ==============================
    // Post Queries
    // ==============================
    allPosts: authMiddleware(async (parent, { filter, sort, limit = 10, skip = 0 }) => {
      try {
        let mongoFilter = {};
        
        // Build filter
        if (filter) {
          if (filter.platform) mongoFilter.platform = filter.platform;
          if (filter.contentType) mongoFilter.contentType = filter.contentType;
          if (filter.author) mongoFilter.author = { $regex: filter.author, $options: 'i' };
          if (filter.status) mongoFilter.status = filter.status;
          if (filter.visibility) mongoFilter.visibility = filter.visibility;
          if (filter.location) mongoFilter.location = { $regex: filter.location, $options: 'i' };
          if (filter.language) mongoFilter.language = filter.language;
          
          if (filter.hashtags && filter.hashtags.length > 0) {
            mongoFilter.hashtags = { $in: filter.hashtags };
          }
          
          if (filter.likes) {
            if (filter.likes.gte) mongoFilter['metrics.likes'] = { $gte: filter.likes.gte };
            if (filter.likes.lte) mongoFilter['metrics.likes'] = { ...mongoFilter['metrics.likes'], $lte: filter.likes.lte };
            if (filter.likes.eq) mongoFilter['metrics.likes'] = filter.likes.eq;
          }
          
          if (filter.views) {
            if (filter.views.gte) mongoFilter['metrics.views'] = { $gte: filter.views.gte };
            if (filter.views.lte) mongoFilter['metrics.views'] = { ...mongoFilter['metrics.views'], $lte: filter.views.lte };
            if (filter.views.eq) mongoFilter['metrics.views'] = filter.views.eq;
          }
          
          if (filter.createdAt) {
            mongoFilter.createdAt = {};
            if (filter.createdAt.gte) mongoFilter.createdAt.$gte = new Date(filter.createdAt.gte);
            if (filter.createdAt.lte) mongoFilter.createdAt.$lte = new Date(filter.createdAt.lte);
            if (filter.createdAt.eq) mongoFilter.createdAt = new Date(filter.createdAt.eq);
          }
        }
        
        // Build sort
        let mongoSort = {};
        if (sort) {
          switch (sort.field) {
            case 'LIKES':
              mongoSort['metrics.likes'] = sort.order === 'DESC' ? -1 : 1;
              break;
            case 'VIEWS':
              mongoSort['metrics.views'] = sort.order === 'DESC' ? -1 : 1;
              break;
            case 'COMMENTS':
              mongoSort['metrics.comments'] = sort.order === 'DESC' ? -1 : 1;
              break;
            case 'SHARES':
              mongoSort['metrics.shares'] = sort.order === 'DESC' ? -1 : 1;
              break;
            case 'ENGAGEMENT_RATE':
              mongoSort['engagement.rate'] = sort.order === 'DESC' ? -1 : 1;
              break;
            case 'ENGAGEMENT_SCORE':
              mongoSort['engagement.score'] = sort.order === 'DESC' ? -1 : 1;
              break;
            case 'PUBLISHED_AT':
              mongoSort.publishedAt = sort.order === 'DESC' ? -1 : 1;
              break;
            default:
              mongoSort.createdAt = sort.order === 'DESC' ? -1 : 1;
          }
        } else {
          mongoSort.createdAt = -1;
        }
        
        const total = await SocialContent.countDocuments(mongoFilter);
        const posts = await SocialContent.find(mongoFilter)
          .populate('createdBy', 'username email avatar isVerified')
          .sort(mongoSort)
          .limit(limit)
          .skip(skip);
        
        const hasMore = skip + limit < total;
        const nextCursor = hasMore ? (skip + limit).toString() : null;
        
        return {
          posts,
          total,
          hasMore,
          nextCursor
        };
      } catch (error) {
        console.error('Error fetching posts:', error);
        throw handleError('Failed to fetch posts', 'FETCH_ERROR', 500);
      }
    }),

    post: authMiddleware(async (parent, { id }) => {
      try {
        const post = await SocialContent.findById(id)
          .populate('createdBy', 'username email avatar isVerified');
        if (!post) throw handleError('Post not found', 'POST_NOT_FOUND', 404);
        return post;
      } catch (error) {
        throw handleError('Failed to fetch post', 'FETCH_ERROR', 500);
      }
    }),

    postsByPlatform: authMiddleware(async (parent, { platform, filter, sort, limit = 10, skip = 0 }) => {
      try {
        let mongoFilter = { platform };
        
        // Apply additional filters
        if (filter) {
          if (filter.contentType) mongoFilter.contentType = filter.contentType;
          if (filter.author) mongoFilter.author = { $regex: filter.author, $options: 'i' };
          if (filter.status) mongoFilter.status = filter.status;
          // ... other filters similar to allPosts
        }
        
        const total = await SocialContent.countDocuments(mongoFilter);
        const posts = await SocialContent.find(mongoFilter)
          .populate('createdBy', 'username email avatar isVerified')
          .sort(sort ? { [sort.field.toLowerCase()]: sort.order === 'DESC' ? -1 : 1 } : { createdAt: -1 })
          .limit(limit)
          .skip(skip);
        
        return {
          posts,
          total,
          hasMore: skip + limit < total,
          nextCursor: skip + limit < total ? (skip + limit).toString() : null
        };
      } catch (error) {
        throw handleError('Failed to fetch posts by platform', 'FETCH_ERROR', 500);
      }
    }),

    myPosts: authMiddleware(async (parent, { filter, sort, limit = 10, skip = 0 }, { user }) => {
      try {
        let mongoFilter = { createdBy: user.id };
        
        // Apply filters
        if (filter) {
          if (filter.platform) mongoFilter.platform = filter.platform;
          if (filter.contentType) mongoFilter.contentType = filter.contentType;
          if (filter.status) mongoFilter.status = filter.status;
          // ... other filters
        }
        
        const total = await SocialContent.countDocuments(mongoFilter);
        const posts = await SocialContent.find(mongoFilter)
          .populate('createdBy', 'username email avatar isVerified')
          .sort(sort ? { [sort.field.toLowerCase()]: sort.order === 'DESC' ? -1 : 1 } : { createdAt: -1 })
          .limit(limit)
          .skip(skip);
        
        return {
          posts,
          total,
          hasMore: skip + limit < total,
          nextCursor: skip + limit < total ? (skip + limit).toString() : null
        };
      } catch (error) {
        throw handleError('Failed to fetch your posts', 'FETCH_ERROR', 500);
      }
    }),

    // ==============================
    // Analytics Queries
    // ==============================
    analyticsByContent: authMiddleware(async (parent, { contentId }) => {
      try {
        const snapshots = await SocialAnalytics.find({ contentId })
          .sort({ snapshotDate: -1 });
        return snapshots;
      } catch (error) {
        throw handleError('Failed to fetch content analytics', 'FETCH_ERROR', 500);
      }
    }),

    analyticsByPlatform: authMiddleware(async (parent, { platform, filter }) => {
      try {
        let mongoFilter = { platform };
        
        if (filter) {
          if (filter.analyticsType) mongoFilter.analyticsType = filter.analyticsType;
          if (filter.periodType) mongoFilter.periodType = filter.periodType;
          if (filter.contentId) mongoFilter.contentId = filter.contentId;
          if (filter.dateRange) {
            mongoFilter.snapshotDate = {};
            if (filter.dateRange.gte) mongoFilter.snapshotDate.$gte = new Date(filter.dateRange.gte);
            if (filter.dateRange.lte) mongoFilter.snapshotDate.$lte = new Date(filter.dateRange.lte);
          }
        }
        
        const snapshots = await SocialAnalytics.find(mongoFilter)
          .sort({ snapshotDate: -1 })
          .limit(100);
        
        // Calculate summary
        const summary = {
          totalReach: snapshots.reduce((sum, s) => sum + (s.normalizedMetrics?.reach || 0), 0),
          totalImpressions: snapshots.reduce((sum, s) => sum + (s.normalizedMetrics?.impressions || 0), 0),
          totalEngagement: snapshots.reduce((sum, s) => sum + (s.normalizedMetrics?.engagement || 0), 0),
          averageEngagementRate: 0,
          topPerformingPlatform: platform,
          topPerformingContentType: 'POST'
        };
        
        return {
          snapshots,
          total: snapshots.length,
          summary
        };
      } catch (error) {
        throw handleError('Failed to fetch platform analytics', 'FETCH_ERROR', 500);
      }
    }),

    // ==============================
    // Statistics Queries
    // ==============================
    userStats: authMiddleware(async (parent, { userId }, { user }) => {
      try {
        const targetUserId = userId || user.id;
        
        // Get user's posts
        const posts = await SocialContent.find({ createdBy: targetUserId });
        
        const stats = {
          totalPosts: posts.length,
          totalLikes: posts.reduce((sum, post) => sum + (post.metrics?.likes || 0), 0),
          totalViews: posts.reduce((sum, post) => sum + (post.metrics?.views || 0), 0),
          totalComments: posts.reduce((sum, post) => sum + (post.metrics?.comments || 0), 0),
          totalShares: posts.reduce((sum, post) => sum + (post.metrics?.shares || 0), 0),
          averageEngagementRate: 0,
          topPlatforms: [],
          growthRate: 0
        };
        
        // Calculate platform stats
        const platformStats = {};
        posts.forEach(post => {
          if (!platformStats[post.platform]) {
            platformStats[post.platform] = {
              platform: post.platform,
              postsCount: 0,
              totalLikes: 0,
              totalViews: 0,
              averageEngagement: 0
            };
          }
          platformStats[post.platform].postsCount++;
          platformStats[post.platform].totalLikes += post.metrics?.likes || 0;
          platformStats[post.platform].totalViews += post.metrics?.views || 0;
        });
        
        stats.topPlatforms = Object.values(platformStats);
        
        return stats;
      } catch (error) {
        throw handleError('Failed to fetch user statistics', 'FETCH_ERROR', 500);
      }
    }),

    platformStats: authMiddleware(async () => {
      try {
        const stats = await SocialContent.aggregate([
          {
            $group: {
              _id: '$platform',
              postsCount: { $sum: 1 },
              totalLikes: { $sum: '$metrics.likes' },
              totalViews: { $sum: '$metrics.views' },
              averageEngagement: { $avg: '$engagement.rate' }
            }
          },
          { $sort: { postsCount: -1 } }
        ]);
        
        return stats.map(stat => ({
          platform: stat._id,
          postsCount: stat.postsCount,
          totalLikes: stat.totalLikes || 0,
          totalViews: stat.totalViews || 0,
          averageEngagement: stat.averageEngagement || 0
        }));
      } catch (error) {
        throw handleError('Failed to fetch platform statistics', 'FETCH_ERROR', 500);
      }
    }),

    searchPosts: authMiddleware(async (parent, { query, filter, limit = 10, skip = 0 }) => {
      try {
        let mongoFilter = {
          $or: [
            { content: { $regex: query, $options: 'i' } },
            { author: { $regex: query, $options: 'i' } },
            { hashtags: { $in: [new RegExp(query, 'i')] } }
          ]
        };
        
        // Apply additional filters
        if (filter) {
          if (filter.platform) mongoFilter.platform = filter.platform;
          if (filter.contentType) mongoFilter.contentType = filter.contentType;
          // ... other filters
        }
        
        const total = await SocialContent.countDocuments(mongoFilter);
        const posts = await SocialContent.find(mongoFilter)
          .populate('createdBy', 'username email avatar isVerified')
          .sort({ createdAt: -1 })
          .limit(limit)
          .skip(skip);
        
        return {
          posts,
          total,
          hasMore: skip + limit < total,
          nextCursor: skip + limit < total ? (skip + limit).toString() : null
        };
      } catch (error) {
        throw handleError('Failed to search posts', 'FETCH_ERROR', 500);
      }
    })
  },

  Mutation: {
    // ==============================
    // Post Mutations
    // ==============================
    addPost: authMiddleware(async (parent, { input }, { user }) => {
      try {
        const foundUser = await User.findById(user.id);
        if (!foundUser) throw handleError('User not found', 'USER_NOT_FOUND', 404);
        
        const contentId = `post_${Date.now()}_${Math.random().toString(36).substring(7)}`;
        
        const newPost = new SocialContent({
          contentId,
          platform: input.platform,
          contentType: input.contentType,
          content: input.content,
          author: input.author || foundUser.username,
          hashtags: input.hashtags || [],
          mentions: input.mentions || [],
          location: input.location,
          status: 'PUBLISHED',
          visibility: input.visibility || 'PUBLIC',
          createdBy: foundUser._id,
          scheduledAt: input.scheduledAt ? new Date(input.scheduledAt) : null,
          metrics: {
            likes: 0,
            comments: 0,
            shares: 0,
            views: 0,
            saves: 0,
            clicks: 0
          },
          engagement: {
            rate: 0,
            score: 0
          }
        });
        
        const savedPost = await newPost.save();
        await savedPost.populate('createdBy', 'username email avatar isVerified');
        
        return savedPost;
      } catch (error) {
        console.error('Error creating post:', error);
        throw handleError('Failed to create post', 'CREATE_ERROR', 500);
      }
    }),

    updatePost: authMiddleware(async (parent, { id, input }, { user }) => {
      try {
        const post = await SocialContent.findById(id);
        if (!post) throw handleError('Post not found', 'POST_NOT_FOUND', 404);
        
        if (post.createdBy.toString() !== user.id) {
          throw handleError('Not authorized to update this post', 'FORBIDDEN', 403);
        }
        
        const updateData = { ...input, updatedAt: new Date() };
        if (input.scheduledAt) updateData.scheduledAt = new Date(input.scheduledAt);
        
        const updatedPost = await SocialContent.findByIdAndUpdate(
          id,
          updateData,
          { new: true, runValidators: true }
        ).populate('createdBy', 'username email avatar isVerified');
        
        return updatedPost;
      } catch (error) {
        throw handleError('Failed to update post', 'UPDATE_ERROR', 500);
      }
    }),

    deletePost: authMiddleware(async (parent, { id }, { user }) => {
      try {
        const post = await SocialContent.findById(id);
        if (!post) throw handleError('Post not found', 'POST_NOT_FOUND', 404);
        
        if (post.createdBy.toString() !== user.id) {
          throw handleError('Not authorized to delete this post', 'FORBIDDEN', 403);
        }
        
        await SocialContent.findByIdAndDelete(id);
        return true;
      } catch (error) {
        throw handleError('Failed to delete post', 'DELETE_ERROR', 500);
      }
    }),

    // ==============================
    // User Mutations
    // ==============================
    updateProfile: authMiddleware(async (parent, { input }, { user }) => {
      try {
        const updatedUser = await User.findByIdAndUpdate(
          user.id,
          input,
          { new: true, runValidators: true }
        ).select('-password');
        
        return updatedUser;
      } catch (error) {
        throw handleError('Failed to update profile', 'UPDATE_ERROR', 500);
      }
    }),

    // ==============================
    // Engagement Mutations
    // ==============================
    likePost: authMiddleware(async (parent, { postId }) => {
      try {
        const post = await SocialContent.findByIdAndUpdate(
          postId,
          { $inc: { 'metrics.likes': 1 } },
          { new: true }
        ).populate('createdBy', 'username email avatar isVerified');
        
        if (!post) throw handleError('Post not found', 'POST_NOT_FOUND', 404);
        return post;
      } catch (error) {
        throw handleError('Failed to like post', 'UPDATE_ERROR', 500);
      }
    }),

    sharePost: authMiddleware(async (parent, { postId }) => {
      try {
        const post = await SocialContent.findByIdAndUpdate(
          postId,
          { $inc: { 'metrics.shares': 1 } },
          { new: true }
        ).populate('createdBy', 'username email avatar isVerified');
        
        if (!post) throw handleError('Post not found', 'POST_NOT_FOUND', 404);
        return post;
      } catch (error) {
        throw handleError('Failed to share post', 'UPDATE_ERROR', 500);
      }
    })
  },

  // ==============================
  // Field Resolvers
  // ==============================
  User: {
    posts: async (parent, { limit = 10, skip = 0 }) => {
      try {
        const posts = await SocialContent.find({ createdBy: parent._id })
          .sort({ createdAt: -1 })
          .limit(limit)
          .skip(skip);
        return posts;
      } catch (error) {
        return [];
      }
    },

    analytics: async (parent) => {
      try {
        const userPosts = await SocialContent.find({ createdBy: parent._id });
        const contentIds = userPosts.map(post => post.contentId);
        const analytics = await SocialAnalytics.find({ contentId: { $in: contentIds } });
        return analytics;
      } catch (error) {
        return [];
      }
    }
  },

  SocialMediaPost: {
    analytics: async (parent) => {
      try {
        const analytics = await SocialAnalytics.find({ contentId: parent.contentId });
        return analytics;
      } catch (error) {
        return [];
      }
    }
  },

  AnalyticsSnapshot: {
    content: async (parent) => {
      try {
        const content = await SocialContent.findOne({ contentId: parent.contentId })
          .populate('createdBy', 'username email avatar isVerified');
        return content;
      } catch (error) {
        return null;
      }
    }
  }
};

module.exports = enhancedResolvers; 