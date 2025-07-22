const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const BaseSchema = require('./BaseSchema'); // Your existing base schema

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
  
  // Platform Account Details (from API responses)
  platformAccountId: {
    type: String,
    required: true,
    index: true
  },
  
  platformAccountName: String, // display name
  platformAccountHandle: String, // @username
  platformAccountUsername: String, // username without @
  platformAccountEmail: String,
  platformAccountProfilePicture: String,
  
  // OAuth Credentials (based on platform requirements)
  accessToken: {
    type: String,
    required: true,
    select: false // Security: don't include in queries by default
  },
  
  refreshToken: {
    type: String,
    select: false
  },
  
  tokenType: {
    type: String,
    enum: ['Bearer', 'OAuth', 'Page'], // Different token types per platform
    default: 'Bearer'
  },
  
  tokenExpiresAt: Date,
  
  // Platform-specific OAuth Scopes (from API research)
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
  status: {
    type: String,
    enum: ['ACTIVE', 'EXPIRED', 'REVOKED', 'ERROR', 'PENDING'],
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
  }
}, {
  timestamps: true,
  collection: 'socialConnections'
});

// Compound indexes for efficient queries
SocialConnectionSchema.index({ tenant: 1, platform: 1, platformAccountId: 1 }, { unique: true });
SocialConnectionSchema.index({ tenant: 1, isActive: 1, status: 1 });
SocialConnectionSchema.index({ tenant: 1, platform: 1, isDefault: 1 });

// ================================================================
// 2. SOCIAL MEDIA CONTENT (Based on actual API fields)
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
  
  // Content Type & Platform (from API research)
  contentType: {
    type: String,
    enum: [
      // Instagram types
      'IMAGE', 'VIDEO', 'CAROUSEL_ALBUM', 'STORY',
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
  
  // Content Data (based on API field requirements)
  caption: {
    type: String,
    maxLength: 3000 // LinkedIn max, others are less
  },
  
  title: String, // YouTube, TikTok, LinkedIn articles
  description: String, // YouTube, LinkedIn articles
  
  hashtags: [String], // Max 30 for Instagram, unlimited for others
  mentions: [String], // Max 20 for Instagram
  
  // Media Files (normalized across platforms)
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
    
    // Video specific (from API specs)
    duration: Number, // seconds
    
    // Dimensions (from API requirements)
    dimensions: {
      width: Number,
      height: Number
    },
    
    // File metadata (from API constraints)
    fileSize: Number, // bytes
    format: String, // JPEG, MP4, etc.
    
    order: { type: Number, default: 0 } // for carousel/album ordering
  }],
  
  // Publishing Information
  status: {
    type: String,
    enum: [
      'DRAFT', 'SCHEDULED', 'PROCESSING', 'PUBLISHING', 'PUBLISHED', 
      'FAILED', 'DELETED', 'EXPIRED', 'IN_PROGRESS', 'FINISHED'
    ],
    default: 'DRAFT',
    index: true
  },
  
  // Timestamps (from API responses)
  publishedAt: Date,
  scheduledAt: Date,
  createdAt: Date,
  updatedAt: Date,
  
  // Platform-specific IDs (from API responses)
  platformPostId: String, // ID returned after publishing
  platformUrl: String, // Public URL to the post
  platformShortcode: String, // Instagram shortcode
  platformPermalink: String, // Permanent link
  
  // Platform-specific Content Settings
  settings: {
    // Instagram/Facebook specific
    locationId: String,
    locationName: String,
    altText: String, // Instagram image alt text
    
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
    tags: [String],
    
    // General settings
    commentsEnabled: {
      type: Boolean,
      default: true
    }
  },
  
  // Engagement Metrics (from actual API field names)
  metrics: {
    lastUpdatedAt: Date,
    
    // Universal metrics (normalized field names)
    likes: { type: Number, default: 0 },
    comments: { type: Number, default: 0 },
    shares: { type: Number, default: 0 },
    views: { type: Number, default: 0 },
    
    // Platform-specific metrics (exact API field names)
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
      displayName: String,
      bioDescription: String,
      isVerified: Boolean
    },
    
    // Calculated engagement metrics
    engagementRate: { type: Number, default: 0 },
    engagementCount: { type: Number, default: 0 } // total of likes + comments + shares
  },
  
  // Error handling and retry logic
  publishError: String,
  retryCount: { type: Number, default: 0 },
  maxRetries: { type: Number, default: 3 },
  nextRetryAt: Date,
  
  // Content approval workflow (for team management)
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
  parentContentId: String, // for tracking versions
  
  // Content organization  
  tags: [String], // internal organization tags
  notes: String, // internal notes
  
  // Performance tracking
  isPerformanceTracked: { type: Boolean, default: true },
  lastMetricsSync: Date
  
}, {
  timestamps: true,
  collection: 'socialContent'
});

// Optimized indexes for common queries
SocialContentSchema.index({ tenant: 1, status: 1, scheduledAt: 1 });
SocialContentSchema.index({ tenant: 1, platform: 1, contentType: 1 });
SocialContentSchema.index({ tenant: 1, publishedAt: -1 });
SocialContentSchema.index({ connection: 1, status: 1 });
SocialContentSchema.index({ tenant: 1, createdAt: -1 });
SocialContentSchema.index({ platformPostId: 1, platform: 1 });

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
  
  // Raw metrics data (flexible structure for platform differences)
  metrics: {
    type: mongoose.Schema.Types.Mixed,
    required: true
  },
  
  // Normalized metrics (standardized across platforms)
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
  apiResponseTime: Number, // milliseconds
  apiRateLimit: {
    remaining: Number,
    resetTime: Date
  }
  
}, {
  timestamps: true,
  collection: 'socialAnalytics'
});

