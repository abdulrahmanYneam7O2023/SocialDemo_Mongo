const mongoose = require('mongoose');
const { User } = require('./src/models/User');
const { SocialConnection, SocialContent, SocialAnalytics } = require('./src/models/SocialMediaModels');

const MONGODB_URI = 'mongodb+srv://abdulrahman:201621623An@ac-hg1kzhy.icjtx3t.mongodb.net/socialApi';

async function simpleCheck() {
  try {
    await mongoose.connect(MONGODB_URI);
    
    const userCount = await User.countDocuments();
    const connectionCount = await SocialConnection.countDocuments();
    const contentCount = await SocialContent.countDocuments();
    const analyticsCount = await SocialAnalytics.countDocuments();
    
    console.log('📊 حالة قاعدة البيانات:');
    console.log(`👥 المستخدمين: ${userCount}`);
    console.log(`🔗 الاتصالات: ${connectionCount}`);
    console.log(`📱 المحتوى: ${contentCount}`);
    console.log(`📊 التحليلات: ${analyticsCount}`);
    console.log(`🎯 الإجمالي: ${userCount + connectionCount + contentCount + analyticsCount}/200`);
    
    if (contentCount === 0) {
      console.log('\n⚠️ المحتوى والتحليلات مفقودة - تحتاج إنشاء');
    } else {
      console.log('\n✅ جميع البيانات موجودة');
    }
    
  } catch (error) {
    console.error('❌ خطأ:', error);
  } finally {
    await mongoose.disconnect();
    process.exit(0);
  }
}

simpleCheck(); 