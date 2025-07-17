require('dotenv').config();
const mongoose = require('mongoose');
const { SocialContent, SocialAnalytics } = require('../models/SocialContent');
const { User } = require('../models/User');
const { faker } = require('@faker-js/faker');
const connectDB = require('../config/db');

const seedData = async () => {
  try {
    await connectDB();
    await SocialContent.deleteMany({});
    await SocialAnalytics.deleteMany({});
    await User.deleteMany({});

    const user = new User({
      username: 'admin',
      email: 'admin@example.com',
      password: 'password123',
    });
    await user.save();

    const platforms = ['Instagram', 'Facebook', 'Twitter', 'LinkedIn', 'TikTok', 'YouTube'];
    const contentTypes = ['IMAGE', 'VIDEO', 'STORY', 'POST', 'REEL', 'TWEET'];
    const periodTypes = ['DAILY', 'WEEKLY', 'MONTHLY'];

    const posts = Array.from({ length: 50 }, () => ({
      contentId: `post-${Date.now()}-${faker.string.uuid()}`,
      platform: faker.helpers.arrayElement(platforms),
      contentType: faker.helpers.arrayElement(contentTypes),
      content: faker.lorem.sentence(),
      author: faker.internet.userName(),
      status: 'PUBLISHED',
      createdAt: faker.date.past(),
      createdBy: user._id,
      metrics: {
        likes: faker.number.int({ min: 0, max: 1000 }),
        comments: faker.number.int({ min: 0, max: 200 }),
        shares: faker.number.int({ min: 0, max: 100 }),
        views: faker.number.int({ min: 0, max: 5000 }),
      },
    }));

    const savedPosts = await SocialContent.insertMany(posts);

    const analytics = savedPosts.map(post => ({
      contentId: post.contentId,
      connectionId: `conn-${faker.string.uuid()}`,
      analyticsType: 'POST_ANALYTICS',
      platform: post.platform,
      periodType: faker.helpers.arrayElement(periodTypes),
      periodStart: faker.date.past(),
      periodEnd: faker.date.recent(),
      normalizedMetrics: {
        reach: faker.number.int({ min: 0, max: 10000 }),
        impressions: faker.number.int({ min: 0, max: 15000 }),
        engagement: faker.number.int({ min: 0, max: 5000 }),
        clicks: faker.number.int({ min: 0, max: 1000 }),
        shares: faker.number.int({ min: 0, max: 500 }),
        saves: faker.number.int({ min: 0, max: 300 }),
        comments: faker.number.int({ min: 0, max: 200 }),
        likes: faker.number.int({ min: 0, max: 1000 }),
      },
      snapshotDate: faker.date.recent(),
    }));

    await SocialAnalytics.insertMany(analytics);

    console.log('Seed data inserted');
  } catch (err) {
    console.error('Seed error:', err);
  } finally {
    mongoose.connection.close();
  }
};

seedData();