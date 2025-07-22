const mongoose = require('mongoose');

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

// موديلات بسيطة للتحقق
const userSchema = new mongoose.Schema({}, { strict: false });
const socialContentSchema = new mongoose.Schema({}, { strict: false });
const socialAnalyticsSchema = new mongoose.Schema({}, { strict: false });

const User = mongoose.model('User', userSchema);
const SocialContent = mongoose.model('SocialContent', socialContentSchema);
const SocialAnalytics = mongoose.model('SocialAnalytics', socialAnalyticsSchema);


const checkDatabase = async () => {
  try {
    console.log('🔍 فحص قاعدة البيانات...\n');

    // عد المستخدمين
    const usersCount = await User.countDocuments();
    console.log(`👥 عدد المستخدمين: ${usersCount}`);

    // عد المنشورات
    const postsCount = await SocialContent.countDocuments();
    console.log(`📝 عدد المنشورات: ${postsCount}`);

    // عد التحليلات
    const analyticsCount = await SocialAnalytics.countDocuments();
    console.log(`📊 عدد التحليلات: ${analyticsCount}`);

    // إحصائيات المنصات
    console.log('\n🌐 توزيع المنشورات حسب المنصة:');
    const platformStats = await SocialContent.aggregate([
      { $group: { _id: '$platform', count: { $sum: 1 } } },
      { $sort: { count: -1 } }
    ]);
    
    platformStats.forEach(stat => {
      console.log(`   ${stat._id}: ${stat.count} منشور`);
    });

    // إحصائيات أنواع المحتوى
    console.log('\n📱 توزيع أنواع المحتوى:');
    const contentTypeStats = await SocialContent.aggregate([
      { $group: { _id: '$contentType', count: { $sum: 1 } } },
      { $sort: { count: -1 } }
    ]);
    
    contentTypeStats.forEach(stat => {
      console.log(`   ${stat._id}: ${stat.count} عنصر`);
    });

    // إحصائيات التفاعل
    console.log('\n💫 إحصائيات التفاعل:');
    const engagementStats = await SocialContent.aggregate([
      {
        $group: {
          _id: null,
          totalLikes: { $sum: '$metrics.likes' },
          totalComments: { $sum: '$metrics.comments' },
          totalShares: { $sum: '$metrics.shares' },
          totalViews: { $sum: '$metrics.views' },
          avgLikes: { $avg: '$metrics.likes' },
          maxLikes: { $max: '$metrics.likes' }
        }
      }
    ]);

    if (engagementStats.length > 0) {
      const stats = engagementStats[0];
      console.log(`   👍 إجمالي الإعجابات: ${stats.totalLikes?.toLocaleString() || 0}`);
      console.log(`   💬 إجمالي التعليقات: ${stats.totalComments?.toLocaleString() || 0}`);
      console.log(`   🔄 إجمالي المشاركات: ${stats.totalShares?.toLocaleString() || 0}`);
      console.log(`   👁️ إجمالي المشاهدات: ${stats.totalViews?.toLocaleString() || 0}`);
      console.log(`   📊 متوسط الإعجابات: ${Math.round(stats.avgLikes || 0)}`);
      console.log(`   🏆 أعلى إعجابات: ${stats.maxLikes?.toLocaleString() || 0}`);
    }

    // المستخدمين المحققين
    const verifiedUsersCount = await User.countDocuments({ isVerified: true });
    console.log(`\n✅ المستخدمين المحققين: ${verifiedUsersCount}`);

    // أحدث المنشورات
    console.log('\n🕒 أحدث 5 منشورات:');
    const latestPosts = await SocialContent.find({})
      .populate('createdBy', 'username')
      .sort({ createdAt: -1 })
      .limit(5)
      .select('platform contentType content author createdAt');

    latestPosts.forEach((post, index) => {
      const content = post.content ? post.content.substring(0, 50) + '...' : 'بدون محتوى';
      console.log(`   ${index + 1}. [${post.platform}] ${content}`);
    });

    console.log('\n🎉 فحص قاعدة البيانات مكتمل!');
    
    // تحديد ما إذا كان لدينا بيانات كافية
    const hasEnoughData = usersCount >= 50 && postsCount >= 50 && analyticsCount >= 50;
    if (hasEnoughData) {
      console.log('✅ قاعدة البيانات تحتوي على بيانات كافية للاختبار');
    } else {
      console.log('⚠️  قاعدة البيانات تحتاج المزيد من البيانات');
    }

  } catch (error) {
    console.error('❌ خطأ في فحص قاعدة البيانات:', error);
  } finally {
    await mongoose.connection.close();
    console.log('\n🔌 تم قطع الاتصال بقاعدة البيانات');
    process.exit(0);
  }
};

// تشغيل الفحص
connectDB().then(() => {
  checkDatabase();
}); 