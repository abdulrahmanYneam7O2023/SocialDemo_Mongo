const fetch = require('node-fetch');

async function demoCompleteWorkflow() {
  console.log('🎬 Demo: Complete SocialConnection Workflow');
  console.log('=' .repeat(50));

  // Step 1: Create connections for different platforms
  console.log('\n1️⃣ Creating Social Media Connections...');
  
  const connections = [];
  const platforms = [
    {
      platform: 'INSTAGRAM',
      accountName: 'my_instagram_business',
      displayName: 'My Instagram Business',
      followerCount: 15000,
      isVerified: true
    },
    {
      platform: 'FACEBOOK',
      accountName: 'my_facebook_page',
      displayName: 'My Facebook Page',
      followerCount: 8500,
      isVerified: false
    },
    {
      platform: 'TWITTER',
      accountName: 'my_twitter_handle',
      displayName: 'My Twitter Account',
      followerCount: 3200,
      isVerified: true
    }
  ];

  for (const platform of platforms) {
    try {
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
              followerCount
              isVerified
            }
          }
        }
      `;

      const response = await fetch('http://localhost:4000/graphql', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ query: mutation, variables: { input: platform } })
      });

      const result = await response.json();
      
      if (result.data?.createSocialConnection?.success) {
        const conn = result.data.createSocialConnection.data;
        connections.push(conn);
        console.log(`✅ ${conn.platform}: ${conn.accountName} (${conn.followerCount} followers) ${conn.isVerified ? '✓' : ''}`);
      }
    } catch (error) {
      console.log(`❌ Failed to create ${platform.platform} connection`);
    }
  }

  // Step 2: Show all connections
  console.log('\n2️⃣ Retrieving All Connections...');
  
  try {
    const query = `
      query {
        socialConnections {
          success
          totalCount
          data {
            id
            platform
            accountName
            displayName
            status
            followerCount
            isVerified
          }
        }
      }
    `;

    const response = await fetch('http://localhost:4000/graphql', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ query })
    });

    const result = await response.json();
    
    if (result.data?.socialConnections?.success) {
      console.log(`📊 Total Connections: ${result.data.socialConnections.totalCount}`);
      result.data.socialConnections.data.forEach((conn, index) => {
        console.log(`   ${index + 1}. ${conn.platform} - ${conn.accountName || 'N/A'} (${conn.followerCount || 0} followers)`);
      });
    }
  } catch (error) {
    console.log('❌ Failed to retrieve connections');
  }

  // Step 3: Update a connection
  if (connections.length > 0) {
    console.log('\n3️⃣ Updating Connection...');
    
    try {
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
        displayName: 'Updated Business Account',
        followerCount: 16500,
        isVerified: true
      };

      const response = await fetch('http://localhost:4000/graphql', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          query: mutation, 
          variables: { id: connections[0].id, input }
        })
      });

      const result = await response.json();
      
      if (result.data?.updateSocialConnection?.success) {
        console.log('✅ Connection updated successfully!');
        console.log(`   📝 New name: ${result.data.updateSocialConnection.data.displayName}`);
        console.log(`   👥 New followers: ${result.data.updateSocialConnection.data.followerCount}`);
      }
    } catch (error) {
      console.log('❌ Failed to update connection');
    }
  }

  // Step 4: Toggle connection status
  if (connections.length > 1) {
    console.log('\n4️⃣ Toggling Connection Status...');
    
    try {
      const mutation = `
        mutation ToggleStatus($id: ID!) {
          toggleConnectionStatus(id: $id) {
            success
            message
            data {
              id
              status
              platform
            }
          }
        }
      `;

      const response = await fetch('http://localhost:4000/graphql', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          query: mutation, 
          variables: { id: connections[1].id }
        })
      });

      const result = await response.json();
      
      if (result.data?.toggleConnectionStatus?.success) {
        console.log('✅ Status toggled successfully!');
        console.log(`   🔄 ${result.data.toggleConnectionStatus.data.platform} status: ${result.data.toggleConnectionStatus.data.status}`);
      }
    } catch (error) {
      console.log('❌ Failed to toggle status');
    }
  }

  // Step 5: Create content using the connection
  if (connections.length > 0) {
    console.log('\n5️⃣ Creating Content with Connection...');
    
    try {
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
        platform: connections[0].platform,
        contentType: 'POST',
        connection: connections[0].id,
        content: {
          caption: 'Exciting news! Our new product launch is here! 🚀',
          hashtags: ['#launch', '#newproduct', '#business', '#innovation']
        },
        title: 'Product Launch Announcement',
        description: 'Announcing our latest innovation in the market',
        author: 'Social Media Manager',
        publishStatus: 'PUBLISHED',
        scheduledAt: new Date().toISOString()
      };

      const response = await fetch('http://localhost:4000/graphql', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          query: mutation, 
          variables: { input }
        })
      });

      const result = await response.json();
      
      if (result.data?.genericMutation?.success) {
        console.log('✅ Content created successfully!');
        console.log(`   🔗 Connected to: ${connections[0].platform} (${connections[0].accountName})`);
        console.log(`   📝 Content: Product Launch Announcement`);
        
        try {
          const contentData = JSON.parse(result.data.genericMutation.data);
          console.log(`   🆔 Content ID: ${contentData._id}`);
        } catch (e) {
          console.log(`   📊 Data created successfully`);
        }
      }
    } catch (error) {
      console.log('❌ Failed to create content');
    }
  }

  // Step 6: Query connections by platform
  console.log('\n6️⃣ Querying Instagram Connections...');
  
  try {
    const query = `
      query GetConnectionsByPlatform($platform: SocialPlatform!) {
        connectionsByPlatform(platform: $platform) {
          success
          totalCount
          data {
            id
            accountName
            displayName
            followerCount
            status
          }
        }
      }
    `;

    const response = await fetch('http://localhost:4000/graphql', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ 
        query, 
        variables: { platform: 'INSTAGRAM' }
      })
    });

    const result = await response.json();
    
    if (result.data?.connectionsByPlatform?.success) {
      console.log(`📊 Found ${result.data.connectionsByPlatform.totalCount} Instagram connections:`);
      result.data.connectionsByPlatform.data.forEach((conn, index) => {
        console.log(`   ${index + 1}. ${conn.accountName || 'N/A'} - ${conn.status} (${conn.followerCount || 0} followers)`);
      });
    }
  } catch (error) {
    console.log('❌ Failed to query Instagram connections');
  }

  console.log('\n' + '=' .repeat(50));
  console.log('🎉 Demo Complete!');
  console.log('\n📋 What we accomplished:');
  console.log('   ✅ Created multiple social media connections');
  console.log('   ✅ Retrieved and listed all connections');
  console.log('   ✅ Updated connection information');
  console.log('   ✅ Toggled connection status');
  console.log('   ✅ Created content linked to connections');
  console.log('   ✅ Queried connections by platform');
  
  console.log('\n🔗 Available Operations:');
  console.log('   📝 createSocialConnection');
  console.log('   📖 socialConnections, socialConnection, connectionsByPlatform');
  console.log('   ✏️ updateSocialConnection');
  console.log('   🔄 toggleConnectionStatus');
  console.log('   🗑️ deleteSocialConnection');
  console.log('   🔄 syncSocialConnection');
  
  console.log('\n🌐 Access GraphQL Playground: http://localhost:4000/graphql');
  console.log('💡 Use the connection IDs to create social media content!');
  
  if (connections.length > 0) {
    console.log('\n🆔 Created Connection IDs:');
    connections.forEach((conn, index) => {
      console.log(`   ${index + 1}. ${conn.platform}: ${conn.id}`);
    });
  }
}

demoCompleteWorkflow(); 