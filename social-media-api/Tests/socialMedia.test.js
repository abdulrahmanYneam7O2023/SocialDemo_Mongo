const request = require('supertest');
const { ApolloServer } = require('@apollo/server');
const { startStandaloneServer } = require('@apollo/server/standalone');
const connectDB = require('../src/config/db');
const { typeDefs, resolvers } = require('../src/graphql');
const { User } = require('../src/models/User');
const jwt = require('jsonwebtoken');

describe('Social Media API', () => {
  let server, url, token;

  beforeAll(async () => {
    await connectDB();
    const user = new User({
      username: 'testuser',
      email: 'test@example.com',
      password: 'password123',
    });
    await user.save();
    token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: '1h' });

    const apolloServer = new ApolloServer({ typeDefs, resolvers });
    const serverInfo = await startStandaloneServer(apolloServer, { listen: { port: 0 } });
    server = serverInfo.server;
    url = serverInfo.url;
  });

  afterAll(async () => {
    await server.close();
    await mongoose.connection.close();
  });

  it('should fetch all posts with authentication', async () => {
    const response = await request(url)
      .post('/')
      .set('Authorization', `Bearer ${token}`)
      .send({
        query: `
          query {
            allPosts {
              id
              platform
              contentType
            }
          }
        `,
      });

    expect(response.status).toBe(200);
    expect(response.body.data.allPosts).toBeInstanceOf(Array);
  });

  it('should return unauthorized without token', async () => {
    const response = await request(url)
      .post('/')
      .send({
        query: `
          query {
            allPosts {
              id
            }
          }
        `,
      });

    expect(response.status).toBe(200);
    expect(response.body.errors).toBeDefined();
    expect(response.body.errors[0].message).toBe('You must be logged in');
  });
});