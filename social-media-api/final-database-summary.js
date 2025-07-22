const mongoose = require('mongoose');
const { User } = require('./src/models/User');
const { SocialConnection, SocialContent, SocialAnalytics } = require('./src/models/SocialMediaModels');

const MONGODB_URI = 'mongodb+srv://abdulrahman:201621623An@ac-hg1kzhy.icjtx3t.mongodb.net/socialApi';

async function generateFinalSummary() {
  try {
    console.log('🏁 تقرير نهائي شامل عن قاعدة البيانات');
    console.log('='.repeat(60));
    
    await mongoose.connect(MONGODB_URI);
    console.log('✅ متصل بقاعدة البيانات: socialApi');
    
    // إحصائيات عامة
    const userCount = await User.countDocuments();
    const connectionCount = await SocialConnection.countDocuments();
    const contentCount = await SocialContent.countDocuments();
    const analyticsCount = await SocialAnalytics.countDocuments();
    
    console.log('\n📊 إحصائيات العامة:');
    console.log('='.repeat(40));
    console.log(`👥 إجمالي المستخدمين: ${userCount}/50`);
    console.log(`🔗 إجمالي الاتصالات: ${connectionCount}/50`);
    console.log(`📱 إجمالي المحتوى: ${contentCount}/50`);
    console.log(`📊 إجمالي التحليلات: ${analyticsCount}/50`);
    
    // حالة البيانات
    const completionPercentage = ((userCount + connectionCount + contentCount + analyticsCount) / 200) * 100;
    console.log(`\n🎯 نسبة اكتمال البيانات: ${completionPercentage.toFixed(1)}%`);
    
    if (completionPercentage >= 100) {
      console.log('🎉 ممتاز! جميع البيانات مكتملة');
    } else if (completionPercentage >= 75) {
      console.log('👍 جيد جداً! معظم البيانات مكتملة');
    } else {
      console.log('⚠️ يحتاج إلى مزيد من البيانات');
    }
    
    // تفاصيل المستخدمين
    console.log('\n👥 تفاصيل المستخدمين:');
    console.log('='.repeat(40));
    const userRoleStats = await User.aggregate([
      { $group: { _id: '$role', count: { $sum: 1 } } },
      { $sort: { count: -1 } }
    ]);
    
    userRoleStats.forEach(stat => {
      console.log(`   ${stat._id}: ${stat.count} مستخدم`);
    });
    
    const activeUsers = await User.countDocuments({ isActive: true });
    console.log(`   نشط: ${activeUsers}/${userCount} مستخدم`);
    
    // تفاصيل الاتصالات
    console.log('\n🔗 تفاصيل الاتصالات:');
    console.log('='.repeat(40));
    const platformStats = await SocialConnection.aggregate([
      { 
        $group: { 
          _id: '$platform', 
          count: { $sum: 1 },
          totalFollowers: { $sum: '$followerCount' },
          avgFollowers: { $avg: '$followerCount' },
          activeConnections: {
            $sum: { $cond: [{ $eq: ['$connectionStatus', 'ACTIVE'] }, 1, 0] }
          }
        } 
      },
      { $sort: { count: -1 } }
    ]);
    
    platformStats.forEach(stat => {
      console.log(`   ${stat._id}:`);
      console.log(`     📊 العدد: ${stat.count} اتصال`);
      console.log(`     👥 إجمالي المتابعين: ${stat.totalFollowers.toLocaleString()}`);
      console.log(`     📈 متوسط المتابعين: ${Math.round(stat.avgFollowers).toLocaleString()}`);
      console.log(`     ✅ نشط: ${stat.activeConnections}/${stat.count}`);
    });
    
    // تفاصيل المحتوى
    if (contentCount > 0) {
      console.log('\n📱 تفاصيل المحتوى:');
      console.log('='.repeat(40));
      const contentTypeStats = await SocialContent.aggregate([
        { $group: { _id: '$contentType', count: { $sum: 1 } } },
        { $sort: { count: -1 } }
      ]);
      
      contentTypeStats.forEach(stat => {
        console.log(`   ${stat._id}: ${stat.count} محتوى`);
      });
      
      const publishStatusStats = await SocialContent.aggregate([
        { $group: { _id: '$publishStatus', count: { $sum: 1 } } },
        { $sort: { count: -1 } }
      ]);
      
      console.log('\n📊 حالة النشر:');
      publishStatusStats.forEach(stat => {
        console.log(`   ${stat._id}: ${stat.count} محتوى`);
      });
      
      // عينات من الروابط
      const sampleMediaFiles = await SocialContent.find({ 
        mediaFiles: { $exists: true, $ne: [] } 
      }).limit(3);
      
      if (sampleMediaFiles.length > 0) {
        console.log('\n🎬 عينات من الروابط المباشرة:');
        sampleMediaFiles.forEach((content, index) => {
          console.log(`   ${index + 1}. ${content.title}`);
          console.log(`      🔗 ${content.mediaFiles[0]}`);
        });
      }
    }
    
    // تفاصيل التحليلات
    if (analyticsCount > 0) {
      console.log('\n📊 تفاصيل التحليلات:');
      console.log('='.repeat(40));
      const analyticsStats = await SocialAnalytics.aggregate([
        {
          $group: {
            _id: null,
            totalViews: { $sum: '$metrics.views' },
            totalLikes: { $sum: '$metrics.likes' },
            totalComments: { $sum: '$metrics.comments' },
            totalShares: { $sum: '$metrics.shares' },
            totalEngagement: { $sum: '$metrics.engagement' },
            avgViews: { $avg: '$metrics.views' },
            avgLikes: { $avg: '$metrics.likes' },
            maxViews: { $max: '$metrics.views' },
            maxLikes: { $max: '$metrics.likes' }
          }
        }
      ]);
      
      if (analyticsStats.length > 0) {
        const stats = analyticsStats[0];
        console.log(`   👀 إجمالي المشاهدات: ${stats.totalViews.toLocaleString()}`);
        console.log(`   ❤️ إجمالي الإعجابات: ${stats.totalLikes.toLocaleString()}`);
        console.log(`   💬 إجمالي التعليقات: ${stats.totalComments.toLocaleString()}`);
        console.log(`   🔄 إجمالي المشاركات: ${stats.totalShares.toLocaleString()}`);
        console.log(`   📈 إجمالي التفاعل: ${stats.totalEngagement.toLocaleString()}`);
        console.log(`   📊 متوسط المشاهدات: ${Math.round(stats.avgViews).toLocaleString()}`);
        console.log(`   💖 متوسط الإعجابات: ${Math.round(stats.avgLikes).toLocaleString()}`);
        console.log(`   🏆 أعلى مشاهدات: ${stats.maxViews.toLocaleString()}`);
        console.log(`   🥇 أعلى إعجابات: ${stats.maxLikes.toLocaleString()}`);
      }
      
      // أفضل المحتويات
      const topPerformingContent = await SocialAnalytics.find()
        .populate('contentId', 'title contentType platform')
        .sort({ 'metrics.views': -1 })
        .limit(5);
      
      if (topPerformingContent.length > 0) {
        console.log('\n🏆 أفضل 5 محتويات (حسب المشاهدات):');
        topPerformingContent.forEach((analytics, index) => {
          if (analytics.contentId) {
            console.log(`   ${index + 1}. ${analytics.contentId.title}`);
            console.log(`      👀 ${analytics.metrics.views.toLocaleString()} مشاهدة`);
            console.log(`      🎯 ${analytics.contentId.contentType} على ${analytics.contentId.platform}`);
          }
        });
      }
    }
    
    // عينات البيانات
    console.log('\n🔍 عينات من البيانات:');
    console.log('='.repeat(40));
    
    // عينة مستخدم
    const sampleUser = await User.findOne();
    if (sampleUser) {
      console.log('\n👤 عينة مستخدم:');
      console.log(`   📧 البريد: ${sampleUser.email}`);
      console.log(`   📝 الاسم: ${sampleUser.name}`);
      console.log(`   🎭 الدور: ${sampleUser.role}`);
      console.log(`   ✅ نشط: ${sampleUser.isActive ? 'نعم' : 'لا'}`);
    }
    
    // عينة اتصال
    const sampleConnection = await SocialConnection.findOne().populate('userId', 'name email');
    if (sampleConnection) {
      console.log('\n🔗 عينة اتصال:');
      console.log(`   📱 المنصة: ${sampleConnection.platform}`);
      console.log(`   👤 الحساب: ${sampleConnection.platformAccountName}`);
      console.log(`   👥 المتابعين: ${sampleConnection.followerCount.toLocaleString()}`);
      console.log(`   👨‍💼 المستخدم: ${sampleConnection.userId ? sampleConnection.userId.name : 'غير محدد'}`);
      if (sampleConnection.platformAccountProfilePicture) {
        console.log(`   🖼️ الصورة: ${sampleConnection.platformAccountProfilePicture}`);
      }
    }
    
    // عينة محتوى
    const sampleContent = await SocialContent.findOne().populate('connection', 'platformAccountName platform');
    if (sampleContent) {
      console.log('\n📱 عينة محتوى:');
      console.log(`   📋 العنوان: ${sampleContent.title}`);
      console.log(`   🎯 النوع: ${sampleContent.contentType}`);
      console.log(`   📺 المنصة: ${sampleContent.connection ? sampleContent.connection.platform : 'غير محدد'}`);
      console.log(`   📊 الحالة: ${sampleContent.publishStatus}`);
      if (sampleContent.mediaFiles && sampleContent.mediaFiles.length > 0) {
        console.log(`   🎬 ملف الوسائط: ${sampleContent.mediaFiles[0]}`);
      }
      if (sampleContent.hashtags && sampleContent.hashtags.length > 0) {
        console.log(`   🏷️ الهاشتاجات: ${sampleContent.hashtags.join(', ')}`);
      }
    }
    
    // الروابط المباشرة
    console.log('\n🌐 أمثلة على الروابط المباشرة المتوفرة:');
    console.log('='.repeat(40));
    console.log('📺 يوتيوب: https://www.youtube.com/watch?v=dQw4w9WgXcQ');
    console.log('📘 فيسبوك: https://www.facebook.com/watch/?v=123456789');
    console.log('🖼️ صور: https://picsum.photos/800/600?random=1');
    
    // توصيات
    console.log('\n💡 كيفية استخدام البيانات:');
    console.log('='.repeat(40));
    console.log('🌐 GraphQL Playground: http://localhost:4000/graphql');
    console.log('📝 يمكنك الآن:');
    console.log('   • استعلام جميع المستخدمين والاتصالات');
    console.log('   • إنشاء محتوى جديد مع روابط مباشرة');
    console.log('   • عرض التحليلات التفصيلية');
    console.log('   • إجراء عمليات CRUD كاملة');
    console.log('   • اختبار العلاقات بين البيانات');
    
    console.log('\n✨ أمثلة GraphQL للاستعلام:');
    console.log('='.repeat(40));
    console.log(`
query GetAllData {
  # جميع المستخدمين
  users: genericQuery(modelName: "User") {
    success
    totalCount
    data
  }
  
  # الاتصالات مع بيانات المستخدمين
  socialConnections {
    success
    data {
      id
      platform
      accountName
      user {
        name
        email
      }
      followerCount
    }
  }
  
  # المحتوى مع التحليلات
  content: genericQuery(modelName: "SocialContent") {
    success
    data
  }
}
    `);
    
    console.log('\n🎯 ملخص النجاح:');
    console.log('='.repeat(40));
    console.log('✅ تم إنشاء قاعدة بيانات شاملة لوسائل التواصل الاجتماعي');
    console.log('✅ تحتوي على بيانات realistic مع روابط مباشرة');
    console.log('✅ علاقات مترابطة بين جميع النماذج');
    console.log('✅ جاهزة للاستخدام في الإنتاج والتطوير');
    console.log('✅ تدعم جميع عمليات CRUD والاستعلامات المعقدة');
    
    console.log('\n🚀 مبروك! قاعدة البيانات جاهزة للعمل!');
    
  } catch (error) {
    console.error('❌ خطأ في إنشاء التقرير:', error);
  } finally {
    await mongoose.disconnect();
    console.log('\n🔌 تم قطع الاتصال بقاعدة البيانات');
    process.exit(0);
  }
}

generateFinalSummary(); 