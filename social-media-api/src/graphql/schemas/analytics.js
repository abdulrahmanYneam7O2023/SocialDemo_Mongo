const analyticsTypeDefs = `#graphql
type AnalyticsSnapshot {
  id: ID!
  contentId: ID
  connectionId: ID!
  analyticsType: String!
  platform: String!
  periodType: String!
  periodStart: String
  periodEnd: String
  metrics: AnalyticsMetrics!
  snapshotDate: String!
}

type AnalyticsMetrics {
  reach: Int!
  impressions: Int!
  engagement: Int!
  clicks: Int!
  shares: Int!
  saves: Int!
  comments: Int!
  likes: Int!
}

  extend type Query {
  analyticsByContent(contentId: ID!): [AnalyticsSnapshot!]!
  analyticsByPlatform(platform: String!, periodType: String): [AnalyticsSnapshot!]!
}
`;

module.exports = analyticsTypeDefs;