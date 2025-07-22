const mongoose = require('mongoose');
const { SocialConnection, SocialContent, SocialAnalytics } = require('./src/models/SocialMediaModels');

const MONGODB_URI = 'mongodb+srv://abdulrahman:201621623An@ac-hg1kzhy.icjtx3t.mongodb.net/socialApi';

async function createContentOnly() {
  try {
    console.log('🚀 إنشاء المحتوى والتحليلات فقط...');
    
    await mongoose.connect(MONGODB_URI);
    console.log('✅ متصل بقاعدة البيانات');

    // البحث عن الاتصالات الموجودة
    const connections = await SocialConnection.find().limit(50);
    console.log(`🔗 وجدت ${connections.length} اتصال`);

    if (connections.length === 0) {
      throw new Error('لا توجد اتصالات');
    }

    // إنشاء 50 محتوى بسيط
    console.log('\n📱 إنشاء 50 محتوى...');
    
    const contents = [];
    for (let i = 0; i < 50; i++) {
      const connection = connections[i % connections.length];
      
      const content = await SocialContent.create({
        contentId: `simple_content_${i + 1}`,
        platform: connection.platform,
        contentType: 'POST',
        connection: connection._id,
        content: `محتوى تجريبي رقم ${i + 1}`,
        title: `عنوان المحتوى ${i + 1}`,
        description: `وصف المحتوى ${i + 1}`,
        hashtags: ['#تجربة', '#محتوى'],
        author: connection.userInfo ? connection.userInfo.name : 'مؤلف',
        mediaFiles: [{
          mediaType: 'IMAGE',
          url: `https://picsum.photos/800/600?random=${i + 1}`,
          thumbnailUrl: `https://picsum.photos/300/200?random=${i + 1}`
        }],
        publishStatus: 'PUBLISHED',
        tenant: 'default'
      });
      
      contents.push(content);
      
      if ((i + 1) % 10 === 0) {
        console.log(`✅ ${i + 1} محتوى`);
      }
    }

    console.log(`🎉 تم إنشاء ${contents.length} محتوى`);

    // إنشاء 50 تحليل بسيط
    console.log('\n📊 إنشاء 50 تحليل...');
    
    const analytics = [];
    for (let i = 0; i < 50; i++) {
      const content = contents[i];
      const connection = connections.find(c => c._id.toString() === content.connection.toString());
      
      const analytic = await SocialAnalytics.create({
        analyticsId: `simple_analytics_${i + 1}`,
        platform: content.platform,
        contentId: content._id,
        connectionId: connection._id,
        metrics: {
          views: Math.floor(Math.random() * 10000) + 100,
          likes: Math.floor(Math.random() * 1000) + 10,
          comments: Math.floor(Math.random() * 200) + 5,
          shares: Math.floor(Math.random() * 100) + 1,
          engagement: Math.floor(Math.random() * 1500) + 50
        },
        tenant: 'default'
      });
      
      analytics.push(analytic);
      
      if ((i + 1) % 10 === 0) {
        console.log(`✅ ${i + 1} تحليل`);
      }
    }

    console.log(`🎉 تم إنشاء ${analytics.length} تحليل`);

    console.log('\n' + '='.repeat(50));
    console.log('🎉 نجح إنشاء البيانات!');
    console.log(`📱 المحتوى: ${contents.length}`);
    console.log(`📊 التحليلات: ${analytics.length}`);
    console.log('='.repeat(50));

  } catch (error) {
    console.error('❌ خطأ:', error);
  } finally {
    await mongoose.disconnect();
    console.log('🔌 تم قطع الاتصال');
    process.exit(0);
  }
}

createContentOnly(); 