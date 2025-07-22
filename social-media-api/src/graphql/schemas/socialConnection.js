const socialConnectionTypeDefs = `#graphql

# ================================================================
# SCALAR TYPES
# ================================================================
scalar JSON

# ================================================================
# SOCIAL CONNECTION TYPES & INPUTS
# ================================================================

type SocialConnection {
  id: ID!
  connectionId: String
  platform: SocialPlatform!
  accountName: String
  accountId: String
  displayName: String
  profilePicture: String
  followerCount: Int
  followingCount: Int
  isVerified: Boolean
  status: ConnectionStatus!
  connectedAt: String
  lastSyncAt: String
  accessToken: String
  refreshToken: String
  expiresAt: String
  # User Information
  userId: ID
  user: UserInfo
  createdAt: String!
  updatedAt: String!
}

type UserInfo {
  id: ID
  email: String
  name: String
  role: String
  isActive: Boolean
}

input SocialConnectionInput {
  platform: SocialPlatform!
  accountName: String
  accountId: String
  displayName: String
  profilePicture: String
  followerCount: Int
  followingCount: Int
  isVerified: Boolean
  status: ConnectionStatus
  accessToken: String
  refreshToken: String
  expiresAt: String
}

input SocialConnectionUpdateInput {
  accountName: String
  accountId: String
  displayName: String
  profilePicture: String
  followerCount: Int
  followingCount: Int
  isVerified: Boolean
  status: ConnectionStatus
  accessToken: String
  refreshToken: String
  expiresAt: String
}

enum ConnectionStatus {
  ACTIVE
  INACTIVE
  EXPIRED
  ERROR
  REVOKED
  PENDING
}

type SocialConnectionResponse {
  success: Boolean!
  message: String
  data: SocialConnection
}

type SocialConnectionListResponse {
  success: Boolean!
  message: String
  data: [SocialConnection!]!
  totalCount: Int!
}

# ================================================================
# QUERIES & MUTATIONS
# ================================================================

extend type Query {
  # Get all connections
  socialConnections: SocialConnectionListResponse!
  
  # Get connection by ID
  socialConnection(id: ID!): SocialConnectionResponse!
  
  # Get connections by platform
  connectionsByPlatform(platform: SocialPlatform!): SocialConnectionListResponse!
  
  # Get active connections only
  activeConnections: SocialConnectionListResponse!
}

extend type Mutation {
  # Create new connection
  createSocialConnection(input: SocialConnectionInput!): SocialConnectionResponse!
  
  # Update existing connection
  updateSocialConnection(id: ID!, input: SocialConnectionUpdateInput!): SocialConnectionResponse!
  
  # Delete connection
  deleteSocialConnection(id: ID!): SocialConnectionResponse!
  
  # Sync connection data (update follower counts, etc.)
  syncSocialConnection(id: ID!): SocialConnectionResponse!
  
  # Toggle connection status
  toggleConnectionStatus(id: ID!): SocialConnectionResponse!
}

`;

module.exports = socialConnectionTypeDefs; 