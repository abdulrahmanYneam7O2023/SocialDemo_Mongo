const mongoose = require('mongoose');

async function cleanDatabase() {
  try {
    const MONGODB_URI = 'mongodb+srv://abdulrahman:201621623An@ac-hg1kzhy.icjtx3t.mongodb.net/socialApi';
    
    console.log('🔗 Connecting to MongoDB...');
    await mongoose.connect(MONGODB_URI);
    console.log('✅ Connected to MongoDB Atlas');

    const db = mongoose.connection.db;
    
    // List all collections
    console.log('\n📋 Current collections:');
    const collections = await db.listCollections().toArray();
    collections.forEach(col => {
      console.log(`   - ${col.name}`);
    });

    // Clean SocialConnections collection
    console.log('\n🧹 Cleaning SocialConnections...');
    const socialConnections = db.collection('socialconnections');
    const deleteResult = await socialConnections.deleteMany({});
    console.log(`✅ Deleted ${deleteResult.deletedCount} social connections`);

    // Drop any problematic indexes
    console.log('\n🗑️ Dropping indexes...');
    try {
      await socialConnections.dropIndexes();
      console.log('✅ Dropped all indexes from socialconnections');
    } catch (error) {
      console.log('⚠️ No indexes to drop:', error.message);
    }

    // Clean SocialContent collection if exists
    try {
      console.log('\n🧹 Cleaning SocialContent...');
      const socialContent = db.collection('socialcontents');
      const contentDeleteResult = await socialContent.deleteMany({});
      console.log(`✅ Deleted ${contentDeleteResult.deletedCount} social content records`);
    } catch (error) {
      console.log('⚠️ SocialContent collection might not exist');
    }

    await mongoose.disconnect();
    console.log('\n🔌 Disconnected from MongoDB');
    console.log('✅ Database cleanup completed! Ready for fresh testing.');
  } catch (error) {
    console.error('❌ Error:', error.message);
  }
}

cleanDatabase(); 