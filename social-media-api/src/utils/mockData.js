// بيانات وهمية شاملة للاختبار بدون قاعدة البيانات
const { faker } = require('@faker-js/faker');

// إعداد البيانات الأساسية
const platforms = ['Instagram', 'Facebook', 'Twitter', 'LinkedIn', 'TikTok', 'YouTube'];
const contentTypes = ['IMAGE', 'VIDEO', 'STORY', 'POST', 'REEL', 'TWEET'];

// مستخدمين وهميين
const mockUsers = [
  {
    id: '1',
    _id: '1',
    username: 'ahmed_hassan',
    email: 'ahmed@example.com',
    password: '$2a$10$hash_for_password123', // هاش وهمي
    createdAt: new Date('2024-01-15').toISOString(),
  },
  {
    id: '2',
    _id: '2',
    username: 'sara_mohamed',
    email: 'sara@example.com',
    password: '$2a$10$hash_for_password123',
    createdAt: new Date('2024-02-10').toISOString(),
  },
  {
    id: '3',
    _id: '3',
    username: 'omar_ali',
    email: 'omar@example.com',
    password: '$2a$10$hash_for_password123',
    createdAt: new Date('2024-03-05').toISOString(),
  },
  {
    id: '4',
    _id: '4',
    username: 'fatima_nour',
    email: 'fatima@example.com',
    password: '$2a$10$hash_for_password123',
    createdAt: new Date('2024-03-20').toISOString(),
  }
];

// منشورات وهمية متنوعة
const mockPosts = [
  {
    id: '1',
    contentId: 'post_1',
    platform: 'Instagram',
    contentType: 'IMAGE',
    content: 'صورة جميلة من رحلة القاهرة 🏛️ #مصر #سياحة',
    author: 'ahmed_hassan',
    status: 'PUBLISHED',
    createdAt: new Date('2024-07-15').toISOString(),
    createdBy: mockUsers[0],
    metrics: { likes: 245, comments: 32, shares: 18, views: 1200 },
  },
  {
    id: '2',
    contentId: 'post_2',
    platform: 'Twitter',
    contentType: 'TWEET',
    content: 'يوم رائع للبرمجة! تعلمت GraphQL اليوم 💻 #البرمجة #تطوير',
    author: 'sara_mohamed',
    status: 'PUBLISHED',
    createdAt: new Date('2024-07-16').toISOString(),
    createdBy: mockUsers[1],
    metrics: { likes: 156, comments: 24, shares: 12, views: 890 },
  },
  {
    id: '3',
    contentId: 'post_3',
    platform: 'Facebook',
    contentType: 'POST',
    content: 'مشاركة تجربتي في تعلم Node.js و MongoDB. رحلة شيقة! 🚀',
    author: 'omar_ali',
    status: 'PUBLISHED',
    createdAt: new Date('2024-07-16').toISOString(),
    createdBy: mockUsers[2],
    metrics: { likes: 89, comments: 15, shares: 7, views: 654 },
  },
  {
    id: '4',
    contentId: 'post_4',
    platform: 'LinkedIn',
    contentType: 'POST',
    content: 'نصائح مهمة للمطورين الجدد في مجال الـ Backend Development',
    author: 'fatima_nour',
    status: 'PUBLISHED',
    createdAt: new Date('2024-07-17').toISOString(),
    createdBy: mockUsers[3],
    metrics: { likes: 134, comments: 28, shares: 15, views: 780 },
  },
  {
    id: '5',
    contentId: 'post_5',
    platform: 'TikTok',
    contentType: 'VIDEO',
    content: 'فيديو سريع عن أساسيات React ⚛️ #تعلم_البرمجة',
    author: 'sara_mohamed',
    status: 'PUBLISHED',
    createdAt: new Date('2024-07-17').toISOString(),
    createdBy: mockUsers[1],
    metrics: { likes: 512, comments: 67, shares: 89, views: 3200 },
  },
  {
    id: '6',
    contentId: 'post_6',
    platform: 'YouTube',
    contentType: 'VIDEO',
    content: 'شرح شامل لـ API Development باستخدام Express.js',
    author: 'ahmed_hassan',
    status: 'PUBLISHED',
    createdAt: new Date('2024-07-17').toISOString(),
    createdBy: mockUsers[0],
    metrics: { likes: 298, comments: 45, shares: 23, views: 1500 },
  }
];

