# دليل استخدام Social Media API 🚀

## معلومات المشروع

- **الخادم**: http://localhost:4000
- **GraphQL Playground**: http://localhost:4000
- **Auth Routes**: http://localhost:4000/auth
- **حالة البيانات**: يعمل مع بيانات وهمية (Mock Data)

---

## 1. GraphQL Queries

### أ) الحصول على جميع المنشورات
```graphql
query {
  allPosts {
    id
    platform
    contentType
    content
    likes
    comments
    shares
    views
    author
    createdAt
    createdBy {
      id
      username
      email
    }
  }
}
```

### ب) المنشورات حسب المنصة
```graphql
query {
  postsByPlatform(platform: "Instagram") {
    id
    content
    likes
    comments
    platform
  }
}
```

### ج) المنشورات حسب نوع المحتوى
```graphql
query {
  postsByContentType(contentType: "VIDEO") {
    id
    content
    platform
    views
    likes
  }
}
```

### د) المستخدم الحالي
```graphql
query {
  me {
    id
    username
    email
    createdAt
  }
}
```

### هـ) تحليلات المحتوى
```graphql
query {
  analyticsByContent(contentId: "post_1") {
    id
    platform
    periodType
    metrics {
      reach
      impressions
      engagement
      clicks
      likes
      comments
      shares
    }
  }
}
```

### و) تحليلات المنصة
```graphql
query {
  analyticsByPlatform(platform: "Instagram", periodType: "DAILY") {
    id
    contentId
    metrics {
      reach
      impressions
      engagement
    }
    snapshotDate
  }
}
```

---

## 2. GraphQL Mutations

### أ) إضافة منشور جديد
```graphql
mutation {
  addPost(input: {
    platform: "Twitter"
    contentType: "TWEET"
    content: "منشور جديد من التطبيق! 🎉"
    author: "test_user"
  }) {
    id
    platform
    content
    likes
    createdAt
  }
}
```

### ب) تحديث منشور
```graphql
mutation {
  updatePost(id: "post_1", input: {
    content: "محتوى محدث! ✨"
    platform: "Instagram"
  }) {
    id
    content
    platform
    likes
  }
}
```

### ج) حذف منشور
```graphql
mutation {
  deletePost(id: "post_6")
}
```

---

## 3. استعلامات متقدمة مع فلترة

### أ) فلترة حسب الإعجابات
```graphql
query {
  allPosts(
    filter: {
      likes: { gte: 100 }
    }
    sort: { field: "likes", order: DESC }
    limit: 5
  ) {
    id
    content
    likes
    platform
  }
}
```

### ب) فلترة حسب التاريخ والكاتب
```graphql
query {
  allPosts(
    filter: {
      author: "sara_mohamed"
      createdAt: { gte: "2024-07-16T00:00:00.000Z" }
    }
  ) {
    id
    content
    author
    createdAt
  }
}
```

---

## 4. البيانات الوهمية المتاحة

### المستخدمون:
- Ahmed Hassan (ahmed@example.com)
- Sara Mohamed (sara@example.com)  
- Omar Ali (omar@example.com)
- Fatima Nour (fatima@example.com)

### المنصات:
- Instagram
- Facebook
- Twitter
- LinkedIn
- TikTok
- YouTube

### أنواع المحتوى:
- IMAGE
- VIDEO
- STORY
- POST
- REEL
- TWEET

---

## 5. اختبار سريع

### تجربة في GraphQL Playground:
1. افتح http://localhost:4000
2. انسخ والصق أي من الاستعلامات أعلاه
3. اضغط على زر "Play" ▶️
4. **لا حاجة للمصادقة!** جميع الاستعلامات تعمل مباشرة

---

## 6. ملاحظات مهمة

- 🔓 **بدون مصادقة**: المشروع يعمل بدون أي متطلبات مصادقة
- 📝 **بيانات وهمية**: جميع البيانات في الذاكرة (ستختفي عند إعادة التشغيل)
- 🚀 **إضافة بيانات**: يمكنك إضافة منشورات جدد باستخدام mutations
- 🔄 **إعادة التشغيل**: البيانات ترجع للحالة الأساسية عند إعادة تشغيل الخادم

---

## 7. كود المثال - JavaScript

```javascript
// استعلام GraphQL بسيط (بدون مصادقة)
const graphqlResponse = await fetch('http://localhost:4000/graphql', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json'
  },
  body: JSON.stringify({
    query: `
      query {
        allPosts {
          id
          content
          likes
          platform
        }
      }
    `
  })
});

const data = await graphqlResponse.json();
console.log(data);

// إضافة منشور جديد
const addPostResponse = await fetch('http://localhost:4000/graphql', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json'
  },
  body: JSON.stringify({
    query: `
      mutation {
        addPost(input: {
          platform: "Twitter"
          contentType: "TWEET"
          content: "منشور جديد! 🎉"
          author: "test_user"
        }) {
          id
          content
          platform
        }
      }
    `
  })
});

const newPost = await addPostResponse.json();
console.log(newPost);
```

---

**المشروع جاهز للاستخدام والاختبار! 🎉** 