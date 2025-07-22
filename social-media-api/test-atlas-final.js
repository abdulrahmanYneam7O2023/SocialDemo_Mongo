const fetch = require('node-fetch');

async function testAtlasIntegration() {
  console.log('🚀 Testing MongoDB Atlas Integration...\n');

  // Test 1: Homepage with Database Status
  console.log('1️⃣ Testing Homepage & Database Status...');
  try {
    const homeResponse = await fetch('http://localhost:4000');
    const homeData = await homeResponse.json();
    
    console.log('✅ Homepage works!');
    console.log(`   📊 Database: ${homeData.database?.name || 'unknown'}`);
    console.log(`   🔗 Connection: ${homeData.database?.state || 'unknown'}`);
    console.log(`   🌐 Status: ${homeData.status}`);
  } catch (error) {
    console.error('❌ Homepage Error:', error.message);
  }

  // Test 2: Available Models
  console.log('\n2️⃣ Testing Available Models...');
  try {
    const modelsResponse = await fetch('http://localhost:4000/graphql', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ 
        query: 'query { availableModels { success totalModels models { name description } } }' 
      })
    });
    
    const modelsData = await modelsResponse.json();
    
    if (modelsData.data?.availableModels?.success) {
      console.log('✅ Available Models working!');
      console.log(`   📋 Total Models: ${modelsData.data.availableModels.totalModels}`);
      
      modelsData.data.availableModels.models.forEach(model => {
        console.log(`   📄 ${model.name}: ${model.description}`);
      });
    } else {
      console.log('❌ Available Models failed:', JSON.stringify(modelsData, null, 2));
    }
  } catch (error) {
    console.error('❌ Available Models Error:', error.message);
  }

  // Test 3: Generic Query
  console.log('\n3️⃣ Testing Generic Query...');
  try {
    const queryResponse = await fetch('http://localhost:4000/graphql', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ 
        query: 'query { genericQuery(modelName: "SocialContent", pagination: { type: offset, limit: 3 }) { success totalCount data pageInfo { hasNextPage } } }' 
      })
    });
    
    const queryData = await queryResponse.json();
    
    if (queryData.data?.genericQuery?.success) {
      console.log('✅ Generic Query working!');
      console.log(`   📊 Total Records: ${queryData.data.genericQuery.totalCount}`);
      console.log(`   📄 Has Next Page: ${queryData.data.genericQuery.pageInfo.hasNextPage}`);
      
      // Parse data to see actual content
      try {
        const parsedData = JSON.parse(queryData.data.genericQuery.data);
        console.log(`   🗂️ Retrieved ${parsedData.length} records`);
      } catch (e) {
        console.log('   📝 Data format:', typeof queryData.data.genericQuery.data);
      }
    } else {
      console.log('❌ Generic Query failed:', JSON.stringify(queryData, null, 2));
    }
  } catch (error) {
    console.error('❌ Generic Query Error:', error.message);
  }

  // Test 4: Schema Introspection
  console.log('\n4️⃣ Testing Schema Introspection...');
  try {
    const schemaResponse = await fetch('http://localhost:4000/graphql', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ 
        query: 'query { __schema { queryType { name } mutationType { name } types { name } } }' 
      })
    });
    
    const schemaData = await schemaResponse.json();
    
    if (schemaData.data?.__schema) {
      console.log('✅ Schema Introspection working!');
      console.log(`   🔍 Query Type: ${schemaData.data.__schema.queryType.name}`);
      console.log(`   🔧 Mutation Type: ${schemaData.data.__schema.mutationType?.name || 'None'}`);
      console.log(`   📋 Total Types: ${schemaData.data.__schema.types.length}`);
    } else {
      console.log('❌ Schema Introspection failed:', JSON.stringify(schemaData, null, 2));
    }
  } catch (error) {
    console.error('❌ Schema Introspection Error:', error.message);
  }

  // Final Summary
  console.log('\n🎉 Atlas Integration Test Complete!');
  console.log('🌐 Access Points:');
  console.log('   📊 Homepage: http://localhost:4000');
  console.log('   🎮 GraphQL Playground: http://localhost:4000/graphql');
  console.log('   🗄️ Database: MongoDB Atlas (socialApi)');
}

testAtlasIntegration(); 