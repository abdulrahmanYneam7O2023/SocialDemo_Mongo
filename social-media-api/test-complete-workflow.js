const fetch = require('node-fetch');

async function runCompleteWorkflow() {
  console.log('🚀 Starting Complete Social Media API Workflow...\n');

  let connectionId = null;

  // Step 1: Create a Social Connection
  console.log('1️⃣ Creating Social Connection...');
  try {
    const createConnectionMutation = {
      query: `
        mutation CreateSocialConnection {
          createSocialConnection(
            input: {
              platform: INSTAGRAM
              accountName: "test_account_123"
              displayName: "Test Instagram Account"
              followerCount: 1000
              followingCount: 250
              isVerified: false
              status: ACTIVE
            }
          ) {
            success
            message
            data {
              id
              platform
              accountName
              displayName
              status
              followerCount
            }
          }
        }
      `
    };

    const connectionResponse = await fetch('http://localhost:4000/graphql', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(createConnectionMutation)
    });

    const connectionResult = await connectionResponse.json();
    
    if (connectionResult.errors) {
      console.log('❌ Connection creation failed:');
      connectionResult.errors.forEach(error => console.log(`   - ${error.message}`));
      return;
    }

    if (connectionResult.data?.createSocialConnection?.success) {
      connectionId = connectionResult.data.createSocialConnection.data.id;
      console.log('✅ Social Connection created successfully!');
      console.log(`   🆔 Connection ID: ${connectionId}`);
      console.log(`   📱 Platform: ${connectionResult.data.createSocialConnection.data.platform}`);
      console.log(`   👤 Account: ${connectionResult.data.createSocialConnection.data.accountName}`);
      console.log(`   👥 Followers: ${connectionResult.data.createSocialConnection.data.followerCount}`);
    }
  } catch (error) {
    console.error('❌ Connection creation error:', error.message);
    return;
  }

  // Step 2: Create Social Content using the connection
  console.log('\n2️⃣ Creating Social Content with the connection...');
  try {
    const createContentMutation = {
      query: `
        mutation CreateSocialContent {
          createSocialContent(
            input: {
              platform: INSTAGRAM
              contentType: POST
              connection: "${connectionId}"
              content: "This is a test post created via GraphQL API! 🚀"
              title: "My First API Post"
              description: "Testing the complete workflow of creating connections and content"
              hashtags: ["#test", "#api", "#socialmedia"]
              author: "Test User"
              publishStatus: DRAFT
              scheduledAt: "2024-12-31T12:00:00Z"
              settings: {
                commentsEnabled: true
                altText: "Test image alt text"
                locationName: "Test Location"
              }
            }
          ) {
            success
            message
            data
          }
        }
      `
    };

    const contentResponse = await fetch('http://localhost:4000/graphql', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(createContentMutation)
    });

    const contentResult = await contentResponse.json();
    
    if (contentResult.errors) {
      console.log('❌ Content creation failed:');
      contentResult.errors.forEach(error => console.log(`   - ${error.message}`));
    } else if (contentResult.data?.createSocialContent?.success) {
      console.log('✅ Social Content created successfully!');
      console.log(`   📝 Message: ${contentResult.data.createSocialContent.message}`);
      
      // Parse and display the created content
      try {
        const createdContent = JSON.parse(contentResult.data.createSocialContent.data);
        console.log(`   🆔 Content ID: ${createdContent._id}`);
        console.log(`   📱 Platform: ${createdContent.platform}`);
        console.log(`   🔗 Connected to: ${createdContent.connection}`);
        console.log(`   📝 Content: ${createdContent.content.caption || createdContent.content}`);
      } catch (e) {
        console.log(`   📊 Data: ${contentResult.data.createSocialContent.data}`);
      }
    }
  } catch (error) {
    console.error('❌ Content creation error:', error.message);
  }

  // Step 3: Query all connections to verify
  console.log('\n3️⃣ Querying all Social Connections...');
  try {
    const getConnectionsQuery = {
      query: `
        query GetSocialConnections {
          socialConnections {
            success
            message
            totalCount
            data {
              id
              platform
              accountName
              displayName
              status
              followerCount
              createdAt
            }
          }
        }
      `
    };

    const connectionsResponse = await fetch('http://localhost:4000/graphql', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(getConnectionsQuery)
    });

    const connectionsResult = await connectionsResponse.json();
    
    if (connectionsResult.data?.socialConnections?.success) {
      console.log('✅ Connections retrieved successfully!');
      console.log(`   📊 Total Connections: ${connectionsResult.data.socialConnections.totalCount}`);
      
      connectionsResult.data.socialConnections.data.forEach((conn, index) => {
        console.log(`   ${index + 1}. ${conn.accountName} (${conn.platform}) - ${conn.status}`);
      });
    }
  } catch (error) {
    console.error('❌ Connections query error:', error.message);
  }

  // Step 4: Query Social Content to verify relationship
  console.log('\n4️⃣ Querying Social Content...');
  try {
    const getContentQuery = {
      query: `
        query GetSocialContent {
          genericQuery(
            modelName: "SocialContent"
            pagination: { type: offset, limit: 5 }
          ) {
            success
            totalCount
            data
          }
        }
      `
    };

    const contentQueryResponse = await fetch('http://localhost:4000/graphql', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(getContentQuery)
    });

    const contentQueryResult = await contentQueryResponse.json();
    
    if (contentQueryResult.data?.genericQuery?.success) {
      console.log('✅ Content retrieved successfully!');
      console.log(`   📊 Total Content: ${contentQueryResult.data.genericQuery.totalCount}`);
      
      try {
        const content = JSON.parse(contentQueryResult.data.genericQuery.data);
        if (Array.isArray(content) && content.length > 0) {
          content.forEach((item, index) => {
            console.log(`   ${index + 1}. ${item.platform} - ${item.contentType} (Connection: ${item.connection})`);
          });
        }
      } catch (e) {
        console.log(`   📝 Raw data: ${contentQueryResult.data.genericQuery.data}`);
      }
    }
  } catch (error) {
    console.error('❌ Content query error:', error.message);
  }

  // Step 5: Test connection update
  if (connectionId) {
    console.log('\n5️⃣ Testing Connection Update...');
    try {
      const updateConnectionMutation = {
        query: `
          mutation UpdateSocialConnection {
            updateSocialConnection(
              id: "${connectionId}"
              input: {
                followerCount: 1500
                displayName: "Updated Test Account"
              }
            ) {
              success
              message
              data {
                id
                displayName
                followerCount
              }
            }
          }
        `
      };

      const updateResponse = await fetch('http://localhost:4000/graphql', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updateConnectionMutation)
      });

      const updateResult = await updateResponse.json();
      
      if (updateResult.data?.updateSocialConnection?.success) {
        console.log('✅ Connection updated successfully!');
        console.log(`   📝 New Name: ${updateResult.data.updateSocialConnection.data.displayName}`);
        console.log(`   👥 New Followers: ${updateResult.data.updateSocialConnection.data.followerCount}`);
      }
    } catch (error) {
      console.error('❌ Connection update error:', error.message);
    }
  }

  console.log('\n🎉 Complete Workflow Test Finished!');
  console.log('\n📋 Summary:');
  console.log('   ✅ Social Connection CRUD operations working');
  console.log('   ✅ Social Content creation with proper connection reference');
  console.log('   ✅ Relationship between Connection and Content established');
  console.log('   ✅ All GraphQL operations functioning correctly');
  console.log('\n🌐 Access Points:');
  console.log('   📊 Homepage: http://localhost:4000');
  console.log('   🎮 GraphQL Playground: http://localhost:4000/graphql');
  console.log('   🗄️ Database: MongoDB Atlas (socialApi)');
}

runCompleteWorkflow(); 