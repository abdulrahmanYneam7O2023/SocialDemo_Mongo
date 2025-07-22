const mongoose = require('mongoose');
const { User } = require('./src/models/User');
const { SocialConnection, SocialContent, SocialAnalytics } = require('./src/models/SocialMediaModels');

const MONGODB_URI = 'mongodb+srv://abdulrahman:201621623An@ac-hg1kzhy.icjtx3t.mongodb.net/socialApi';

async function quickCheck() {
  try {
    await mongoose.connect(MONGODB_URI);
    
    const userCount = await User.countDocuments();
    const connectionCount = await SocialConnection.countDocuments();
    const contentCount = await SocialContent.countDocuments();
    const analyticsCount = await SocialAnalytics.countDocuments();
    
    console.log('📊 إحصائيات سريعة:');
    console.log(`👥 المستخدمين: ${userCount}`);
    console.log(`🔗 الاتصالات: ${connectionCount}`);
    console.log(`📱 المحتوى: ${contentCount}`);
    console.log(`📊 التحليلات: ${analyticsCount}`);
    
    if (userCount >= 50 && connectionCount >= 50 && contentCount >= 50 && analyticsCount >= 50) {
      console.log('✅ جميع البيانات تم رفعها بنجاح!');
    } else {
      console.log('⚠️ بعض البيانات ناقصة');
    }
    
    // عينة من المحتوى
    const sampleContent = await SocialContent.findOne();
    if (sampleContent) {
      console.log('\n📱 عينة محتوى:');
      console.log(`العنوان: ${sampleContent.title}`);
      console.log(`النوع: ${sampleContent.contentType}`);
      console.log(`الروابط: ${sampleContent.mediaFiles ? sampleContent.mediaFiles.length : 0}`);
    }
    
    // عينة من التحليلات
    const sampleAnalytics = await SocialAnalytics.findOne();
    if (sampleAnalytics) {
      console.log('\n📊 عينة تحليلات:');
      console.log(`المشاهدات: ${sampleAnalytics.metrics?.views || 0}`);
      console.log(`الإعجابات: ${sampleAnalytics.metrics?.likes || 0}`);
    }
    
  } catch (error) {
    console.error('❌ خطأ:', error);
  } finally {
    await mongoose.disconnect();
    process.exit(0);
  }
}

quickCheck(); 