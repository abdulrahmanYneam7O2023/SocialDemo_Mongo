const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const BaseSchema = require('./BaseSchema');

// ================================================================
// 1. SOCIAL PLATFORM CONNECTIONS (OAuth & Authentication)
// ================================================================
const SocialConnectionSchema = new Schema({
  ...BaseSchema.obj,
  
  // Platform Information
  platform: {
    type: String,
    enum: ['INSTAGRAM', 'FACEBOOK', 'TWITTER', 'LINKEDIN', 'TIKTOK', 'YOUTUBE'],
    required: true,
    index: true
  },
  
  // Platform Account Details
  platformAccountId: {
    type: String,
    required: false, // Made optional for easier testing
    index: true
  },
  
  platformAccountName: String,
  platformAccountHandle: String,
  platformAccountUsername: String,
  platformAccountEmail: String,
  platformAccountProfilePicture: String,
  
  // OAuth Credentials (secure)
  accessToken: {
    type: String,
    required: false, // Made optional for easier testing
    select: false // Security: don't include in queries by default
  },
  
  refreshToken: {
    type: String,
    select: false
  },
  
  tokenType: {
    type: String,
    enum: ['Bearer', 'OAuth', 'Page'],
    default: 'Bearer'
  },
  
  tokenExpiresAt: Date,
  
  // Platform-specific OAuth Scopes
  grantedScopes: [{
    type: String,
    enum: [
      // Instagram scopes
      'instagram_basic', 'instagram_content_publish', 'instagram_manage_insights', 
      'instagram_manage_comments', 'pages_read_engagement', 'pages_show_list',
      // Facebook scopes  
      'pages_manage_posts', 'pages_read_engagement', 'manage_pages', 'publish_pages',
      // Twitter scopes
      'tweet.read', 'tweet.write', 'users.read', 'follows.read', 'offline.access',
      // LinkedIn scopes
      'w_member_social', 'w_organization_social', 'r_organization_social',
      // TikTok scopes
      'user.info.basic', 'video.publish', 'video.upload', 'video.list',
      // YouTube scopes  
      'youtube.upload', 'youtube.readonly', 'youtube'
    ]
  }],
  
  // Connection Status & Health
  connectionStatus: {
    type: String,
    enum: ['ACTIVE', 'INACTIVE', 'EXPIRED', 'REVOKED', 'ERROR', 'PENDING'],
    default: 'ACTIVE',
    index: true
  },
  
  // Platform-specific metadata and limits
  platformMetadata: {
    // Instagram/Facebook specific
    pageId: String,
    businessAccountId: String,
    adAccountId: String,
    
    // Twitter specific  
    userId: String,
    username: String,
    
    // LinkedIn specific
    personUrn: String,
    organizationUrn: String,
    
    // TikTok specific
    openId: String,
    unionId: String,
    
    // YouTube specific
    channelId: String,
    channelTitle: String,
    
    // Rate limiting info
    dailyPostLimit: Number,
    monthlyPostLimit: Number,
    currentDailyPosts: { type: Number, default: 0 },
    currentMonthlyPosts: { type: Number, default: 0 },
    lastResetDaily: Date,
    lastResetMonthly: Date
  },
  
  // Connection health tracking
  lastValidatedAt: Date,
  lastUsedAt: Date,
  lastErrorAt: Date,
  lastError: String,
  validationRetryCount: { type: Number, default: 0 },
  
  // Usage preferences
  isDefault: {
    type: Boolean,
    default: false
  },
  
  isActive: {
    type: Boolean,
    default: true,
    index: true
  },
  
  // User Information (Reference to User model)
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: false,
    index: true
  },
  
  // User details (denormalized for performance)
  userInfo: {
    email: { type: String },
    name: { type: String },
    role: { type: String },
    isActive: { type: Boolean }
  }
}, {
  timestamps: true,
  collection: 'socialConnections'
});

