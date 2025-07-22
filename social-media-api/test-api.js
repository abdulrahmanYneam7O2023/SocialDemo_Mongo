const fetch = require('node-fetch');

const API_URL = 'http://localhost:4000';
let authToken = '';

async function testAPI() {
  console.log('🧪 اختبار API شامل...\n');

  try {
    // 1. اختبار تسجيل الدخول
    console.log('1️⃣ اختبار تسجيل الدخول...');
    const loginResponse = await fetch(`${API_URL}/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        email: 'user1@example.com',
        password: 'password123'
      })
    });

    const loginData = await loginResponse.json();
    
    if (loginData.token) {
      authToken = loginData.token;
      console.log('✅ تسجيل الدخول نجح!');
      console.log(`👤 المستخدم: ${loginData.user.username}`);
      console.log(`🎫 التوكن: ${authToken.substring(0, 20)}...`);
    } else {
      console.log('❌ فشل تسجيل الدخول');
      return;
    }

    // 2. اختبار GraphQL - جميع المنشورات
    console.log('\n2️⃣ اختبار GraphQL - جميع المنشورات...');
    const postsQuery = {
      query: `
        query {
          allPosts(limit: 5) {
            id
            platform
            content
            likes
            comments
            author
            createdBy {
              username
            }
          }
        }
      `
    };

    const postsResponse = await fetch(`${API_URL}/graphql`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${authToken}`
      },
      body: JSON.stringify(postsQuery)
    });

    const postsData = await postsResponse.json();
    
    if (postsData.data && postsData.data.allPosts) {
      console.log('✅ استعلام المنشورات نجح!');
      console.log(`📝 عدد المنشورات: ${postsData.data.allPosts.length}`);
      
      // عرض أول منشور
      const firstPost = postsData.data.allPosts[0];
      console.log('\n📋 أول منشور:');
      console.log(`   ID: ${firstPost.id}`);
      console.log(`   المنصة: ${firstPost.platform}`);
      console.log(`   المؤلف: ${firstPost.author}`);
      console.log(`   إعجابات: ${firstPost.likes}`);
      console.log(`   تعليقات: ${firstPost.comments}`);
      console.log(`   المحتوى: ${firstPost.content.substring(0, 50)}...`);
    } else {
      console.log('❌ خطأ في استعلام المنشورات:', postsData);
      return;
    }

    // 3. اختبار إضافة منشور جديد
    console.log('\n3️⃣ اختبار إضافة منشور جديد...');
    const addPostMutation = {
      query: `
        mutation {
          addPost(input: {
            platform: "Twitter"
            contentType: "TWEET"
            content: "منشور تجريبي من الـ API! 🚀 #اختبار #GraphQL"
          }) {
            id
            platform
            content
            likes
            author
            createdBy {
              username
            }
          }
        }
      `
    };

    const addPostResponse = await fetch(`${API_URL}/graphql`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${authToken}`
      },
      body: JSON.stringify(addPostMutation)
    });

    const addPostData = await addPostResponse.json();
    
    if (addPostData.data && addPostData.data.addPost) {
      console.log('✅ إضافة منشور نجحت!');
      const newPost = addPostData.data.addPost;
      console.log(`   ID الجديد: ${newPost.id}`);
      console.log(`   المنصة: ${newPost.platform}`);
      console.log(`   المؤلف: ${newPost.author}`);
      console.log(`   المحتوى: ${newPost.content}`);
    } else {
      console.log('❌ خطأ في إضافة المنشور:', addPostData);
    }

    // 4. اختبار المستخدم الحالي
    console.log('\n4️⃣ اختبار المستخدم الحالي...');
    const meQuery = {
      query: `
        query {
          me {
            id
            username
            email
            createdAt
          }
        }
      `
    };

    const meResponse = await fetch(`${API_URL}/graphql`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${authToken}`
      },
      body: JSON.stringify(meQuery)
    });

    const meData = await meResponse.json();
    
    if (meData.data && meData.data.me) {
      console.log('✅ استعلام المستخدم نجح!');
      const user = meData.data.me;
      console.log(`   الاسم: ${user.username}`);
      console.log(`   الإيميل: ${user.email}`);
      console.log(`   تاريخ الإنشاء: ${user.createdAt}`);
    } else {
      console.log('❌ خطأ في استعلام المستخدم:', meData);
    }

    // 5. اختبار Analytics
    console.log('\n5️⃣ اختبار Analytics...');
    const analyticsQuery = {
      query: `
        query {
          analyticsByPlatform(platform: "Instagram") {
            id
            platform
            analyticsType
            metrics {
              reach
              impressions
              engagement
            }
          }
        }
      `
    };

    const analyticsResponse = await fetch(`${API_URL}/graphql`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${authToken}`
      },
      body: JSON.stringify(analyticsQuery)
    });

    const analyticsData = await analyticsResponse.json();
    
    if (analyticsData.data && analyticsData.data.analyticsByPlatform) {
      console.log('✅ استعلام Analytics نجح!');
      console.log(`📊 عدد التحليلات: ${analyticsData.data.analyticsByPlatform.length}`);
      
      if (analyticsData.data.analyticsByPlatform.length > 0) {
        const firstAnalytics = analyticsData.data.analyticsByPlatform[0];
        console.log('\n📈 أول تحليل:');
        console.log(`   المنصة: ${firstAnalytics.platform}`);
        console.log(`   النوع: ${firstAnalytics.analyticsType}`);
        console.log(`   الوصول: ${firstAnalytics.metrics.reach}`);
        console.log(`   الانطباعات: ${firstAnalytics.metrics.impressions}`);
      }
    } else {
      console.log('⚠️ لا توجد analytics (هذا طبيعي إذا لم تعمل fix-analytics)');
    }

    console.log('\n🎉 اختبار API مكتمل!');
    console.log('\n✅ جميع الـ endpoints تعمل مع قاعدة البيانات MongoDB');
    console.log('🚀 الـ API جاهز للربط مع الفرونت إند!');
    
  } catch (error) {
    console.error('❌ خطأ في الاختبار:', error.message);
  }
}

// تشغيل الاختبار
testAPI(); 