// تحليلات وهمية مفصلة
const mockAnalytics = [
  {
    id: '1',
    contentId: 'post_1',
    connectionId: 'conn_instagram_1',
    analyticsType: 'engagement',
    platform: 'Instagram',
    periodType: 'DAILY',
    periodStart: new Date('2024-07-15').toISOString(),
    periodEnd: new Date('2024-07-15').toISOString(),
    normalizedMetrics: {
      reach: 1200,
      impressions: 1500,
      engagement: 245,
      clicks: 89,
      shares: 18,
      saves: 34,
      comments: 32,
      likes: 245,
    },
    snapshotDate: new Date('2024-07-15').toISOString(),
  },
  {
    id: '2',
    contentId: 'post_2',
    connectionId: 'conn_twitter_1',
    analyticsType: 'engagement',
    platform: 'Twitter',
    periodType: 'DAILY',
    periodStart: new Date('2024-07-16').toISOString(),
    periodEnd: new Date('2024-07-16').toISOString(),
    normalizedMetrics: {
      reach: 890,
      impressions: 1100,
      engagement: 156,
      clicks: 45,
      shares: 12,
      saves: 8,
      comments: 24,
      likes: 156,
    },
    snapshotDate: new Date('2024-07-16').toISOString(),
  },
  {
    id: '3',
    contentId: 'post_5',
    connectionId: 'conn_tiktok_1',
    analyticsType: 'engagement',
    platform: 'TikTok',
    periodType: 'DAILY',
    periodStart: new Date('2024-07-17').toISOString(),
    periodEnd: new Date('2024-07-17').toISOString(),
    normalizedMetrics: {
      reach: 3200,
      impressions: 4500,
      engagement: 512,
      clicks: 234,
      shares: 89,
      saves: 123,
      comments: 67,
      likes: 512,
    },
    snapshotDate: new Date('2024-07-17').toISOString(),
  }
];

// دوال مساعدة للعمليات على البيانات الوهمية
class MockDatabase {
  constructor() {
    this.users = [...mockUsers];
    this.posts = [...mockPosts];
    this.analytics = [...mockAnalytics];
    this.nextUserId = 5;
    this.nextPostId = 7;
    this.nextAnalyticsId = 4;
  }

  // عمليات المستخدمين
  findUserByEmail(email) {
    return this.users.find(user => user.email === email);
  }

  findUserById(id) {
    return this.users.find(user => user.id === id || user._id === id);
  }

  createUser(userData) {
    const newUser = {
      id: this.nextUserId.toString(),
      _id: this.nextUserId.toString(),
      ...userData,
      createdAt: new Date().toISOString(),
    };
    this.users.push(newUser);
    this.nextUserId++;
    return newUser;
  }

  // عمليات المنشورات
  getAllPosts(filter = {}, sort = {}, limit = 10, skip = 0) {
    let filteredPosts = this.posts.filter(post => post.status === 'PUBLISHED');
    
    if (filter.platform) {
      filteredPosts = filteredPosts.filter(post => post.platform === filter.platform);
    }
    
    if (filter.contentType) {
      filteredPosts = filteredPosts.filter(post => post.contentType === filter.contentType);
    }
    
    if (filter.author) {
      filteredPosts = filteredPosts.filter(post => post.author === filter.author);
    }

    // ترتيب
    if (sort.field) {
      filteredPosts.sort((a, b) => {
        const aValue = sort.field.includes('.') ? 
          sort.field.split('.').reduce((obj, key) => obj[key], a) : a[sort.field];
        const bValue = sort.field.includes('.') ? 
          sort.field.split('.').reduce((obj, key) => obj[key], b) : b[sort.field];
        
        if (sort.order === 'DESC') {
          return bValue > aValue ? 1 : -1;
        }
        return aValue > bValue ? 1 : -1;
      });
    }

    return filteredPosts.slice(skip, skip + limit);
  }

  createPost(postData, userId) {
    const user = this.findUserById(userId);
    const newPost = {
      id: this.nextPostId.toString(),
      contentId: `post_${this.nextPostId}`,
      ...postData,
      status: 'PUBLISHED',
      createdAt: new Date().toISOString(),
      createdBy: user,
      metrics: { likes: 0, comments: 0, shares: 0, views: 0 },
    };
    this.posts.push(newPost);
    this.nextPostId++;
    return newPost;
  }

  updatePost(id, postData) {
    const postIndex = this.posts.findIndex(post => post.id === id || post.contentId === id);
    if (postIndex === -1) return null;
    
    this.posts[postIndex] = { ...this.posts[postIndex], ...postData };
    return this.posts[postIndex];
  }

  deletePost(id) {
    const postIndex = this.posts.findIndex(post => post.id === id || post.contentId === id);
    if (postIndex === -1) return false;
    
    this.posts.splice(postIndex, 1);
    return true;
  }

  // عمليات التحليلات
  getAnalyticsByContent(contentId) {
    return this.analytics.filter(analytics => analytics.contentId === contentId);
  }

  getAnalyticsByPlatform(platform, periodType = null) {
    let filtered = this.analytics.filter(analytics => analytics.platform === platform);
    if (periodType) {
      filtered = filtered.filter(analytics => analytics.periodType === periodType);
    }
    return filtered;
  }
}

// إنشاء مثيل واحد للاستخدام في كل التطبيق
const mockDB = new MockDatabase();

module.exports = {
  mockUsers,
  mockPosts,
  mockAnalytics,
  mockDB,
  MockDatabase,
}; 