// ================================================================
// 2. ENHANCED SOCIAL MEDIA CONTENT 
// ================================================================
const SocialContentSchema = new Schema({
  ...BaseSchema.obj,
  
  // Content Identification
  contentId: {
    type: String,
    required: true,
    unique: true,
    index: true
  },
  
  // Content Type & Platform
  contentType: {
    type: String,
    enum: [
      // Instagram types
      'IMAGE', 'VIDEO', 'CAROUSEL_ALBUM', 'STORY', 'REEL',
      // Facebook types  
      'POST', 'PHOTO', 'VIDEO', 'ALBUM', 'EVENT', 'LINK',
      // Twitter types
      'TWEET', 'REPLY', 'RETWEET', 'QUOTE_TWEET', 'THREAD',
      // LinkedIn types
      'TEXT_POST', 'SINGLE_MEDIA_POST', 'ARTICLE_POST', 'MULTI_IMAGE_POST', 'POLL_POST', 'DOCUMENT_POST',
      // TikTok types
      'VIDEO_POST', 'PHOTO_POST',
      // YouTube types
      'VIDEO', 'SHORT', 'LIVE_STREAM'
    ],
    required: true,
    index: true
  },
  
  platform: {
    type: String,
    enum: ['INSTAGRAM', 'FACEBOOK', 'TWITTER', 'LINKEDIN', 'TIKTOK', 'YOUTUBE'],
    required: true,
    index: true
  },
  
  // Connection Reference
  connection: {
    type: Schema.Types.ObjectId,
    ref: 'SocialConnection',
    required: true,
    index: true
  },
  
  // Content Data
  content: {
    type: String,
    maxLength: 3000 // LinkedIn max
  },
  
  title: String, // YouTube, TikTok, LinkedIn articles
  description: String, // YouTube, LinkedIn articles
  
  hashtags: [String],
  mentions: [String],
  
  // Media Files
  mediaFiles: [{
    fileId: {
      type: Schema.Types.ObjectId,
      ref: 'File'
    },
    mediaType: {
      type: String,
      enum: ['IMAGE', 'VIDEO', 'DOCUMENT', 'GIF']
    },
    url: String,
    thumbnailUrl: String,
    duration: Number, // seconds for video
    dimensions: {
      width: Number,
      height: Number
    },
    fileSize: Number, // bytes
    format: String, // JPEG, MP4, etc.
    order: { type: Number, default: 0 }
  }],
  
  // Publishing Information
  publishStatus: {
    type: String,
    enum: [
      'DRAFT', 'SCHEDULED', 'PROCESSING', 'PUBLISHING', 'PUBLISHED', 
      'FAILED', 'DELETED', 'EXPIRED', 'IN_PROGRESS', 'FINISHED'
    ],
    default: 'DRAFT',
    index: true
  },
  
  // Timestamps
  publishedAt: Date,
  scheduledAt: Date,
  
  // Platform-specific IDs
  platformPostId: String,
  platformUrl: String,
  platformShortcode: String,
  platformPermalink: String,
  
  // Platform-specific Content Settings
  settings: {
    // Location
    locationId: String,
    locationName: String,
    altText: String,
    
    // Facebook specific
    link: String,
    linkName: String,
    linkCaption: String,
    linkDescription: String,
    
    // Twitter specific
    isThread: Boolean,
    threadOrder: Number,
    parentTweetId: String,
    conversationId: String,
    replySettings: {
      type: String,
      enum: ['everyone', 'mentioned_users', 'followers']
    },
    
    // LinkedIn specific
    visibility: {
      type: String,
      enum: ['PUBLIC', 'CONNECTIONS', 'LOGGED_IN_MEMBERS'],
      default: 'PUBLIC'
    },
    
    // TikTok specific
    privacyLevel: {
      type: String,
      enum: ['PUBLIC_TO_EVERYONE', 'MUTUAL_FOLLOW_FRIENDS', 'SELF_ONLY'],
      default: 'PUBLIC_TO_EVERYONE'
    },
    disableDuet: Boolean,
    disableComment: Boolean,
    disableStitch: Boolean,
    
    // YouTube specific
    privacyStatus: {
      type: String,
      enum: ['public', 'private', 'unlisted'],
      default: 'public'
    },
    categoryId: String,
    defaultLanguage: String,
    videoTags: [String],
    
    // General settings
    commentsEnabled: {
      type: Boolean,
      default: true
    }
  },
  
  // Enhanced Engagement Metrics
  metrics: {
    lastUpdatedAt: Date,
    
    // Universal metrics
    likes: { type: Number, default: 0 },
    comments: { type: Number, default: 0 },
    shares: { type: Number, default: 0 },
    views: { type: Number, default: 0 },
    
    // Platform-specific metrics
    platformSpecific: {
      // Instagram metrics
      reach: Number,
      impressions: Number,
      saves: Number,
      totalInteractions: Number,
      
      // Facebook metrics  
      reactionCount: Number,
      loveCount: Number,
      hahaCount: Number,
      wowCount: Number,
      sadCount: Number,
      angryCount: Number,
      
      // Twitter metrics
      retweetCount: Number,
      replyCount: Number,
      likeCount: Number,
      quoteCount: Number,
      bookmarkCount: Number,
      impressionCount: Number,
      
      // LinkedIn metrics
      clickCount: Number,
      commentMentionsCount: Number,
      shareMentionsCount: Number,
      followCount: Number,
      
      // YouTube metrics
      subscriberCount: Number,
      estimatedMinutesWatched: Number,
      averageViewDuration: Number,
      subscribersGained: Number,
      
      // TikTok metrics
      profileViews: Number,
      isVerified: Boolean
    },
    
    // Calculated engagement metrics
    engagementRate: { type: Number, default: 0 },
    engagementCount: { type: Number, default: 0 }
  },
  
  // Error handling and retry logic
  publishError: String,
  retryCount: { type: Number, default: 0 },
  maxRetries: { type: Number, default: 3 },
  nextRetryAt: Date,
  
  // Content approval workflow
  approvalStatus: {
    type: String,
    enum: ['PENDING', 'APPROVED', 'REJECTED', 'NOT_REQUIRED'],
    default: 'NOT_REQUIRED'
  },
  
  approvedBy: {
    type: Schema.Types.ObjectId,
    ref: 'User'
  },
  
  approvedAt: Date,
  rejectionReason: String,
  
  // Versioning for drafts and edits
  version: { type: Number, default: 1 },
  isLatestVersion: { type: Boolean, default: true },
  parentContentId: String,
  
  // Performance tracking
  isPerformanceTracked: { type: Boolean, default: true },
  lastMetricsSync: Date,
  
  // Author information
  author: String
  
}, {
  timestamps: true,
  collection: 'socialContent'
});

