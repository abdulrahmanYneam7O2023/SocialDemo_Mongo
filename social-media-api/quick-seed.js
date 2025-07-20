const mongoose = require('mongoose');
const { SocialContent } = require('./src/models/SocialContent');
const { SocialAnalytics } = require('./src/models/SocialAnalytics');
const { User } = require('./src/models/User');

// البيانات الحقيقية
const users = [
  { username: 'ahmed_hassan', email: 'ahmed@example.com', password: 'password123' },
  { username: 'sara_mohamed', email: 'sara@example.com', password: 'password123' },
  { username: 'omar_ali', email: 'omar@example.com', password: 'password123' },
  { username: 'fatima_nour', email: 'fatima@example.com', password: 'password123' },
  { username: 'mohamed_adel', email: 'mohamed@example.com', password: 'password123' },
  { username: 'layla_ahmed', email: 'layla@example.com', password: 'password123' }
];

const posts = [
  {
    platform: 'Instagram', contentType: 'IMAGE',
    content: 'صباح الخير! قهوة الصباح مع منظر رائع ☕️🌅 #صباح_الخير #قهوة',
    author: 'ahmed_hassan', metrics: { likes: 245, comments: 18, shares: 5, views: 890 }
  },
  {
    platform: 'Instagram', contentType: 'REEL',
    content: 'طريقة تحضير كيك الشوكولاتة 🍰✨ #طبخ #حلويات #وصفات_منزلية',
    author: 'sara_mohamed', metrics: { likes: 1200, comments: 67, shares: 34, views: 5600 }
  },
  {
    platform: 'Twitter', contentType: 'TWEET',
    content: 'التعلم المستمر هو مفتاح النجاح في التكنولوجيا 🚀 #تعلم #تطوير #برمجة',
    author: 'omar_ali', metrics: { likes: 156, comments: 23, shares: 45, views: 890 }
  },
  {
    platform: 'LinkedIn', contentType: 'POST',
    content: 'تجربتي مع GraphQL وكيف غيرت تفكيري في APIs 📈⚡️ #GraphQL #API',
    author: 'fatima_nour', metrics: { likes: 89, comments: 12, shares: 15, views: 320 }
  },
  {
    platform: 'TikTok', contentType: 'VIDEO',
    content: 'تحدي البرمجة: كود JavaScript في دقيقة! 💨⚡️ #برمجة #تحدي #JavaScript',
    author: 'mohamed_adel', metrics: { likes: 1890, comments: 234, shares: 167, views: 12400 }
  },
  {
    platform: 'YouTube', contentType: 'VIDEO',
    content: 'دورة Node.js للمبتدئين - الحلقة الأولى 🎥📚 #NodeJS #تعليم #برمجة',
    author: 'ahmed_hassan', metrics: { likes: 234, comments: 45, shares: 12, views: 5600 }
  },
  {
    platform: 'Facebook', contentType: 'POST',
    content: 'احتفال بالتخرج! 🎓 رحلة 4 سنوات انتهت بنجاح والآن بداية رحلة جديدة في عالم العمل. شكراً لكل من دعمني 💙',
    author: 'sara_mohamed', metrics: { likes: 456, comments: 89, shares: 23, views: 1200 }
  },
  {
    platform: 'Twitter', contentType: 'TWEET',
    content: 'أفضل 5 نصائح للبرمجة: 1. اكتب كود نظيف 2. اختبر باستمرار 3. تعلم من الأخطاء 4. شارك المعرفة 5. مارس يومياً 💻 #نصائح_برمجة',
    author: 'mohamed_adel', metrics: { likes: 324, comments: 41, shares: 87, views: 1540 }
  }
];

async function loadData() {
  try {
    console.log('🌱 بدء تحميل البيانات...');
    
    // الاتصال بقاعدة البيانات
    await mongoose.connect('mongodb://localhost:27017/social-media-api', {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log('✅ متصل بقاعدة البيانات');
    
    // مسح البيانات القديمة
    await User.deleteMany({});
    await SocialContent.deleteMany({});
    await SocialAnalytics.deleteMany({});
    console.log('🗑️ تم مسح البيانات القديمة');
    
    // إنشاء المستخدمين
    console.log('👥 إنشاء المستخدمين...');
    const savedUsers = [];
    for (let userData of users) {
      const user = new User(userData);
      await user.save();
      savedUsers.push(user);
      console.log(`✅ تم إنشاء: ${user.username}`);
    }
    
    // إنشاء المنشورات
    console.log('📝 إنشاء المنشورات...');
    const savedPosts = [];
    for (let i = 0; i < posts.length; i++) {
      const postData = posts[i];
      const author = savedUsers.find(u => u.username === postData.author) || savedUsers[0];
      
      const post = new SocialContent({
        contentId: `post_${i + 1}`,
        platform: postData.platform,
        contentType: postData.contentType,
        content: postData.content,
        author: postData.author,
        status: 'PUBLISHED',
        createdAt: new Date(),
        createdBy: author._id,
        metrics: postData.metrics
      });
      
      await post.save();
      savedPosts.push(post);
      console.log(`✅ منشور: ${post.platform} - ${post.contentType}`);
    }
    
    // إنشاء التحليلات
    console.log('📊 إنشاء بيانات التحليلات...');
    for (let post of savedPosts) {
      const analytics = new SocialAnalytics({
        contentId: post.contentId,
        connectionId: `conn_${Math.random().toString(36).substring(7)}`,
        analyticsType: 'POST_ANALYTICS',
        platform: post.platform,
        periodType: 'DAILY',
        periodStart: new Date(Date.now() - 24 * 60 * 60 * 1000),
        periodEnd: new Date(),
        normalizedMetrics: {
          reach: Math.floor(post.metrics.views * 1.5),
          impressions: Math.floor(post.metrics.views * 2),
          engagement: post.metrics.likes + post.metrics.comments + post.metrics.shares,
          clicks: Math.floor(post.metrics.views * 0.05),
          shares: post.metrics.shares,
          saves: Math.floor(post.metrics.likes * 0.1),
          comments: post.metrics.comments,
          likes: post.metrics.likes
        },
        snapshotDate: new Date()
      });
      
      await analytics.save();
      console.log(`📊 تحليلات: ${post.platform} - ${post.contentId}`);
    }
    
    console.log('\n🎉 تم تحميل البيانات بنجاح!');
    console.log(`📊 النتائج:`);
    console.log(`   👥 المستخدمين: ${savedUsers.length}`);
    console.log(`   📝 المنشورات: ${savedPosts.length}`);
    console.log(`   📊 التحليلات: ${savedPosts.length}`);
    
    console.log('\n🔐 بيانات تسجيل الدخول:');
    savedUsers.forEach(user => {
      console.log(`   - ${user.email} / password123`);
    });
    
    console.log('\n🌐 يمكنك الآن اختبار GraphQL على: http://localhost:4000');
    
  } catch (error) {
    console.error('❌ خطأ:', error.message);
    if (error.message.includes('ECONNREFUSED')) {
      console.error('💡 تأكد من تشغيل MongoDB على المنفذ 27017');
    }
    if (error.message.includes('E11000')) {
      console.error('💡 البيانات موجودة بالفعل - تم تحديثها');
    }
  } finally {
    await mongoose.connection.close();
    console.log('🔌 تم إغلاق الاتصال');
  }
}

loadData(); 