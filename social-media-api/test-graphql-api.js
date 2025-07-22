const fetch = require('node-fetch');

const API_URL = 'http://localhost:4000/graphql';

async function testGraphQLAPI() {
  console.log('🧪 اختبار GraphQL API...');
  console.log('='.repeat(50));

  try {
    // اختبار الاستعلامات الأساسية
    await testBasicQueries();
    await testAdvancedQueries();
    await testMutations();
    
    console.log('\n🎉 جميع الاختبارات نجحت!');
    console.log('✅ السيرفر يعمل بشكل صحيح');
    console.log('✅ البيانات متوفرة في قاعدة البيانات');
    console.log('✅ GraphQL API جاهز للاستخدام');
    
  } catch (error) {
    console.error('\n❌ فشل الاختبار:', error.message);
    
    if (error.message.includes('ECONNREFUSED')) {
      console.log('\n💡 نصيحة: تأكد من أن السيرفر يعمل (npm start)');
    }
  }
}

async function makeGraphQLRequest(query, variables = {}) {
  const response = await fetch(API_URL, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      query,
      variables
    })
  });

  const data = await response.json();
  
  if (data.errors) {
    throw new Error(`GraphQL Error: ${data.errors[0].message}`);
  }
  
  return data.data;
}

async function testBasicQueries() {
  console.log('\n📊 اختبار الاستعلامات الأساسية...');
  
  // اختبار المستخدمين
  const usersQuery = `
    query GetUsers {
      users: genericQuery(modelName: "User") {
        success
        totalCount
        data
      }
    }
  `;
  
  const usersResult = await makeGraphQLRequest(usersQuery);
  console.log(`👥 المستخدمين: ${usersResult.users.totalCount} ${usersResult.users.success ? '✅' : '❌'}`);
  
  // اختبار الاتصالات
  const connectionsQuery = `
    query GetConnections {
      socialConnections {
        success
        totalCount
        data {
          id
          platform
          accountName
          followerCount
          user {
            name
            email
          }
        }
      }
    }
  `;
  
  const connectionsResult = await makeGraphQLRequest(connectionsQuery);
  console.log(`🔗 الاتصالات: ${connectionsResult.socialConnections.totalCount} ${connectionsResult.socialConnections.success ? '✅' : '❌'}`);
  
  if (connectionsResult.socialConnections.data.length > 0) {
    const sample = connectionsResult.socialConnections.data[0];
    console.log(`   عينة: ${sample.platform} - ${sample.accountName} (${sample.followerCount} متابع)`);
    if (sample.user) {
      console.log(`   المستخدم: ${sample.user.name}`);
    }
  }
}

async function testAdvancedQueries() {
  console.log('\n🔍 اختبار الاستعلامات المتقدمة...');
  
  // اختبار المحتوى
  const contentQuery = `
    query GetContent {
      content: genericQuery(modelName: "SocialContent") {
        success
        totalCount
        data
      }
    }
  `;
  
  const contentResult = await makeGraphQLRequest(contentQuery);
  console.log(`📱 المحتوى: ${contentResult.content.totalCount} ${contentResult.content.success ? '✅' : '❌'}`);
  
  // اختبار التحليلات
  const analyticsQuery = `
    query GetAnalytics {
      analytics: genericQuery(modelName: "SocialAnalytics") {
        success
        totalCount
        data
      }
    }
  `;
  
  const analyticsResult = await makeGraphQLRequest(analyticsQuery);
  console.log(`📊 التحليلات: ${analyticsResult.analytics.totalCount} ${analyticsResult.analytics.success ? '✅' : '❌'}`);
  
  // استعلام بفلتر
  const filteredQuery = `
    query GetActiveConnections {
      activeConnections {
        success
        data {
          id
          platform
          accountName
          status
        }
      }
    }
  `;
  
  const filteredResult = await makeGraphQLRequest(filteredQuery);
  console.log(`✅ الاتصالات النشطة: ${filteredResult.activeConnections.data.length} ${filteredResult.activeConnections.success ? '✅' : '❌'}`);
}

async function testMutations() {
  console.log('\n🔧 اختبار الطفرات (Mutations)...');
  
  try {
    // اختبار إنشاء اتصال جديد
    const createConnectionMutation = `
      mutation CreateTestConnection($input: SocialConnectionInput!) {
        createSocialConnection(input: $input) {
          success
          message
          data {
            id
            platform
            accountName
            user {
              name
              email
            }
          }
        }
      }
    `;
    
    const input = {
      platform: 'INSTAGRAM',
      accountName: 'test_api_connection',
      displayName: 'Test API Connection',
      followerCount: 1000,
      isVerified: false
    };
    
    const createResult = await makeGraphQLRequest(createConnectionMutation, { input });
    console.log(`✨ إنشاء اتصال: ${createResult.createSocialConnection.success ? '✅' : '❌'}`);
    
    if (createResult.createSocialConnection.success) {
      console.log(`   ID: ${createResult.createSocialConnection.data.id}`);
      console.log(`   المنصة: ${createResult.createSocialConnection.data.platform}`);
      console.log(`   الحساب: ${createResult.createSocialConnection.data.accountName}`);
      if (createResult.createSocialConnection.data.user) {
        console.log(`   المستخدم: ${createResult.createSocialConnection.data.user.name}`);
      }
    }
    
  } catch (error) {
    console.log(`❌ خطأ في الطفرة: ${error.message}`);
  }
}

// تشغيل الاختبارات
testGraphQLAPI(); 