// ================================================================
// 3. SOCIAL ANALYTICS SNAPSHOTS (Time-series data)
// ================================================================
const SocialAnalyticsSchema = new Schema({
  ...BaseSchema.obj,
  
  // Reference to content or account
  contentId: {
    type: Schema.Types.ObjectId,
    ref: 'SocialContent'
  },
  
  connectionId: {
    type: Schema.Types.ObjectId,
    ref: 'SocialConnection',
    required: true
  },
  
  // Analytics Type
  analyticsType: {
    type: String,
    enum: ['CONTENT_METRICS', 'ACCOUNT_INSIGHTS', 'AUDIENCE_DEMOGRAPHICS', 'PERFORMANCE_SUMMARY'],
    required: true,
    index: true
  },
  
  // Time period for the snapshot
  periodType: {
    type: String,
    enum: ['DAILY', 'WEEKLY', 'MONTHLY', 'CUSTOM'],
    default: 'DAILY'
  },
  
  periodStart: Date,
  periodEnd: Date,
  
  // Platform
  platform: {
    type: String,
    enum: ['INSTAGRAM', 'FACEBOOK', 'TWITTER', 'LINKEDIN', 'TIKTOK', 'YOUTUBE'],
    required: true
  },
  
  // Raw metrics data
  metrics: {
    type: mongoose.Schema.Types.Mixed,
    required: true
  },
  
  // Normalized metrics
  normalizedMetrics: {
    reach: Number,
    impressions: Number,
    engagement: Number,
    clicks: Number,
    shares: Number,
    saves: Number,
    comments: Number,
    likes: Number,
    followers: Number,
    following: Number,
    posts: Number
  },
  
  // Snapshot metadata
  snapshotDate: {
    type: Date,
    default: Date.now,
    index: true
  },
  
  // Data source and quality
  dataSource: {
    type: String,
    enum: ['API', 'MANUAL', 'IMPORTED', 'CALCULATED'],
    default: 'API'
  },
  
  dataQuality: {
    type: String,
    enum: ['HIGH', 'MEDIUM', 'LOW', 'ESTIMATED'],
    default: 'HIGH'
  },
  
  // API response metadata
  apiResponseTime: Number,
  apiRateLimit: {
    remaining: Number,
    resetTime: Date
  }
  
}, {
  timestamps: true,
  collection: 'socialAnalytics'
});

// ================================================================
// OPTIMIZED INDEXES
// ================================================================

// SocialConnection indexes
// Index removed to allow multiple connections with null platformAccountId
// SocialConnectionSchema.index({ tenant: 1, platform: 1, platformAccountId: 1 }, { unique: true });
SocialConnectionSchema.index({ tenant: 1, isActive: 1, connectionStatus: 1 });
SocialConnectionSchema.index({ tenant: 1, platform: 1, isDefault: 1 });

// SocialContent indexes
SocialContentSchema.index({ tenant: 1, publishStatus: 1, scheduledAt: 1 });
SocialContentSchema.index({ tenant: 1, platform: 1, contentType: 1 });
SocialContentSchema.index({ tenant: 1, publishedAt: -1 });
SocialContentSchema.index({ connection: 1, publishStatus: 1 });
SocialContentSchema.index({ tenant: 1, createdAt: -1 });
SocialContentSchema.index({ platformPostId: 1, platform: 1 });
// contentId index already defined in schema field with unique: true

// SocialAnalytics indexes
SocialAnalyticsSchema.index({ tenant: 1, analyticsType: 1, snapshotDate: -1 });
SocialAnalyticsSchema.index({ contentId: 1, snapshotDate: -1 });
SocialAnalyticsSchema.index({ connectionId: 1, platform: 1, snapshotDate: -1 });
SocialAnalyticsSchema.index({ tenant: 1, platform: 1, periodType: 1, periodStart: 1 });

// ================================================================
// MODEL EXPORTS
// ================================================================
// استخدام الطريقة الآمنة لتجنب إعادة تعريف النماذج
const SocialConnection = mongoose.models.SocialConnection || mongoose.model('SocialConnection', SocialConnectionSchema);
const SocialContent = mongoose.models.SocialContent || mongoose.model('SocialContent', SocialContentSchema);
const SocialAnalytics = mongoose.models.SocialAnalytics || mongoose.model('SocialAnalytics', SocialAnalyticsSchema);

module.exports = {
  SocialConnection,
  SocialContent,
  SocialAnalytics
}; 