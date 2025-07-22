const mongoose = require('mongoose');
const { User } = require('./src/models/User');
const { SocialConnection, SocialContent, SocialAnalytics } = require('./src/models/SocialMediaModels');

// MongoDB URI
const MONGODB_URI = 'mongodb+srv://abdulrahman:201621623An@ac-hg1kzhy.icjtx3t.mongodb.net/socialApi';

async function testDatabaseContent() {
  try {
    console.log('🔍 فحص محتوى قاعدة البيانات...');
    
    await mongoose.connect(MONGODB_URI);
    console.log('✅ تم الاتصال بقاعدة البيانات');

    // عرض إحصائيات البيانات
    console.log('\n📊 إحصائيات قاعدة البيانات:');
    console.log('='.repeat(50));
    
    const userCount = await User.countDocuments();
    const connectionCount = await SocialConnection.countDocuments();
    const contentCount = await SocialContent.countDocuments();
    const analyticsCount = await SocialAnalytics.countDocuments();
    
    console.log(`👥 المستخدمين: ${userCount}`);
    console.log(`🔗 الاتصالات: ${connectionCount}`);
    console.log(`📱 المحتوى: ${contentCount}`);
    console.log(`📊 التحليلات: ${analyticsCount}`);

    // عرض عينات من البيانات
    console.log('\n🔍 عينات من البيانات:');
    console.log('='.repeat(50));

    // عرض 3 مستخدمين عشوائيين
    console.log('\n👤 عينة مستخدمين:');
    const sampleUsers = await User.find().limit(3);
    sampleUsers.forEach((user, index) => {
      console.log(`   ${index + 1}. ${user.name} (${user.email}) - ${user.role}`);
    });

    // عرض 3 اتصالات عشوائية
    console.log('\n🔗 عينة اتصالات:');
    const sampleConnections = await SocialConnection.find().populate('userId', 'name email').limit(3);
    sampleConnections.forEach((conn, index) => {
      console.log(`   ${index + 1}. ${conn.platform} - ${conn.platformAccountName}`);
      console.log(`      👤 المستخدم: ${conn.userId ? conn.userId.name : 'غير محدد'}`);
      console.log(`      👥 المتابعين: ${(conn.followerCount || 0).toLocaleString()}`);
      console.log(`      ✅ الحالة: ${conn.connectionStatus}`);
    });

    // عرض 3 محتويات عشوائية
    console.log('\n📱 عينة محتوى:');
    const sampleContent = await SocialContent.find().populate('connection', 'platformAccountName platform').limit(3);
    sampleContent.forEach((content, index) => {
      console.log(`   ${index + 1}. ${content.title}`);
      console.log(`      🎯 النوع: ${content.contentType}`);
      console.log(`      📺 المنصة: ${content.connection.platform}`);
      console.log(`      🔗 الحساب: ${content.connection.platformAccountName}`);
      console.log(`      📊 الحالة: ${content.publishStatus}`);
      if (content.mediaFiles && content.mediaFiles.length > 0) {
        console.log(`      🎬 الملفات: ${content.mediaFiles[0]}`);
      }
    });

    // عرض 3 تحليلات عشوائية
    console.log('\n📊 عينة تحليلات:');
    const sampleAnalytics = await SocialAnalytics.find().populate('contentId', 'title').limit(3);
    sampleAnalytics.forEach((analytics, index) => {
      console.log(`   ${index + 1}. ${analytics.contentId.title}`);
      console.log(`      👀 المشاهدات: ${analytics.metrics.views.toLocaleString()}`);
      console.log(`      ❤️ الإعجابات: ${analytics.metrics.likes.toLocaleString()}`);
      console.log(`      💬 التعليقات: ${analytics.metrics.comments.toLocaleString()}`);
      console.log(`      🔄 المشاركات: ${analytics.metrics.shares.toLocaleString()}`);
      console.log(`      📈 التفاعل: ${analytics.metrics.engagement.toLocaleString()}`);
    });

    // إحصائيات المنصات
    console.log('\n📱 إحصائيات المنصات:');
    const platformStats = await SocialConnection.aggregate([
      { $group: { _id: '$platform', count: { $sum: 1 }, totalFollowers: { $sum: '$followerCount' } } },
      { $sort: { count: -1 } }
    ]);
    
    platformStats.forEach(stat => {
      console.log(`   ${stat._id}: ${stat.count} حساب - ${stat.totalFollowers.toLocaleString()} متابع`);
    });

    // أفضل المحتويات (حسب المشاهدات)
    console.log('\n🏆 أفضل المحتويات (حسب المشاهدات):');
    const topContent = await SocialAnalytics.find()
      .populate('contentId', 'title contentType platform')
      .sort({ 'metrics.views': -1 })
      .limit(5);
    
    topContent.forEach((analytics, index) => {
      console.log(`   ${index + 1}. ${analytics.contentId.title}`);
      console.log(`      👀 ${analytics.metrics.views.toLocaleString()} مشاهدة`);
      console.log(`      🎯 ${analytics.contentId.contentType} على ${analytics.contentId.platform}`);
    });

    // إحصائيات الأداء العامة
    console.log('\n📈 إحصائيات الأداء العامة:');
    const overallStats = await SocialAnalytics.aggregate([
      {
        $group: {
          _id: null,
          totalViews: { $sum: '$metrics.views' },
          totalLikes: { $sum: '$metrics.likes' },
          totalComments: { $sum: '$metrics.comments' },
          totalShares: { $sum: '$metrics.shares' },
          totalEngagement: { $sum: '$metrics.engagement' },
          avgViews: { $avg: '$metrics.views' },
          avgLikes: { $avg: '$metrics.likes' }
        }
      }
    ]);

    if (overallStats.length > 0) {
      const stats = overallStats[0];
      console.log(`   👀 إجمالي المشاهدات: ${stats.totalViews.toLocaleString()}`);
      console.log(`   ❤️ إجمالي الإعجابات: ${stats.totalLikes.toLocaleString()}`);
      console.log(`   💬 إجمالي التعليقات: ${stats.totalComments.toLocaleString()}`);
      console.log(`   🔄 إجمالي المشاركات: ${stats.totalShares.toLocaleString()}`);
      console.log(`   📊 إجمالي التفاعل: ${stats.totalEngagement.toLocaleString()}`);
      console.log(`   📊 متوسط المشاهدات: ${Math.round(stats.avgViews).toLocaleString()}`);
      console.log(`   💖 متوسط الإعجابات: ${Math.round(stats.avgLikes).toLocaleString()}`);
    }

    console.log('\n🎉 تم فحص قاعدة البيانات بنجاح!');
    console.log('🌐 يمكنك الآن استخدام GraphQL Playground: http://localhost:4000/graphql');
    
  } catch (error) {
    console.error('❌ خطأ في فحص قاعدة البيانات:', error);
  } finally {
    await mongoose.disconnect();
    console.log('🔌 تم قطع الاتصال بقاعدة البيانات');
    process.exit(0);
  }
}

testDatabaseContent(); 