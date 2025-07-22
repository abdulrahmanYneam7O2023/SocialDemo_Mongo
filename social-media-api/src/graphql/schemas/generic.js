const genericTypeDefs = `#graphql

# ================================================================
# GENERIC QUERY & MUTATION SCHEMAS
# ================================================================

# Filter Input للاستعلامات الموحدة
input FilterInput {
  field: String!
  operator: FilterOperator!
  value: String!
}

# مشغلات الفلترة المتاحة
enum FilterOperator {
  eq       # يساوي
  ne       # لا يساوي  
  in       # ضمن القائمة
  nin      # ليس ضمن القائمة
  gt       # أكبر من
  gte      # أكبر من أو يساوي
  lt       # أصغر من
  lte      # أصغر من أو يساوي
  regex    # تطابق النمط
  exists   # الحقل موجود
}

# Sort Input للترتيب
input SortInput {
  field: String!
  direction: SortDirection!
}

enum SortDirection {
  asc
  desc
}

# Pagination Input للتصفح
input PaginationInput {
  type: PaginationType!
  limit: Int = 20
  offset: Int = 0
  page: Int = 1
  after: String
}

enum PaginationType {
  offset
  page
  cursor
}

# معلومات التصفح في النتائج
type PageInfo {
  hasNextPage: Boolean!
  hasPreviousPage: Boolean!
  totalPages: Int!
  currentPage: Int!
  totalCount: Int!
}

# نتيجة الاستعلام الموحد
type GenericQueryResult {
  data: String!          # JSON string للبيانات
  totalCount: Int!
  pageInfo: PageInfo!
  success: Boolean!
}

# نتيجة العملية الموحدة
type GenericMutationResult {
  success: Boolean!
  data: String          # JSON string للبيانات
  message: String
}

# ================================================================
# SOCIAL MEDIA SPECIFIC INPUTS & TYPES
# ================================================================

# Content Type للسوشيال ميديا
enum SocialContentType {
  # Instagram types
  IMAGE
  VIDEO  
  CAROUSEL_ALBUM
  STORY
  REEL
  
  # Facebook types
  POST
  PHOTO
  ALBUM
  EVENT
  LINK
  
  # Twitter types
  TWEET
  REPLY
  RETWEET
  QUOTE_TWEET
  THREAD
  
  # LinkedIn types
  TEXT_POST
  SINGLE_MEDIA_POST
  ARTICLE_POST
  MULTI_IMAGE_POST
  POLL_POST
  DOCUMENT_POST
  
  # TikTok types
  VIDEO_POST
  PHOTO_POST
  
  # YouTube types
  SHORT
  LIVE_STREAM
}

# Platform Types
enum SocialPlatform {
  INSTAGRAM
  FACEBOOK
  TWITTER
  LINKEDIN
  TIKTOK
  YOUTUBE
}

# Status Types
enum PublishStatus {
  DRAFT
  SCHEDULED
  PROCESSING
  PUBLISHING
  PUBLISHED
  FAILED
  DELETED
  EXPIRED
  IN_PROGRESS
  FINISHED
}

# Media File Input
input MediaFileInput {
  mediaType: MediaType!
  url: String!
  thumbnailUrl: String
  duration: Int          # للفيديو بالثواني
  dimensions: DimensionsInput
  fileSize: Int         # بالبايت
  format: String        # JPEG, MP4, etc.
  order: Int = 0
}

input DimensionsInput {
  width: Int!
  height: Int!
}

enum MediaType {
  IMAGE
  VIDEO
  DOCUMENT
  GIF
}

# Content Settings Input
input ContentSettingsInput {
  # Location
  locationId: String
  locationName: String
  altText: String
  
  # Facebook specific
  link: String
  linkName: String
  linkCaption: String
  linkDescription: String
  
  # Twitter specific
  isThread: Boolean
  threadOrder: Int
  parentTweetId: String
  conversationId: String
  replySettings: ReplySettings
  
  # LinkedIn specific
  visibility: LinkedInVisibility
  
  # TikTok specific
  privacyLevel: TikTokPrivacyLevel
  disableDuet: Boolean
  disableComment: Boolean
  disableStitch: Boolean
  
  # YouTube specific
  privacyStatus: YouTubePrivacyStatus
  categoryId: String
  defaultLanguage: String
  videoTags: [String!]
  
  # General settings
  commentsEnabled: Boolean = true
}

enum ReplySettings {
  everyone
  mentioned_users
  followers
}

enum LinkedInVisibility {
  PUBLIC
  CONNECTIONS
  LOGGED_IN_MEMBERS
}

enum TikTokPrivacyLevel {
  PUBLIC_TO_EVERYONE
  MUTUAL_FOLLOW_FRIENDS
  SELF_ONLY
}

enum YouTubePrivacyStatus {
  public
  private
  unlisted
}

# Social Content Input للإنشاء
input SocialContentInput {
  platform: SocialPlatform!
  contentType: SocialContentType!
  connection: ID!
  
  # Content data
  content: String
  title: String
  description: String
  hashtags: [String!]
  mentions: [String!]
  author: String
  
  # Media files
  mediaFiles: [MediaFileInput!]
  
  # Publishing info
  publishStatus: PublishStatus = DRAFT
  scheduledAt: String
  
  # Settings
  settings: ContentSettingsInput
}

# Metrics Input لتحديث الإحصائيات
input MetricsInput {
  likes: Int = 0
  comments: Int = 0
  shares: Int = 0
  views: Int = 0
}

# Model Information Type
type ModelInfo {
  name: String!
  description: String!
  searchableFields: [String!]!
  filterableFields: [String!]!
}

type AvailableModelsResult {
  models: [ModelInfo!]!
  success: Boolean!
}

# ================================================================
# OPERATIONS ENUM
# ================================================================

enum MutationOperation {
  CREATE
  UPDATE
  DELETE
  DUPLICATE
  BULK_CREATE
  BULK_UPDATE
  BULK_DELETE
  ARCHIVE
  UNARCHIVE
}

# ================================================================
# QUERIES
# ================================================================

type Query {
  # الاستعلام الموحد الرئيسي
  genericQuery(
    modelName: String!
    filter: [FilterInput!]
    sort: [SortInput!]
    pagination: PaginationInput
    searchTerm: String
  ): GenericQueryResult!
  
  # الحصول على قائمة النماذج المتاحة
  availableModels: AvailableModelsResult!
}

# ================================================================
# MUTATIONS
# ================================================================

type Mutation {
  # العملية الموحدة الرئيسية
  genericMutation(
    modelName: String!
    operation: MutationOperation!
    id: ID
    data: String            # JSON string
    filter: [FilterInput!]
  ): GenericMutationResult!
  
  # ================================================================
  # SOCIAL MEDIA SPECIFIC MUTATIONS
  # ================================================================
  
  # إنشاء محتوى سوشيال ميديا
  createSocialContent(
    input: SocialContentInput!
  ): GenericMutationResult!
  
  # جدولة محتوى للنشر
  scheduleContent(
    contentId: ID!
    scheduledAt: String!
  ): GenericMutationResult!
  
  # تحديث إحصائيات المحتوى
  updateContentMetrics(
    contentId: ID!
    metrics: MetricsInput!
  ): GenericMutationResult!
}

`;

module.exports = genericTypeDefs; 