const fetch = require('node-fetch');

async function testCreateSocialContent() {
  console.log('🧪 Testing createSocialContent mutation...');

  const mutation = {
    query: `
      mutation CreateSocialContent {
        createSocialContent(
          input: {
            platform: INSTAGRAM
            contentType: VIDEO
            connection: "test"
            content: "test"
            title: "test"
            description: "test"
            hashtags: null
            mentions: null
            author: "test"
            mediaFiles: null
            publishStatus: DRAFT
            scheduledAt: "test"
            settings: {
              locationId: "2"
              locationName: "test"
              altText: "test"
              link: "test"
              linkName: "test"
              linkCaption: "test"
              linkDescription: "test"
              isThread: false
              parentTweetId: "test"
              conversationId: "test"
              replySettings: mentioned_users
              visibility: CONNECTIONS
              privacyLevel: MUTUAL_FOLLOW_FRIENDS
              disableDuet: true
              disableComment: true
              disableStitch: true
              privacyStatus: public
              categoryId: "test"
              defaultLanguage: "test"
              videoTags: null
              commentsEnabled: true
            }
          }
        ) {
          success
          data
          message
        }
      }
    `
  };

  try {
    const response = await fetch('http://localhost:4000/graphql', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(mutation)
    });

    const result = await response.json();
    
    if (result.errors) {
      console.log('❌ Mutation failed with errors:');
      result.errors.forEach(error => {
        console.log(`   - ${error.message}`);
      });
    } else if (result.data?.createSocialContent?.success) {
      console.log('✅ createSocialContent mutation successful!');
      console.log(`   Message: ${result.data.createSocialContent.message}`);
      console.log(`   Success: ${result.data.createSocialContent.success}`);
    } else {
      console.log('⚠️ Mutation completed but success is false');
      console.log(JSON.stringify(result, null, 2));
    }
  } catch (error) {
    console.error('❌ Test failed:', error.message);
  }
}

// Test generic query as well
async function testGenericQuery() {
  console.log('\n🔍 Testing Generic Query...');

  const query = {
    query: `
      query {
        genericQuery(
          modelName: "SocialContent",
          pagination: { type: offset, limit: 5 }
        ) {
          success
          totalCount
          data
        }
      }
    `
  };

  try {
    const response = await fetch('http://localhost:4000/graphql', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(query)
    });

    const result = await response.json();
    
    if (result.errors) {
      console.log('❌ Query failed with errors:');
      result.errors.forEach(error => {
        console.log(`   - ${error.message}`);
      });
    } else if (result.data?.genericQuery?.success) {
      console.log('✅ Generic Query successful!');
      console.log(`   Total Count: ${result.data.genericQuery.totalCount}`);
    } else {
      console.log('⚠️ Query completed but success is false');
      console.log(JSON.stringify(result, null, 2));
    }
  } catch (error) {
    console.error('❌ Query test failed:', error.message);
  }
}

async function runTests() {
  console.log('🚀 Testing Fixed MongoDB Atlas Integration...\n');
  
  await testCreateSocialContent();
  await testGenericQuery();
  
  console.log('\n🎉 Test complete!');
}

runTests(); 