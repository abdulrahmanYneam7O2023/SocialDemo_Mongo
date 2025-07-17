const socialMediaTypeDefs = `#graphql
type SocialMediaPost {
  id: ID!
  platform: String!
  contentType: String!
  content: String
  createdAt: String!
  likes: Int!
  comments: Int!
  shares: Int!
  views: Int!
  author: String!
  createdBy: User!
}

input PostInput {
  platform: String!
  contentType: String!
  content: String
  author: String
}

input PostFilterInput {
  createdAt: DateFilter
  likes: IntFilter
  author: String
}

input DateFilter {
  gte: String
  lte: String
}

input IntFilter {
  gte: Int
  lte: Int
}

input PostSortInput {
  field: String!
  order: SortOrder!
}

enum SortOrder {
  ASC
  DESC
}

type Query {
  allPosts(filter: PostFilterInput, sort: PostSortInput, limit: Int, skip: Int): [SocialMediaPost!]!
  postsByPlatform(platform: String!, filter: PostFilterInput, sort: PostSortInput): [SocialMediaPost!]!
  postsByContentType(contentType: String!, filter: PostFilterInput, sort: PostSortInput): [SocialMediaPost!]!
}

type Mutation {
  addPost(input: PostInput!): SocialMediaPost!
  updatePost(id: ID!, input: PostInput!): SocialMediaPost!
  deletePost(id: ID!): Boolean!
}
`;

module.exports = socialMediaTypeDefs;