const mongoose = require('mongoose');
const { faker } = require('@faker-js/faker');

// إعداد الاتصال بقاعدة البيانات
const connectDB = async () => {
  try {
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

const socialContentSchema = new mongoose.Schema({}, { strict: false });

const SocialAnalytics = mongoose.model('SocialAnalytics', socialAnalyticsSchema);
const SocialContent = mongoose.model('SocialContent', socialContentSchema);

const generateAnalyticsForPosts = async () => {
  try {
    console.log('🔧 إصلاح وإضافة Analytics للمنشورات...\n');

    // حذف Analytics الموجودة
    await SocialAnalytics.deleteMany({});
    console.log('🗑️  تم حذف Analytics القديمة');

    // الحصول على جميع المنشورات
    const posts = await SocialContent.find({});
    console.log(`📝 وجدت ${posts.length} منشور`);

    const analyticsData = [];
    const analyticsTypes = ['CONTENT_PERFORMANCE', 'AUDIENCE_INSIGHTS', 'ENGAGEMENT_METRICS'];
    const periodTypes = ['DAILY', 'WEEKLY', 'MONTHLY'];

    for (const post of posts) {
      // إنشاء 3-5 تحليلات لكل منشور
      const analyticsCount = Math.floor(Math.random() * 3) + 3;
      
      for (let i = 0; i < analyticsCount; i++) {
        const periodType = periodTypes[Math.floor(Math.random() * periodTypes.length)];
        const analyticsType = analyticsTypes[Math.floor(Math.random() * analyticsTypes.length)];
        
        const baseDate = post.createdAt || new Date();
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
        
        const likesBase = post.metrics?.likes || Math.floor(Math.random() * 1000);
        const viewsBase = post.metrics?.views || Math.floor(Math.random() * 10000);
        
        analyticsData.push({
          contentId: post.contentId,
          connectionId: `conn_${Math.random().toString(36).substring(7)}`,
          analyticsType,
          platform: post.platform,
          periodType,
          periodStart,
          periodEnd,
          normalizedMetrics: {
            reach: Math.floor(viewsBase * 0.8),
            impressions: Math.floor(viewsBase * 1.2),
            engagement: Math.floor(likesBase * 1.5),
            clicks: Math.floor(likesBase * 0.3),
            likes: likesBase + Math.floor(Math.random() * 100),
            comments: (post.metrics?.comments || 0) + Math.floor(Math.random() * 50),
            shares: (post.metrics?.shares || 0) + Math.floor(Math.random() * 20),
            saves: Math.floor(Math.random() * 100),
            profileVisits: Math.floor(Math.random() * 500),
            websiteClicks: Math.floor(Math.random() * 200)
          },
          demographics: {
            ageGroups: [
              { range: '18-24', percentage: Math.random() * 30 },
              { range: '25-34', percentage: Math.random() * 40 },
              { range: '35-44', percentage: Math.random() * 20 },
              { range: '45+', percentage: Math.random() * 10 }
            ],
            genders: [
              { type: 'male', percentage: 30 + Math.random() * 40 },
              { type: 'female', percentage: 30 + Math.random() * 40 }
            ],
            locations: [
              { country: 'الرياض', percentage: Math.random() * 25 },
              { country: 'القاهرة', percentage: Math.random() * 20 },
              { country: 'دبي', percentage: Math.random() * 15 },
              { country: 'الدوحة', percentage: Math.random() * 10 },
              { country: 'بيروت', percentage: Math.random() * 10 }
            ]
          },
          snapshotDate: new Date(baseDate.getTime() + i * 24 * 60 * 60 * 1000)
        });
      }
    }

    // إدراج Analytics الجديدة
    const insertedAnalytics = await SocialAnalytics.insertMany(analyticsData);
    console.log(`✅ تم إنشاء ${insertedAnalytics.length} تحليل جديد`);

    // إحصائيات
    const platformStats = {};
    analyticsData.forEach(analytics => {
      if (!platformStats[analytics.platform]) {
        platformStats[analytics.platform] = 0;
      }
      platformStats[analytics.platform]++;
    });

    console.log('\n📊 توزيع Analytics حسب المنصة:');
    Object.entries(platformStats).forEach(([platform, count]) => {
      console.log(`   ${platform}: ${count} تحليل`);
    });

    // إحصائيات الأنواع
    const typeStats = {};
    analyticsData.forEach(analytics => {
      if (!typeStats[analytics.analyticsType]) {
        typeStats[analytics.analyticsType] = 0;
      }
      typeStats[analytics.analyticsType]++;
    });

    console.log('\n📈 توزيع أنواع Analytics:');
    Object.entries(typeStats).forEach(([type, count]) => {
      console.log(`   ${type}: ${count} تحليل`);
    });

    console.log('\n🎉 تم إصلاح Analytics بنجاح!');
    console.log(`📊 إجمالي Analytics: ${insertedAnalytics.length}`);
    console.log(`📝 المنشورات المرتبطة: ${posts.length}`);

  } catch (error) {
    console.error('❌ خطأ في إصلاح Analytics:', error);
  } finally {
    await mongoose.connection.close();
    console.log('\n🔌 تم قطع الاتصال بقاعدة البيانات');
    process.exit(0);
  }
};

// تشغيل العملية
connectDB().then(() => {
  generateAnalyticsForPosts();
}); 