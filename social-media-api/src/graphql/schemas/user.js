const userTypeDefs = `#graphql
type User {
  id: ID!
  username: String!
  email: String!
  createdAt: String!
}

  extend type Query {
  me: User
}
`;

module.exports = userTypeDefs;