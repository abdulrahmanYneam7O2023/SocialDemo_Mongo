const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const { faker } = require('@faker-js/faker');

// إعداد faker للعربية
faker.locale = 'ar';

// تحديد المحتوى العربي الواقعي
const arabicContent = {
  posts: [
    'صباح الخير جميعاً! أتمنى لكم يوماً رائعاً مليئاً بالإنجازات 🌅',
    'شاركوني رأيكم في هذا المنتج الجديد، هل تنصحون بشرائه؟ 🤔',
    'أفضل الطرق لتعلم البرمجة من الصفر، ما رأيكم؟ 💻',
    'رحلة رائعة إلى شواطئ البحر الأحمر، المناظر خلابة! 🏖️',
    'نصائح مهمة لريادة الأعمال والنجاح في المشاريع الصغيرة 📈',
    'كتاب رائع انتهيت من قراءته اليوم، أنصح الجميع بقراءته 📚',
    'طبخة جديدة جربتها اليوم، النتيجة كانت مذهلة! 🍽️',
    'تمرين رياضي صباحي، الرياضة مهمة للصحة النفسية والجسدية 💪',
    'معرض للفنون المحلية، دعم الفنانين العرب مهم جداً 🎨',
    'نقاش مفيد حول التكنولوجيا ومستقبل الذكاء الاصطناعي 🤖',
    'وصفة طبيعية للعناية بالبشرة، مكونات من المطبخ 🥒',
    'مشروع تطوعي لمساعدة الأطفال المحتاجين، انضموا معنا ❤️',
    'درس جديد في التصوير الفوتوغرافي، الإضاءة هي السر 📸',
    'تجربة مطعم جديد في المدينة، الطعام لذيذ والخدمة ممتازة 🍕',
    'مشاهدة فيلم عربي رائع، السينما العربية تتطور بشكل مذهل 🎬',
    'نصائح للحفاظ على البيئة وتقليل استهلاك البلاستيك 🌱',
    'درس في اللغة الإنجليزية، التعلم المستمر مفتاح النجاح 📖',
    'زيارة لمتحف التاريخ الطبيعي، معلومات مذهلة عن الديناصورات 🦕',
    'تجربة تطبيق جديد للتنظيم الشخصي، ساعدني كثيراً 📱',
    'رحلة تسوق في السوق الشعبي، أسعار معقولة ومنتجات أصيلة 🛍️'
  ],
  platforms: ['Instagram', 'Twitter', 'Facebook', 'TikTok', 'LinkedIn', 'YouTube', 'Snapchat'],
  contentTypes: ['POST', 'STORY', 'REEL', 'VIDEO', 'TWEET', 'ARTICLE', 'PHOTO'],
  cities: ['الرياض', 'القاهرة', 'دبي', 'الدوحة', 'بيروت', 'عمان', 'الكويت', 'المنامة', 'مسقط', 'الرباط', 'تونس', 'الجزائر'],
  hashtags: ['#تطوير', '#برمجة', '#تكنولوجيا', '#ريادة_أعمال', '#تعليم', '#صحة', '#رياضة', '#طبخ', '#سفر', '#فن', '#موسيقى', '#قراءة']
};

