const mongoose = require('mongoose');

async function dropSpecificIndex() {
  try {
    const MONGODB_URI = 'mongodb+srv://abdulrahman:201621623An@ac-hg1kzhy.icjtx3t.mongodb.net/socialApi';
    
    console.log('🔗 Connecting to MongoDB...');
    await mongoose.connect(MONGODB_URI);
    console.log('✅ Connected to MongoDB Atlas');

    const db = mongoose.connection.db;
    const collection = db.collection('socialConnections');
    
    console.log('\n🗑️ Dropping the problematic unique index...');
    try {
      await collection.dropIndex('tenant_1_platform_1_platformAccountId_1');
      console.log('✅ Successfully dropped tenant_1_platform_1_platformAccountId_1 index');
    } catch (error) {
      console.log('❌ Failed to drop index:', error.message);
    }

    console.log('\n📋 Remaining indexes:');
    const indexes = await collection.listIndexes().toArray();
    indexes.forEach(index => {
      console.log(`   - ${index.name}: ${JSON.stringify(index.key)} ${index.unique ? '(UNIQUE)' : ''}`);
    });

    console.log('\n🧪 Testing insert after dropping index...');
    try {
      const testDoc = {
        platform: 'INSTAGRAM',
        platformAccountName: 'test_account_after_drop',
        tenant: 'default',
        connectionStatus: 'ACTIVE',
        createdAt: new Date()
      };
      
      const result = await collection.insertOne(testDoc);
      console.log('✅ Insert successful after dropping index:', result.insertedId);
      
      // Clean up
      await collection.deleteOne({ _id: result.insertedId });
      console.log('🧹 Test document cleaned up');
      
    } catch (insertError) {
      console.log('❌ Insert still failed:', insertError.message);
    }

    await mongoose.disconnect();
    console.log('\n🔌 Disconnected from MongoDB');
    console.log('✅ Index removal completed!');
  } catch (error) {
    console.error('❌ Error:', error.message);
  }
}

dropSpecificIndex(); 