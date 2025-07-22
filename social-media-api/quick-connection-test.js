require('dotenv').config();
const mongoose = require('mongoose');

async function quickTest() {
  try {
    // الـ username الصحيح: abdulrahman
    const MONGODB_URI = 'mongodb+srv://abdulrahman:201621623An@ac-hg1kzhy.icjtx3t.mongodb.net/socialApi?retryWrites=true&w=majority';
    
    console.log('🔗 جاري الاتصال بـ MongoDB Atlas مع الـ username الصحيح...');
    await mongoose.connect(MONGODB_URI);
    console.log('✅ متصل بـ MongoDB Atlas بنجاح!');
    console.log(`🗄️  Database: ${mongoose.connection.name}`);
    console.log(`📡 Host: ${mongoose.connection.host}`);
    console.log(`📊 Ready State: ${mongoose.connection.readyState}`);
    
    // اختبار البيانات
    const collections = await mongoose.connection.db.listCollections().toArray();
    console.log('\n📋 المجموعات المتاحة:');
    collections.forEach(col => {
      console.log(`   - ${col.name}`);
    });
    
    // اختبار عدد المستندات
    if (collections.find(c => c.name === 'socialcontents')) {
      const count = await mongoose.connection.db.collection('socialcontents').countDocuments();
      console.log(`\n📊 عدد المنشورات: ${count}`);
    }
    
    if (collections.find(c => c.name === 'users')) {
      const count = await mongoose.connection.db.collection('users').countDocuments();
      console.log(`👥 عدد المستخدمين: ${count}`);
    }
    
    // تجربة إدراج سجل تجريبي
    console.log('\n🧪 اختبار الكتابة...');
    const testCollection = mongoose.connection.db.collection('test');
    await testCollection.insertOne({ test: true, timestamp: new Date() });
    console.log('✅ تم اختبار الكتابة بنجاح');
    await testCollection.deleteOne({ test: true });
    console.log('✅ تم اختبار الحذف بنجاح');
    
    await mongoose.disconnect();
    console.log('\n🔌 تم قطع الاتصال بنجاح');
    console.log('\n🚀 جاهز لإعادة تشغيل الخادم مع Atlas!');
    
  } catch (error) {
    console.error('❌ خطأ في الاتصال:', error.message);
  }
}

quickTest(); 