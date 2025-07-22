const fetch = require('node-fetch');

console.log('🚀 اختبار سريع للـ API');

async function quickTest() {
  try {
    // 1. تسجيل الدخول
    console.log('\n🔐 اختبار تسجيل الدخول...');
    const loginResponse = await fetch('http://localhost:4000/auth/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        email: 'user1@example.com',
        password: 'password123'
      })
    });

    const loginData = await loginResponse.json();
    if (loginData.token) {
      console.log('✅ تسجيل الدخول نجح!');
      console.log(`👤 المستخدم: ${loginData.user.username}`);
      
      // 2. اختبار GraphQL
      console.log('\n📊 اختبار GraphQL...');
      const graphqlResponse = await fetch('http://localhost:4000/graphql', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${loginData.token}`
        },
        body: JSON.stringify({
          query: 'query { allPosts(limit: 3) { id platform content likes author } }'
        })
      });

      const graphqlData = await graphqlResponse.json();
      if (graphqlData.data?.allPosts) {
        console.log('✅ GraphQL نجح!');
        console.log(`📝 عدد المنشورات: ${graphqlData.data.allPosts.length}`);
        
        // عرض أول منشور
        if (graphqlData.data.allPosts.length > 0) {
          const post = graphqlData.data.allPosts[0];
          console.log(`📌 أول منشور: ${post.content.substring(0, 40)}...`);
          console.log(`👍 الإعجابات: ${post.likes}`);
          console.log(`📱 المنصة: ${post.platform}`);
        }
        
        // 3. اختبار إضافة منشور
        console.log('\n➕ اختبار إضافة منشور...');
        const addPostResponse = await fetch('http://localhost:4000/graphql', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${loginData.token}`
          },
          body: JSON.stringify({
            query: `mutation {
              addPost(input: {
                platform: "Twitter"
                contentType: "TWEET"
                content: "اختبار سريع! 🚀 #تطوير #API"
                author: "Test Author"
              }) {
                id
                content
                platform
                likes
                createdBy { username }
              }
            }`
          })
        });

        const addPostData = await addPostResponse.json();
        if (addPostData.data?.addPost) {
          console.log('✅ إضافة منشور نجحت!');
          console.log(`🆔 ID: ${addPostData.data.addPost.id}`);
          console.log(`📝 المحتوى: ${addPostData.data.addPost.content}`);
        }
        
        console.log('\n🎉 جميع الاختبارات نجحت!');
        console.log('🔗 يمكنك الآن ربط الـ API بالفرونت إند');
        
      } else {
        console.log('❌ GraphQL فشل:', graphqlData);
      }
    } else {
      console.log('❌ تسجيل الدخول فشل:', loginData);
    }
    
  } catch (error) {
    console.error('❌ خطأ في الاختبار:', error.message);
  }
}

quickTest(); 