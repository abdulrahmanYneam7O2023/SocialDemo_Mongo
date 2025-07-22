const mongoose = require('mongoose');

async function clearIndexes() {
  try {
    const MONGODB_URI = 'mongodb+srv://abdulrahman:201621623An@ac-hg1kzhy.icjtx3t.mongodb.net/socialApi';
    
    console.log('🔗 Connecting to MongoDB...');
    await mongoose.connect(MONGODB_URI);
    console.log('✅ Connected to MongoDB Atlas');

    // Clear the problematic index
    const db = mongoose.connection.db;
    const collection = db.collection('socialconnections');
    
    console.log('📋 Current indexes:');
    const indexes = await collection.listIndexes().toArray();
    indexes.forEach(index => {
      console.log(`   - ${index.name}: ${JSON.stringify(index.key)}`);
    });

    console.log('\n🗑️ Dropping problematic index...');
    try {
      await collection.dropIndex('tenant_1_platform_1_platformAccountId_1');
      console.log('✅ Dropped problematic unique index');
    } catch (error) {
      console.log('⚠️ Index might not exist:', error.message);
    }

    console.log('\n📋 Remaining indexes:');
    const remainingIndexes = await collection.listIndexes().toArray();
    remainingIndexes.forEach(index => {
      console.log(`   - ${index.name}: ${JSON.stringify(index.key)}`);
    });

    await mongoose.disconnect();
    console.log('\n🔌 Disconnected from MongoDB');
    console.log('✅ Index cleanup completed!');
  } catch (error) {
    console.error('❌ Error:', error.message);
  }
}

clearIndexes(); 