// إعداد الاتصال بقاعدة البيانات
const connectDB = async () => {
  try {
    // قراءة إعدادات من ملف النص
    const fs = require('fs');
    const envData = fs.readFileSync('./cd411483-63a0-44d6-b48c-706cfddb2264.txt', 'utf8');
    const lines = envData.split('\n');
    lines.forEach(line => {
      const [key, value] = line.split('=');
      if (key && value) {
        process.env[key.trim()] = value.trim();
      }
    });

    await mongoose.connect(process.env.MONGODB_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log('✅ متصل بـ MongoDB');
  } catch (error) {
    console.error('❌ خطأ في الاتصال بقاعدة البيانات:', error);
    process.exit(1);
  }
};

// موديلات قاعدة البيانات
const userSchema = new mongoose.Schema({
  username: { type: String, required: true, unique: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  bio: String,
  avatar: String,
  isVerified: { type: Boolean, default: false },
  followersCount: { type: Number, default: 0 },
  followingCount: { type: Number, default: 0 },
  postsCount: { type: Number, default: 0 },
  location: String,
  website: String,
  joinedDate: { type: Date, default: Date.now },
  createdAt: { type: Date, default: Date.now }
});

const socialContentSchema = new mongoose.Schema({
  contentId: { type: String, required: true, unique: true },
  platform: { type: String, required: true },
  contentType: { type: String, required: true },
  content: String,
  author: String,
  hashtags: [String],
  mentions: [String],
  location: String,
  language: { type: String, default: 'ar' },
  status: { type: String, default: 'PUBLISHED' },
  visibility: { type: String, default: 'PUBLIC' },
  createdBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  metrics: {
    likes: { type: Number, default: 0 },
    comments: { type: Number, default: 0 },
    shares: { type: Number, default: 0 },
    views: { type: Number, default: 0 },
    saves: { type: Number, default: 0 },
    clicks: { type: Number, default: 0 }
  },
  engagement: {
    rate: { type: Number, default: 0 },
    score: { type: Number, default: 0 }
  },
  scheduledAt: Date,
  publishedAt: { type: Date, default: Date.now },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
});

const socialAnalyticsSchema = new mongoose.Schema({
  contentId: { type: String, required: true },
  connectionId: String,
  analyticsType: { type: String, required: true },
  platform: { type: String, required: true },
  periodType: { type: String, required: true },
  periodStart: Date,
  periodEnd: Date,
  normalizedMetrics: {
    reach: { type: Number, default: 0 },
    impressions: { type: Number, default: 0 },
    engagement: { type: Number, default: 0 },
    clicks: { type: Number, default: 0 },
    likes: { type: Number, default: 0 },
    comments: { type: Number, default: 0 },
    shares: { type: Number, default: 0 },
    saves: { type: Number, default: 0 },
    profileVisits: { type: Number, default: 0 },
    websiteClicks: { type: Number, default: 0 }
  },
  demographics: {
    ageGroups: [{
      range: String,
      percentage: Number
    }],
    genders: [{
      type: String,
      percentage: Number
    }],
    locations: [{
      country: String,
      percentage: Number
    }]
  },
  snapshotDate: { type: Date, default: Date.now }
});

const User = mongoose.model('User', userSchema);
const SocialContent = mongoose.model('SocialContent', socialContentSchema);
const SocialAnalytics = mongoose.model('SocialAnalytics', socialAnalyticsSchema);

// وظائف إنشاء البيانات
const generateUsers = (count = 60) => {
  const users = [];
  const arabicNames = [
    'أحمد_محمد', 'فاطمة_أحمد', 'محمد_علي', 'عائشة_سالم', 'علي_حسن',
    'زينب_محمود', 'حسن_إبراهيم', 'مريم_يوسف', 'يوسف_عبدالله', 'نور_الدين',
    'سارة_محمد', 'عمر_أحمد', 'ليلى_علي', 'خالد_حسن', 'رقية_يوسف',
    'إبراهيم_سالم', 'آمنة_محمود', 'سالم_عبدالله', 'هدى_إبراهيم', 'عبدالله_أحمد',
    'فريدة_علي', 'محمود_حسن', 'نادية_يوسف', 'طارق_سالم', 'ريم_محمد',
    'وليد_أحمد', 'شيماء_علي', 'سمير_حسن', 'دعاء_يوسف', 'عماد_سالم'
  ];

  for (let i = 0; i < count; i++) {
    const randomName = arabicNames[Math.floor(Math.random() * arabicNames.length)];
    const randomNumber = Math.floor(Math.random() * 1000);
    
    users.push({
      username: `${randomName}_${randomNumber}`,
      email: `user${i + 1}@example.com`,
      password: 'password123', // سيتم تشفيرها
      bio: `${faker.lorem.sentence()} #${arabicContent.hashtags[Math.floor(Math.random() * arabicContent.hashtags.length)]}`,
      avatar: faker.image.avatar(),
      isVerified: Math.random() > 0.8, // 20% محققين
      followersCount: Math.floor(Math.random() * 10000),
      followingCount: Math.floor(Math.random() * 1000),
      postsCount: Math.floor(Math.random() * 500),
      location: arabicContent.cities[Math.floor(Math.random() * arabicContent.cities.length)],
      website: Math.random() > 0.6 ? faker.internet.url() : null,
      joinedDate: faker.date.past(2)
    });
  }
  return users;
};

const generatePosts = (users, count = 200) => {
  const posts = [];
  
  for (let i = 0; i < count; i++) {
    const randomUser = users[Math.floor(Math.random() * users.length)];
    const randomContent = arabicContent.posts[Math.floor(Math.random() * arabicContent.posts.length)];
    const platform = arabicContent.platforms[Math.floor(Math.random() * arabicContent.platforms.length)];
    const contentType = arabicContent.contentTypes[Math.floor(Math.random() * arabicContent.contentTypes.length)];
    
    // إضافة hashtags عشوائية
    const hashtagCount = Math.floor(Math.random() * 4) + 1;
    const selectedHashtags = [];
    for (let j = 0; j < hashtagCount; j++) {
      const hashtag = arabicContent.hashtags[Math.floor(Math.random() * arabicContent.hashtags.length)];
      if (!selectedHashtags.includes(hashtag)) {
        selectedHashtags.push(hashtag);
      }
    }
    
    posts.push({
      contentId: `post_${Date.now()}_${i}_${Math.random().toString(36).substring(7)}`,
      platform,
      contentType,
      content: `${randomContent} ${selectedHashtags.join(' ')}`,
      author: randomUser.username,
      hashtags: selectedHashtags,
      location: arabicContent.cities[Math.floor(Math.random() * arabicContent.cities.length)],
      createdBy: randomUser._id,
      metrics: {
        likes: Math.floor(Math.random() * 5000),
        comments: Math.floor(Math.random() * 500),
        shares: Math.floor(Math.random() * 200),
        views: Math.floor(Math.random() * 50000),
        saves: Math.floor(Math.random() * 100),
        clicks: Math.floor(Math.random() * 1000)
      },
      engagement: {
        rate: Math.random() * 10,
        score: Math.random() * 100
      },
      publishedAt: faker.date.past(1),
      createdAt: faker.date.past(1)
    });
  }
  return posts;
};

const generateAnalytics = (posts, count = 150) => {
  const analytics = [];
  const analyticsTypes = ['CONTENT_PERFORMANCE', 'AUDIENCE_INSIGHTS', 'ENGAGEMENT_METRICS'];
  const periodTypes = ['DAILY', 'WEEKLY', 'MONTHLY'];
  
  for (let i = 0; i < count; i++) {
    const randomPost = posts[Math.floor(Math.random() * posts.length)];
    const periodType = periodTypes[Math.floor(Math.random() * periodTypes.length)];
    const analyticsType = analyticsTypes[Math.floor(Math.random() * analyticsTypes.length)];
    
    const baseDate = faker.date.past(1);
    let periodStart, periodEnd;
    
    switch (periodType) {
      case 'DAILY':
        periodStart = new Date(baseDate);
        periodEnd = new Date(baseDate.getTime() + 24 * 60 * 60 * 1000);
        break;
      case 'WEEKLY':
        periodStart = new Date(baseDate);
        periodEnd = new Date(baseDate.getTime() + 7 * 24 * 60 * 60 * 1000);
        break;
      case 'MONTHLY':
        periodStart = new Date(baseDate);
        periodEnd = new Date(baseDate.getFullYear(), baseDate.getMonth() + 1, baseDate.getDate());
        break;
    }
    
    analytics.push({
      contentId: randomPost.contentId,
      connectionId: `conn_${Math.random().toString(36).substring(7)}`,
      analyticsType,
      platform: randomPost.platform,
      periodType,
      periodStart,
      periodEnd,
      normalizedMetrics: {
        reach: Math.floor(Math.random() * 100000),
        impressions: Math.floor(Math.random() * 500000),
        engagement: Math.floor(Math.random() * 10000),
        clicks: Math.floor(Math.random() * 5000),
        likes: randomPost.metrics.likes + Math.floor(Math.random() * 100),
        comments: randomPost.metrics.comments + Math.floor(Math.random() * 50),
        shares: randomPost.metrics.shares + Math.floor(Math.random() * 20),
        saves: randomPost.metrics.saves + Math.floor(Math.random() * 30),
        profileVisits: Math.floor(Math.random() * 1000),
        websiteClicks: Math.floor(Math.random() * 500)
      },
      demographics: {
        ageGroups: [
          { range: '18-24', percentage: Math.random() * 30 },
          { range: '25-34', percentage: Math.random() * 40 },
          { range: '35-44', percentage: Math.random() * 20 },
          { range: '45+', percentage: Math.random() * 10 }
        ],
        genders: [
          { type: 'male', percentage: Math.random() * 60 },
          { type: 'female', percentage: Math.random() * 40 }
        ],
        locations: arabicContent.cities.slice(0, 5).map(city => ({
          country: city,
          percentage: Math.random() * 20
        }))
      },
      snapshotDate: faker.date.past(1)
    });
  }
  return analytics;
};

// الوظيفة الرئيسية للـ seeding
const seedDatabase = async () => {
  try {
    console.log('🚀 بدء عملية إضافة البيانات الوهمية المحسنة...\n');

    // حذف البيانات الموجودة
    console.log('🗑️  حذف البيانات الموجودة...');
    await User.deleteMany({});
    await SocialContent.deleteMany({});
    await SocialAnalytics.deleteMany({});
    console.log('✅ تم حذف البيانات الموجودة\n');

    // إنشاء المستخدمين
    console.log('👥 إنشاء 60 مستخدم...');
    const usersData = generateUsers(60);
    
    // تشفير كلمات المرور
    for (let user of usersData) {
      user.password = await bcrypt.hash(user.password, 10);
    }
    
    const users = await User.insertMany(usersData);
    console.log(`✅ تم إنشاء ${users.length} مستخدم\n`);

    // إنشاء المنشورات
    console.log('📝 إنشاء 200 منشور...');
    const postsData = generatePosts(users, 200);
    const posts = await SocialContent.insertMany(postsData);
    console.log(`✅ تم إنشاء ${posts.length} منشور\n`);

    // إنشاء التحليلات
    console.log('📊 إنشاء 150 تحليل...');
    const analyticsData = generateAnalytics(posts, 150);
    const analytics = await SocialAnalytics.insertMany(analyticsData);
    console.log(`✅ تم إنشاء ${analytics.length} تحليل\n`);

    // إحصائيات النهائية
    console.log('📈 إحصائيات البيانات المُضافة:');
    console.log(`👥 المستخدمين: ${users.length}`);
    console.log(`📝 المنشورات: ${posts.length}`);
    console.log(`📊 التحليلات: ${analytics.length}`);
    
    // توزيع المنصات
    const platformStats = {};
    posts.forEach(post => {
      platformStats[post.platform] = (platformStats[post.platform] || 0) + 1;
    });
    
    console.log('\n🌐 توزيع المنشورات حسب المنصة:');
    Object.entries(platformStats).forEach(([platform, count]) => {
      console.log(`   ${platform}: ${count} منشور`);
    });

    // إحصائيات المشاركة
    const totalLikes = posts.reduce((sum, post) => sum + post.metrics.likes, 0);
    const totalComments = posts.reduce((sum, post) => sum + post.metrics.comments, 0);
    const totalShares = posts.reduce((sum, post) => sum + post.metrics.shares, 0);
    
    console.log('\n💫 إحصائيات التفاعل:');
    console.log(`   👍 إجمالي الإعجابات: ${totalLikes.toLocaleString()}`);
    console.log(`   💬 إجمالي التعليقات: ${totalComments.toLocaleString()}`);
    console.log(`   🔄 إجمالي المشاركات: ${totalShares.toLocaleString()}`);

    console.log('\n🎉 تم إنشاء البيانات الوهمية بنجاح!');
    console.log('📍 يمكنك الآن تجربة الـ API مع بيانات غنية ومتنوعة');
    
  } catch (error) {
    console.error('❌ خطأ في إنشاء البيانات:', error);
  } finally {
    await mongoose.connection.close();
    console.log('\n🔌 تم قطع الاتصال بقاعدة البيانات');
    process.exit(0);
  }
};

// تشغيل العملية
if (require.main === module) {
  connectDB().then(() => {
    seedDatabase();
  });
}

module.exports = { seedDatabase, connectDB }; 