// Indexes for time-series analytics queries
SocialAnalyticsSchema.index({ tenant: 1, analyticsType: 1, snapshotDate: -1 });
SocialAnalyticsSchema.index({ contentId: 1, snapshotDate: -1 });
SocialAnalyticsSchema.index({ connectionId: 1, platform: 1, snapshotDate: -1 });
SocialAnalyticsSchema.index({ tenant: 1, platform: 1, periodType: 1, periodStart: 1 });

// ================================================================
// 4. SOCIAL CONTENT TEMPLATES (Reusable content patterns)
// ================================================================
const SocialTemplateSchema = new Schema({
  ...BaseSchema.obj,
  
  // Template Information
  name: {
    type: String,
    required: true,
    trim: true,
    maxLength: 100
  },
  
  description: {
    type: String,
    maxLength: 500
  },
  
  // Template Category
  category: {
    type: String,
    enum: ['PRODUCT_SHOWCASE', 'PROMOTIONAL', 'ENGAGEMENT', 'STORY', 'ANNOUNCEMENT', 'EDUCATIONAL', 'CUSTOM'],
    default: 'CUSTOM'
  },
  
  // Target Platforms (based on content type compatibility)
  platforms: [{
    type: String,
    enum: ['INSTAGRAM', 'FACEBOOK', 'TWITTER', 'LINKEDIN', 'TIKTOK', 'YOUTUBE']
  }],
  
  // Template Content Structure
  contentTemplate: {
    captionTemplate: String, // Can include placeholders like {{productName}}
    titleTemplate: String, // For YouTube, TikTok
    descriptionTemplate: String, // For YouTube, LinkedIn articles
    
    // Predefined hashtags and mentions
    defaultHashtags: [String],
    suggestedMentions: [String],
    
    // Platform-specific settings templates
    defaultSettings: {
      commentsEnabled: Boolean,
      privacyLevel: String,
      categoryId: String
    }
  },
  
  // Media Requirements (based on platform constraints)
  mediaRequirements: [{
    mediaType: {
      type: String,
      enum: ['IMAGE', 'VIDEO', 'DOCUMENT'],
      required: true
    },
    
    // Platform-specific constraints (from API research)
    constraints: {
      maxFileSize: Number, // bytes
      allowedFormats: [String], // ['JPEG', 'PNG', 'MP4', etc.]
      aspectRatio: String, // '1:1', '4:5', '16:9', etc.
      minDimensions: {
        width: Number,
        height: Number
      },
      maxDimensions: {
        width: Number,
        height: Number
      },
      maxDuration: Number // seconds for videos
    },
    
    isRequired: { type: Boolean, default: true },
    placeholder: String,
    order: Number
  }],
  
  // Template Variables (for dynamic content)
  variables: [{
    name: {
      type: String,
      required: true
    },
    type: {
      type: String,
      enum: ['TEXT', 'NUMBER', 'DATE', 'URL', 'BOOLEAN', 'SELECT'],
      required: true
    },
    isRequired: { type: Boolean, default: false },
    defaultValue: String,
    description: String,
    
    // For SELECT type variables
    options: [String],
    
    // Validation rules
    validation: {
      minLength: Number,
      maxLength: Number,
      pattern: String, // regex pattern
      min: Number, // for numbers
      max: Number // for numbers
    }
  }],
  
  // Usage tracking and analytics
  usageCount: { type: Number, default: 0 },
  lastUsedAt: Date,
  
  // Performance tracking
  averageEngagementRate: Number,
  successfulPosts: { type: Number, default: 0 },
  
  // Template Status
  isActive: {
    type: Boolean,
    default: true,
    index: true
  },
  
  // Sharing and permissions
  isPublic: {
    type: Boolean,
    default: false
  },
  
  sharedWith: [{
    userId: {
      type: Schema.Types.ObjectId,
      ref: 'User'
    },
    permission: {
      type: String,
      enum: ['VIEW', 'USE', 'EDIT'],
      default: 'USE'
    }
  }],
  
  createdBy: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  
  // Template versioning
  version: { type: Number, default: 1 },
  parentTemplateId: {
    type: Schema.Types.ObjectId,
    ref: 'SocialTemplate'
  }
  
}, {
  timestamps: true,
  collection: 'socialTemplates'
});

// Template indexes
SocialTemplateSchema.index({ tenant: 1, isActive: 1, category: 1 });
SocialTemplateSchema.index({ tenant: 1, platforms: 1 });
SocialTemplateSchema.index({ createdBy: 1, isActive: 1 });
SocialTemplateSchema.index({ isPublic: 1, isActive: 1 });

// ================================================================
// MODEL EXPORTS
// ================================================================
const SocialConnection = mongoose.model('SocialConnection', SocialConnectionSchema);
const SocialContent = mongoose.model('SocialContent', SocialContentSchema);
const SocialAnalytics = mongoose.model('SocialAnalytics', SocialAnalyticsSchema);
const SocialTemplate = mongoose.model('SocialTemplate', SocialTemplateSchema);

module.exports = {
  SocialConnection,
  SocialContent,
  SocialAnalytics,
  SocialTemplate
};