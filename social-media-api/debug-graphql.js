const fetch = require('node-fetch');

async function testGraphQL() {
  const url = 'http://localhost:4000/graphql';
  
  // Test 1: Simple introspection
  console.log('🔍 Test 1: Simple GraphQL Introspection...');
  try {
    const response1 = await fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ query: '{ __typename }' })
    });
    
    const result1 = await response1.json();
    console.log('✅ Simple introspection:', JSON.stringify(result1, null, 2));
  } catch (error) {
    console.error('❌ Simple introspection failed:', error.message);
  }

  // Test 2: Schema types
  console.log('\n🔍 Test 2: Schema Types...');
  try {
    const response2 = await fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ 
        query: '{ __schema { queryType { name } mutationType { name } } }' 
      })
    });
    
    const result2 = await response2.json();
    console.log('✅ Schema types:', JSON.stringify(result2, null, 2));
  } catch (error) {
    console.error('❌ Schema types failed:', error.message);
  }

  // Test 3: Available Models (our custom query)
  console.log('\n🔍 Test 3: Available Models...');
  try {
    const response3 = await fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ 
        query: '{ availableModels { success totalModels } }' 
      })
    });
    
    const result3 = await response3.json();
    console.log('✅ Available models:', JSON.stringify(result3, null, 2));
  } catch (error) {
    console.error('❌ Available models failed:', error.message);
  }
}

testGraphQL(); 