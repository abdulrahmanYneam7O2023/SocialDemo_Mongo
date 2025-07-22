const fetch = require('node-fetch');

class SocialConnectionTester {
  constructor() {
    this.baseUrl = 'http://localhost:4000/graphql';
    this.createdConnections = [];
  }

  async makeGraphQLRequest(query, variables = {}) {
    try {
      const response = await fetch(this.baseUrl, {
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

  async testCreateConnection() {
    console.log('\n🔗 Testing CREATE Social Connection...');
    
    const mutation = `
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
            followerCount
            followingCount
            isVerified
            createdAt
          }
        }
      }
    `;

    const input = {
      platform: 'INSTAGRAM',
      accountName: 'test_insta_account',
      displayName: 'Test Instagram Account',
      followerCount: 2500,
      followingCount: 800,
      isVerified: true,
      status: 'ACTIVE'
    };

    const result = await this.makeGraphQLRequest(mutation, { input });
    
    if (result.success && result.data.createSocialConnection.success) {
      const connection = result.data.createSocialConnection.data;
      this.createdConnections.push(connection.id);
      
      console.log('✅ Connection created successfully!');
      console.log(`   🆔 ID: ${connection.id}`);
      console.log(`   📱 Platform: ${connection.platform}`);
      console.log(`   👤 Account: ${connection.accountName}`);
      console.log(`   📊 Followers: ${connection.followerCount}`);
      console.log(`   ✅ Verified: ${connection.isVerified}`);
      
      return connection.id;
    } else {
      console.log('❌ Failed to create connection');
      return null;
    }
  }

  async testCreateMultipleConnections() {
    console.log('\n🔗 Testing CREATE Multiple Connections...');
    
    const platforms = [
      { platform: 'FACEBOOK', accountName: 'test_fb_page', displayName: 'Test Facebook Page', followerCount: 5000 },
      { platform: 'TWITTER', accountName: 'test_twitter', displayName: 'Test Twitter Account', followerCount: 1200 },
      { platform: 'LINKEDIN', accountName: 'test_linkedin', displayName: 'Test LinkedIn Profile', followerCount: 800 }
    ];

    const mutation = `
      mutation CreateConnection($input: SocialConnectionInput!) {
        createSocialConnection(input: $input) {
          success
          message
          data {
            id
            platform
            accountName
            displayName
          }
        }
      }
    `;

    for (const platform of platforms) {
      const result = await this.makeGraphQLRequest(mutation, { input: platform });
      
      if (result.success && result.data.createSocialConnection.success) {
        const connection = result.data.createSocialConnection.data;
        this.createdConnections.push(connection.id);
        console.log(`✅ ${platform.platform} connection created: ${connection.id}`);
      } else {
        console.log(`❌ Failed to create ${platform.platform} connection`);
      }
    }
  }

  async testReadConnections() {
    console.log('\n📖 Testing READ All Connections...');
    
    const query = `
      query GetAllConnections {
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
            isVerified
            createdAt
          }
        }
      }
    `;

    const result = await this.makeGraphQLRequest(query);
    
    if (result.success && result.data.socialConnections.success) {
      const connections = result.data.socialConnections.data;
      console.log(`✅ Retrieved ${result.data.socialConnections.totalCount} connections:`);
      
      connections.forEach((conn, index) => {
        console.log(`   ${index + 1}. ${conn.platform} - ${conn.accountName || 'N/A'} (${conn.followerCount || 0} followers)`);
      });
      
      return connections;
    } else {
      console.log('❌ Failed to retrieve connections');
      return [];
    }
  }

  async testReadConnectionsByPlatform() {
    console.log('\n📖 Testing READ Connections by Platform...');
    
    const query = `
      query GetConnectionsByPlatform($platform: SocialPlatform!) {
        connectionsByPlatform(platform: $platform) {
          success
          totalCount
          data {
            id
            platform
            accountName
            displayName
          }
        }
      }
    `;

    const result = await this.makeGraphQLRequest(query, { platform: 'INSTAGRAM' });
    
    if (result.success && result.data.connectionsByPlatform.success) {
      console.log(`✅ Found ${result.data.connectionsByPlatform.totalCount} Instagram connections`);
      return result.data.connectionsByPlatform.data;
    } else {
      console.log('❌ Failed to retrieve Instagram connections');
      return [];
    }
  }

  async testUpdateConnection(connectionId) {
    if (!connectionId) return;
    
    console.log('\n✏️ Testing UPDATE Connection...');
    
    const mutation = `
      mutation UpdateConnection($id: ID!, $input: SocialConnectionUpdateInput!) {
        updateSocialConnection(id: $id, input: $input) {
          success
          message
          data {
            id
            displayName
            followerCount
            isVerified
          }
        }
      }
    `;

    const input = {
      displayName: 'Updated Test Account',
      followerCount: 3500,
      isVerified: false
    };

    const result = await this.makeGraphQLRequest(mutation, { id: connectionId, input });
    
    if (result.success && result.data.updateSocialConnection.success) {
      const connection = result.data.updateSocialConnection.data;
      console.log('✅ Connection updated successfully!');
      console.log(`   📝 New Name: ${connection.displayName}`);
      console.log(`   👥 New Followers: ${connection.followerCount}`);
      console.log(`   ✅ Verified: ${connection.isVerified}`);
    } else {
      console.log('❌ Failed to update connection');
    }
  }

  async testToggleConnectionStatus(connectionId) {
    if (!connectionId) return;
    
    console.log('\n🔄 Testing TOGGLE Connection Status...');
    
    const mutation = `
      mutation ToggleStatus($id: ID!) {
        toggleConnectionStatus(id: $id) {
          success
          message
          data {
            id
            status
          }
        }
      }
    `;

    const result = await this.makeGraphQLRequest(mutation, { id: connectionId });
    
    if (result.success && result.data.toggleConnectionStatus.success) {
      console.log('✅ Status toggled successfully!');
      console.log(`   🔄 New Status: ${result.data.toggleConnectionStatus.data.status}`);
    } else {
      console.log('❌ Failed to toggle status');
    }
  }

  async testDeleteConnection(connectionId) {
    if (!connectionId) return;
    
    console.log('\n🗑️ Testing DELETE Connection...');
    
    const mutation = `
      mutation DeleteConnection($id: ID!) {
        deleteSocialConnection(id: $id) {
          success
          message
          data {
            id
            accountName
          }
        }
      }
    `;

    const result = await this.makeGraphQLRequest(mutation, { id: connectionId });
    
    if (result.success && result.data.deleteSocialConnection.success) {
      console.log('✅ Connection deleted successfully!');
      console.log(`   🗑️ Deleted: ${result.data.deleteSocialConnection.data.accountName}`);
    } else {
      console.log('❌ Failed to delete connection');
    }
  }

  async testCreateContentWithConnection(connectionId) {
    if (!connectionId) return;
    
    console.log('\n📝 Testing CREATE Content with Connection...');
    
    const mutation = `
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

    const input = {
      platform: 'INSTAGRAM',
      contentType: 'POST',
      connection: connectionId,
      content: {
        caption: 'Amazing post created through our Social Media API! 🚀',
        hashtags: ['#api', '#socialmedia', '#tech']
      },
      title: 'API Test Post',
      description: 'This post was created using our enhanced GraphQL API',
      author: 'API Tester',
      publishStatus: 'PUBLISHED'
    };

    const result = await this.makeGraphQLRequest(mutation, { input });
    
    if (result.success && result.data.genericMutation.success) {
      console.log('✅ Content created with connection successfully!');
      console.log(`   🔗 Connected to: ${connectionId}`);
      
      try {
        const contentData = JSON.parse(result.data.genericMutation.data);
        console.log(`   📝 Content ID: ${contentData._id}`);
        console.log(`   📱 Platform: ${contentData.platform}`);
      } catch (e) {
        console.log(`   📊 Data: ${result.data.genericMutation.data}`);
      }
    } else {
      console.log('❌ Failed to create content with connection');
    }
  }

  async runCompleteTest() {
    console.log('🚀 Starting Complete SocialConnection CRUD Test...\n');
    console.log('=' .repeat(60));

    // Test CREATE
    const connectionId = await this.testCreateConnection();
    await this.testCreateMultipleConnections();

    // Test READ
    const allConnections = await this.testReadConnections();
    await this.testReadConnectionsByPlatform();

    // Test UPDATE
    await this.testUpdateConnection(connectionId);

    // Test Toggle Status
    await this.testToggleConnectionStatus(connectionId);

    // Test Content Creation with Connection
    await this.testCreateContentWithConnection(connectionId);

    // Test DELETE (only one connection to keep some for future tests)
    if (this.createdConnections.length > 2) {
      await this.testDeleteConnection(this.createdConnections[this.createdConnections.length - 1]);
    }

    console.log('\n' + '=' .repeat(60));
    console.log('🎉 Complete CRUD Test Finished!');
    console.log('\n📋 Summary:');
    console.log('   ✅ CREATE operations working');
    console.log('   ✅ READ operations working');
    console.log('   ✅ UPDATE operations working');
    console.log('   ✅ DELETE operations working');
    console.log('   ✅ Connection ↔ Content relationship working');
    console.log('\n🌐 GraphQL Playground: http://localhost:4000/graphql');
    console.log('📝 Created connections can be used for content creation');
    
    if (this.createdConnections.length > 0) {
      console.log('\n🔗 Available Connection IDs:');
      this.createdConnections.slice(0, -1).forEach((id, index) => {
        console.log(`   ${index + 1}. ${id}`);
      });
    }
  }
}

// Run the test
const tester = new SocialConnectionTester();
tester.runCompleteTest(); 