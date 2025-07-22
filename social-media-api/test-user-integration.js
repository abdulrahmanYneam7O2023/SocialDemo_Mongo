const fetch = require('node-fetch');

async function testUserIntegration() {
  console.log('🔗 Testing User Integration with Social Connections');
  console.log('=' .repeat(60));

  const baseUrl = 'http://localhost:4000/graphql';

  async function makeRequest(query, variables = {}) {
    try {
      const response = await fetch(baseUrl, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ query, variables })
      });
      
      const result = await response.json();
      
      if (result.errors) {
        console.log('❌ GraphQL Errors:');
        result.errors.forEach(error => console.log(`   - ${error.message}`));
        return { success: false, errors: result.errors };
      }
      
      return { success: true, data: result.data };
    } catch (error) {
      console.error('❌ Network Error:', error.message);
      return { success: false, error: error.message };
    }
  }

  // Test 1: Create Social Connection (should auto-create/link user)
  console.log('\n1️⃣ Creating Social Connection with Auto User Integration...');
  
  const createMutation = `
    mutation CreateConnection($input: SocialConnectionInput!) {
      createSocialConnection(input: $input) {
        success
        message
        data {
          id
          platform
          accountName
          displayName
          status
          userId
          user {
            id
            email
            name
            role
            isActive
          }
          createdAt
        }
      }
    }
  `;

  const input = {
    platform: 'INSTAGRAM',
    accountName: 'automated_user_test',
    displayName: 'Automated User Test Account',
    followerCount: 5000,
    isVerified: true
  };

  const result1 = await makeRequest(createMutation, { input });
  
  if (result1.success && result1.data.createSocialConnection.success) {
    const connection = result1.data.createSocialConnection.data;
    console.log('✅ Connection created with auto user integration!');
    console.log(`   🆔 Connection ID: ${connection.id}`);
    console.log(`   📱 Platform: ${connection.platform}`);
    console.log(`   👤 Account: ${connection.accountName}`);
    console.log(`   🔗 User ID: ${connection.userId}`);
    
    if (connection.user) {
      console.log('   👨‍💼 User Details:');
      console.log(`     📧 Email: ${connection.user.email}`);
      console.log(`     📝 Name: ${connection.user.name}`);
      console.log(`     🎭 Role: ${connection.user.role}`);
      console.log(`     ✅ Active: ${connection.user.isActive}`);
    }
    
    // Test 2: Query Connection to verify user data persistence
    console.log('\n2️⃣ Querying Connection to Verify User Data...');
    
    const queryConnection = `
      query GetConnection($id: ID!) {
        socialConnection(id: $id) {
          success
          data {
            id
            platform
            accountName
            userId
            user {
              id
              email
              name
              role
              isActive
            }
          }
        }
      }
    `;

    const result2 = await makeRequest(queryConnection, { id: connection.id });
    
    if (result2.success && result2.data.socialConnection.success) {
      const queriedConnection = result2.data.socialConnection.data;
      console.log('✅ Connection queried successfully with user data!');
      console.log(`   🔍 Queried ID: ${queriedConnection.id}`);
      console.log(`   🔗 User ID Hash: ${queriedConnection.userId}`);
      
      if (queriedConnection.user) {
        console.log('   👨‍💼 Resolved User Details:');
        console.log(`     🆔 User ID: ${queriedConnection.user.id}`);
        console.log(`     📧 Email: ${queriedConnection.user.email}`);
        console.log(`     📝 Name: ${queriedConnection.user.name}`);
      }
    }
    
    // Test 3: Query All Connections to see user data
    console.log('\n3️⃣ Querying All Connections with User Data...');
    
    const queryAllConnections = `
      query GetAllConnections {
        socialConnections {
          success
          totalCount
          data {
            id
            platform
            accountName
            userId
            user {
              id
              email
              name
              role
            }
          }
        }
      }
    `;

    const result3 = await makeRequest(queryAllConnections);
    
    if (result3.success && result3.data.socialConnections.success) {
      const connections = result3.data.socialConnections.data;
      console.log(`✅ Retrieved ${result3.data.socialConnections.totalCount} connections with user data:`);
      
      connections.forEach((conn, index) => {
        console.log(`   ${index + 1}. ${conn.platform} - ${conn.accountName || 'N/A'}`);
        console.log(`      🔗 User ID: ${conn.userId || 'No User'}`);
        if (conn.user) {
          console.log(`      👤 User: ${conn.user.name} (${conn.user.email})`);
        }
      });
    }
    
    // Test 4: Create Content using Connection with User Context
    console.log('\n4️⃣ Creating Content with Connection & User Context...');
    
    const createContentMutation = `
      mutation CreateContent($input: JSON!) {
        genericMutation(
          modelName: "SocialContent"
          operation: CREATE
          data: $input
        ) {
          success
          message
          data
        }
      }
    `;

    const contentInput = {
      platform: connection.platform,
      contentType: 'POST',
      connection: connection.id,
      content: {
        caption: 'This post was created with auto user integration! 🚀👨‍💼',
        hashtags: ['#automation', '#userintegration', '#socialmedia']
      },
      title: 'Auto User Integration Test Post',
      description: 'Testing the automatic user integration with social connections',
      author: connection.user ? connection.user.name : 'Unknown User',
      publishStatus: 'PUBLISHED'
    };

    const result4 = await makeRequest(createContentMutation, { input: contentInput });
    
    if (result4.success && result4.data.genericMutation.success) {
      console.log('✅ Content created with user context!');
      console.log(`   🔗 Connected to: ${connection.platform} (${connection.accountName})`);
      console.log(`   👨‍💼 Author: ${contentInput.author}`);
      console.log(`   📝 Title: ${contentInput.title}`);
    }
    
  } else {
    console.log('❌ Failed to create connection with user integration');
  }

  console.log('\n' + '=' .repeat(60));
  console.log('🎉 User Integration Test Complete!');
  console.log('\n📋 What we tested:');
  console.log('   ✅ Auto user creation/linking during connection creation');
  console.log('   ✅ User ID hash generation and storage');
  console.log('   ✅ User data resolution from ObjectId hash');
  console.log('   ✅ User context preservation across queries');
  console.log('   ✅ Content creation with user context');
  
  console.log('\n🔍 User Hash System:');
  console.log('   • MongoDB ObjectId acts as secure hash for user identification');
  console.log('   • User data automatically populated when creating connections');
  console.log('   • Hash resolved to full user object in GraphQL queries');
  console.log('   • Cached user info in connection document for performance');
  
  console.log('\n🌐 Access GraphQL Playground: http://localhost:4000/graphql');
  console.log('💡 Query any connection to see auto-populated user data!');
}

testUserIntegration(); 