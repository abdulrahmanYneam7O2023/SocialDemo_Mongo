const mongoose = require('mongoose');

async function checkIndexes() {
  try {
    const MONGODB_URI = 'mongodb+srv://abdulrahman:201621623An@ac-hg1kzhy.icjtx3t.mongodb.net/socialApi';
    
    console.log('🔗 Connecting to MongoDB...');
    await mongoose.connect(MONGODB_URI);
    console.log('✅ Connected to MongoDB Atlas');

    const db = mongoose.connection.db;
    const collection = db.collection('socialConnections');
    
    console.log('\n📋 Current indexes in socialConnections:');
    const indexes = await collection.listIndexes().toArray();
    indexes.forEach(index => {
      console.log(`   - ${index.name}:`);
      console.log(`     Key: ${JSON.stringify(index.key)}`);
      console.log(`     Unique: ${index.unique || false}`);
      console.log('');
    });

    console.log('🧪 Testing a simple insert...');
    try {
      const testDoc = {
        platform: 'INSTAGRAM',
        platformAccountName: 'test_account_simple',
        tenant: 'default',
        connectionStatus: 'ACTIVE',
        createdAt: new Date()
      };
      
      const result = await collection.insertOne(testDoc);
      console.log('✅ Simple insert successful:', result.insertedId);
      
      // Clean up the test doc
      await collection.deleteOne({ _id: result.insertedId });
      console.log('🧹 Test document cleaned up');
      
    } catch (insertError) {
      console.log('❌ Insert failed:', insertError.message);
    }

    await mongoose.disconnect();
    console.log('\n🔌 Disconnected from MongoDB');
  } catch (error) {
    console.error('❌ Error:', error.message);
  }
}

checkIndexes(); 