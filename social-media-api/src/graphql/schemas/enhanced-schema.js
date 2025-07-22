const enhancedTypeDefs = `#graphql
  # ==============================
  # User Types & Relations
  # ==============================
  
  type User {
    id: ID!
    username: String!
    email: String!
    bio: String
    avatar: String
    isVerified: Boolean!
    followersCount: Int!
    followingCount: Int!
    postsCount: Int!
    location: String
    website: String
    joinedDate: String!
    createdAt: String!
    
    # Relations
    posts(limit: Int, skip: Int): [SocialMediaPost!]!
    analytics: [AnalyticsSnapshot!]!
  }
  
  input UserUpdateInput {
    bio: String
    avatar: String
    location: String
    website: String
  }
  
  # ==============================
  # Social Media Post Types
  # ==============================
  
  type SocialMediaPost {
    id: ID!
    contentId: String!
    platform: Platform!
    contentType: ContentType!
    content: String
    author: String!
    hashtags: [String!]!
    mentions: [String!]!
    location: String
    language: String!
    status: PostStatus!
    visibility: PostVisibility!
    
    # Metrics
    metrics: PostMetrics!
    engagement: PostEngagement!
    
    # Relations
    createdBy: User!
    analytics: [AnalyticsSnapshot!]!
    
    # Timestamps
    scheduledAt: String
    publishedAt: String!
    createdAt: String!
    updatedAt: String!
  }
  
  type PostMetrics {
    likes: Int!
    comments: Int!
    shares: Int!
    views: Int!
    saves: Int!
    clicks: Int!
  }
  
  type PostEngagement {
    rate: Float!
    score: Float!
  }
  
  # ==============================
  # Enums
  # ==============================
  
  enum Platform {
    INSTAGRAM
    TWITTER
    FACEBOOK
    TIKTOK
    LINKEDIN
    YOUTUBE
    SNAPCHAT
  }
  
  enum ContentType {
    POST
    STORY
    REEL
    VIDEO
    TWEET
    ARTICLE
    PHOTO
  }
  
  enum PostStatus {
    DRAFT
    SCHEDULED
    PUBLISHED
    ARCHIVED
    DELETED
  }
  
  enum PostVisibility {
    PUBLIC
    PRIVATE
    FOLLOWERS_ONLY
    UNLISTED
  }
  
  enum SortOrder {
    ASC
    DESC
  }
  
  enum AnalyticsType {
    CONTENT_PERFORMANCE
    AUDIENCE_INSIGHTS
    ENGAGEMENT_METRICS
    REACH_ANALYSIS
  }
  
  enum PeriodType {
    DAILY
    WEEKLY
    MONTHLY
    QUARTERLY
    YEARLY
  }
  
  # ==============================
  # Input Types
  # ==============================
  
  input PostInput {
    platform: Platform!
    contentType: ContentType!
    content: String!
    author: String
    hashtags: [String!]
    mentions: [String!]
    location: String
    scheduledAt: String
    visibility: PostVisibility
  }
  
  input PostUpdateInput {
    platform: Platform
    contentType: ContentType
    content: String
    author: String
    hashtags: [String!]
    mentions: [String!]
    location: String
    status: PostStatus
    visibility: PostVisibility
    scheduledAt: String
  }
  
  input PostFilterInput {
    platform: Platform
    contentType: ContentType
    author: String
    status: PostStatus
    visibility: PostVisibility
    createdAt: DateRangeFilter
    publishedAt: DateRangeFilter
    likes: IntRangeFilter
    views: IntRangeFilter
    hashtags: [String!]
    location: String
    language: String
  }
  
  input DateRangeFilter {
    gte: String
    lte: String
    eq: String
  }
  
  input IntRangeFilter {
    gte: Int
    lte: Int
    eq: Int
  }
  
  input PostSortInput {
    field: PostSortField!
    order: SortOrder!
  }
  
  enum PostSortField {
    CREATED_AT
    PUBLISHED_AT
    LIKES
    COMMENTS
    SHARES
    VIEWS
    ENGAGEMENT_RATE
    ENGAGEMENT_SCORE
  }
  
  # ==============================
  # Analytics Types
  # ==============================
  
  type AnalyticsSnapshot {
    id: ID!
    contentId: String!
    connectionId: String
    analyticsType: AnalyticsType!
    platform: Platform!
    periodType: PeriodType!
    periodStart: String
    periodEnd: String
    
    # Metrics
    metrics: AnalyticsMetrics!
    demographics: AnalyticsDemographics
    
    # Relations
    content: SocialMediaPost
    
    # Timestamps
    snapshotDate: String!
  }
  
  type AnalyticsMetrics {
    reach: Int!
    impressions: Int!
    engagement: Int!
    clicks: Int!
    likes: Int!
    comments: Int!
    shares: Int!
    saves: Int!
    profileVisits: Int!
    websiteClicks: Int!
  }
  
  type AnalyticsDemographics {
    ageGroups: [AgeGroup!]!
    genders: [GenderBreakdown!]!
    locations: [LocationBreakdown!]!
  }
  
  type AgeGroup {
    range: String!
    percentage: Float!
  }
  
  type GenderBreakdown {
    type: String!
    percentage: Float!
  }
  
  type LocationBreakdown {
    country: String!
    percentage: Float!
  }
  
  input AnalyticsFilterInput {
    platform: Platform
    analyticsType: AnalyticsType
    periodType: PeriodType
    dateRange: DateRangeFilter
    contentId: String
  }
  
  # ==============================
  # Response Types for Frontend
  # ==============================
  
  type PostsResponse {
    posts: [SocialMediaPost!]!
    total: Int!
    hasMore: Boolean!
    nextCursor: String
  }
  
  type AnalyticsResponse {
    snapshots: [AnalyticsSnapshot!]!
    total: Int!
    summary: AnalyticsSummary!
  }
  
  type AnalyticsSummary {
    totalReach: Int!
    totalImpressions: Int!
    totalEngagement: Int!
    averageEngagementRate: Float!
    topPerformingPlatform: Platform
    topPerformingContentType: ContentType
  }
  
  type PlatformStats {
    platform: Platform!
    postsCount: Int!
    totalLikes: Int!
    totalViews: Int!
    averageEngagement: Float!
  }
  
  type UserStats {
    totalPosts: Int!
    totalLikes: Int!
    totalViews: Int!
    totalComments: Int!
    totalShares: Int!
    averageEngagementRate: Float!
    topPlatforms: [PlatformStats!]!
    growthRate: Float!
  }
  
  # ==============================
  # Queries
  # ==============================
  
  type Query {
    # User Queries
    me: User
    user(id: ID!): User
    users(limit: Int, skip: Int): [User!]!
    
    # Post Queries
    allPosts(
      filter: PostFilterInput
      sort: PostSortInput
      limit: Int = 10
      skip: Int = 0
    ): PostsResponse!
    
    post(id: ID!): SocialMediaPost
    
    postsByPlatform(
      platform: Platform!
      filter: PostFilterInput
      sort: PostSortInput
      limit: Int = 10
      skip: Int = 0
    ): PostsResponse!
    
    postsByContentType(
      contentType: ContentType!
      filter: PostFilterInput
      sort: PostSortInput
      limit: Int = 10
      skip: Int = 0
    ): PostsResponse!
    
    myPosts(
      filter: PostFilterInput
      sort: PostSortInput
      limit: Int = 10
      skip: Int = 0
    ): PostsResponse!
    
    # Analytics Queries
    analyticsByContent(contentId: String!): [AnalyticsSnapshot!]!
    
    analyticsByPlatform(
      platform: Platform!
      filter: AnalyticsFilterInput
    ): AnalyticsResponse!
    
    analyticsOverview(
      filter: AnalyticsFilterInput
    ): AnalyticsSummary!
    
    myAnalytics(
      filter: AnalyticsFilterInput
    ): AnalyticsResponse!
    
    # Statistics Queries
    userStats(userId: ID): UserStats!
    platformStats: [PlatformStats!]!
    contentTypeStats: [ContentTypeStats!]!
    
    # Search Queries
    searchPosts(
      query: String!
      filter: PostFilterInput
      limit: Int = 10
      skip: Int = 0
    ): PostsResponse!
  }
  
  type ContentTypeStats {
    contentType: ContentType!
    postsCount: Int!
    totalEngagement: Int!
    averageEngagementRate: Float!
  }
  
  # ==============================
  # Mutations
  # ==============================
  
  type Mutation {
    # Post Mutations
    addPost(input: PostInput!): SocialMediaPost!
    updatePost(id: ID!, input: PostUpdateInput!): SocialMediaPost!
    deletePost(id: ID!): Boolean!
    
    # User Mutations
    updateProfile(input: UserUpdateInput!): User!
    
    # Engagement Mutations
    likePost(postId: ID!): SocialMediaPost!
    unlikePost(postId: ID!): SocialMediaPost!
    sharePost(postId: ID!): SocialMediaPost!
    savePost(postId: ID!): SocialMediaPost!
    
    # Bulk Operations
    bulkDeletePosts(ids: [ID!]!): Boolean!
    bulkUpdatePostsStatus(ids: [ID!]!, status: PostStatus!): [SocialMediaPost!]!
  }
  
  # ==============================
  # Subscriptions (for real-time updates)
  # ==============================
  
  type Subscription {
    postAdded: SocialMediaPost!
    postUpdated: SocialMediaPost!
    postDeleted: ID!
    
    analyticsUpdated(contentId: String!): AnalyticsSnapshot!
    
    userStatsUpdated: UserStats!
  }
`;

module.exports = enhancedTypeDefs; 