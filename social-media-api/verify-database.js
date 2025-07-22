const mongoose = require('mongoose');
const { User } = require('./src/models/User');
const { SocialConnection, SocialContent, SocialAnalytics } = require('./src/models/SocialMediaModels');

const MONGODB_URI = 'mongodb+srv://abdulrahman:201621623An@ac-hg1kzhy.icjtx3t.mongodb.net/socialApi';

async function verifyDatabase() {
  try {
    console.log('🔍 التحقق من البيانات في قاعدة البيانات...');
    console.log('='.repeat(60));
    
    await mongoose.connect(MONGODB_URI);
    console.log('✅ متصل بقاعدة البيانات: socialApi');
    
    // عد البيانات
    const userCount = await User.countDocuments();
    const connectionCount = await SocialConnection.countDocuments();
    const contentCount = await SocialContent.countDocuments();
    const analyticsCount = await SocialAnalytics.countDocuments();
    
    console.log('\n📊 إحصائيات البيانات الفعلية:');
    console.log(`👥 المستخدمين: ${userCount}/50 ${userCount >= 50 ? '✅' : '❌'}`);
    console.log(`🔗 الاتصالات: ${connectionCount}/50 ${connectionCount >= 50 ? '✅' : '❌'}`);
    console.log(`📱 المحتوى: ${contentCount}/50 ${contentCount >= 50 ? '✅' : '❌'}`);
    console.log(`📊 التحليلات: ${analyticsCount}/50 ${analyticsCount >= 50 ? '✅' : '❌'}`);
    
    const totalItems = userCount + connectionCount + contentCount + analyticsCount;
    const completionPercentage = (totalItems / 200) * 100;
    
    console.log(`\n🎯 نسبة الاكتمال: ${completionPercentage.toFixed(1)}%`);
    
    if (completionPercentage >= 100) {
      console.log('🎉 ممتاز! جميع البيانات مكتملة');
    } else if (completionPercentage >= 75) {
      console.log('👍 جيد جداً! معظم البيانات مكتملة');
    } else {
      console.log('⚠️ يحتاج إلى مزيد من البيانات');
    }
    
    // عينات من البيانات
    if (userCount > 0) {
      console.log('\n👤 عينة مستخدم:');
      const sampleUser = await User.findOne();
      console.log(`   📧 ${sampleUser.email}`);
      console.log(`   📝 ${sampleUser.name}`);
      console.log(`   🎭 ${sampleUser.role}`);
    }
    
    if (connectionCount > 0) {
      console.log('\n🔗 عينة اتصال:');
      const sampleConnection = await SocialConnection.findOne().populate('userId', 'name');
      console.log(`   📱 ${sampleConnection.platform}`);
      console.log(`   👤 ${sampleConnection.platformAccountName}`);
      console.log(`   👥 ${sampleConnection.followerCount.toLocaleString()} متابع`);
      if (sampleConnection.userId) {
        console.log(`   👨‍💼 ${sampleConnection.userId.name}`);
      }
      if (sampleConnection.platformAccountProfilePicture) {
        console.log(`   🖼️ ${sampleConnection.platformAccountProfilePicture}`);
      }
    }
    
    if (contentCount > 0) {
      console.log('\n📱 عينة محتوى:');
      const sampleContent = await SocialContent.findOne().populate('connection', 'platform platformAccountName');
      console.log(`   📋 ${sampleContent.title}`);
      console.log(`   🎯 ${sampleContent.contentType}`);
      console.log(`   📺 ${sampleContent.connection.platform}`);
      if (sampleContent.mediaFiles && sampleContent.mediaFiles.length > 0) {
        console.log(`   🎬 ${sampleContent.mediaFiles[0]}`);
      }
      if (sampleContent.hashtags && sampleContent.hashtags.length > 0) {
        console.log(`   🏷️ ${sampleContent.hashtags.join(', ')}`);
      }
    }
    
    if (analyticsCount > 0) {
      console.log('\n📊 عينة تحليل:');
      const sampleAnalytics = await SocialAnalytics.findOne().populate('contentId', 'title');
      console.log(`   📋 ${sampleAnalytics.contentId.title}`);
      console.log(`   👀 ${sampleAnalytics.metrics.views.toLocaleString()} مشاهدة`);
      console.log(`   ❤️ ${sampleAnalytics.metrics.likes.toLocaleString()} إعجاب`);
      console.log(`   💬 ${sampleAnalytics.metrics.comments.toLocaleString()} تعليق`);
    }
    
    // إحصائيات إضافية
    if (connectionCount > 0) {
      console.log('\n📱 توزيع المنصات:');
      const platformStats = await SocialConnection.aggregate([
        { $group: { _id: '$platform', count: { $sum: 1 } } },
        { $sort: { count: -1 } }
      ]);
      
      platformStats.forEach(stat => {
        console.log(`   ${stat._id}: ${stat.count} اتصال`);
      });
    }
    
    if (analyticsCount > 0) {
      console.log('\n📈 إحصائيات الأداء الإجمالية:');
      const performanceStats = await SocialAnalytics.aggregate([
        {
          $group: {
            _id: null,
            totalViews: { $sum: '$metrics.views' },
            totalLikes: { $sum: '$metrics.likes' },
            totalComments: { $sum: '$metrics.comments' },
            avgViews: { $avg: '$metrics.views' }
          }
        }
      ]);
      
      if (performanceStats.length > 0) {
        const stats = performanceStats[0];
        console.log(`   👀 إجمالي المشاهدات: ${stats.totalViews.toLocaleString()}`);
        console.log(`   ❤️ إجمالي الإعجابات: ${stats.totalLikes.toLocaleString()}`);
        console.log(`   💬 إجمالي التعليقات: ${stats.totalComments.toLocaleString()}`);
        console.log(`   📊 متوسط المشاهدات: ${Math.round(stats.avgViews).toLocaleString()}`);
      }
    }
    
    // روابط مباشرة
    if (contentCount > 0) {
      console.log('\n🔗 عينات روابط مباشرة:');
      const contentWithMedia = await SocialContent.find({
        mediaFiles: { $exists: true, $ne: [] }
      }).limit(5);
      
      contentWithMedia.forEach((content, index) => {
        console.log(`   ${index + 1}. ${content.title}`);
        console.log(`      🎬 ${content.mediaFiles[0]}`);
      });
    }
    
    console.log('\n' + '='.repeat(60));
    if (totalItems >= 200) {
      console.log('🎉 البيانات محملة بالكامل! يمكنك الآن:');
      console.log('   📊 تشغيل السيرفر: npm start');
      console.log('   🌐 فتح GraphQL Playground: http://localhost:4000/graphql');
      console.log('   🔍 اختبار الاستعلامات والطفرات');
      console.log('   📱 استكشاف العلاقات بين البيانات');
    } else {
      console.log('⚠️ البيانات غير مكتملة. شغل script التحميل مرة أخرى');
    }
    
  } catch (error) {
    console.error('❌ خطأ في التحقق من البيانات:', error);
  } finally {
    await mongoose.disconnect();
    console.log('\n🔌 تم قطع الاتصال');
    process.exit(0);
  }
}

verifyDatabase(); 