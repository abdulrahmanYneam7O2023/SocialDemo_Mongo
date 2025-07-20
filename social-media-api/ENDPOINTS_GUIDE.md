# 🚀 دليل Endpoints المحدث - Social Media API

## 📋 نظرة عامة
تم تحديث جميع الـ endpoints للعمل مع قاعدة البيانات MongoDB الحقيقية بدلاً من البيانات الوهمية.

### 🌐 معلومات السيرفر
- **URL**: http://localhost:4000
- **GraphQL Playground**: http://localhost:4000
- **Auth Routes**: http://localhost:4000/auth
- **قاعدة البيانات**: MongoDB - social-media-api

---

## 🔐 1. Authentication (REST API)

### تسجيل مستخدم جديد
```http
POST http://localhost:4000/auth/register
Content-Type: application/json

{
  "username": "new_user",
  "email": "newuser@example.com",
  "password": "password123"
}
```

**Response:**
```json
{
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "id": "60f7b1234567890abcdef123",
    "username": "new_user",
    "email": "newuser@example.com"
  }
}
```

### تسجيل الدخول
```http
POST http://localhost:4000/auth/login
Content-Type: application/json

{
  "email": "ahmed@example.com",
  "password": "password123"
}
```

---

## 📝 2. GraphQL Queries

### أ) جميع المنشورات (مع فلترة وترتيب)
```graphql
query GetAllPosts($filter: PostFilterInput, $sort: PostSortInput, $limit: Int, $skip: Int) {
  allPosts(filter: $filter, sort: $sort, limit: $limit, skip: $skip) {
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

**Variables:**
```json
{
  "filter": {
    "author": "ahmed",
    "likes": { "gte": 100 }
  },
  "sort": {
    "field": "likes",
    "order": "DESC"
  },
  "limit": 10,
  "skip": 0
}
```

### ب) منشورات منصة معينة
```graphql
query GetPostsByPlatform($platform: String!, $filter: PostFilterInput) {
  postsByPlatform(platform: $platform, filter: $filter) {
    id
    content
    likes
    comments
    platform
    author
    createdAt
  }
}
```

**Variables:**
```json
{
  "platform": "Instagram",
  "filter": {
    "likes": { "gte": 200 }
  }
}
```

### ج) منشورات حسب نوع المحتوى
```graphql
query GetPostsByContentType($contentType: String!) {
  postsByContentType(contentType: $contentType) {
    id
    content
    platform
    views
    likes
    author
  }
}
```

**Variables:**
```json
{
  "contentType": "VIDEO"
}
```

### د) المستخدم الحالي
```graphql
query GetCurrentUser {
  me {
    id
    username
    email
    createdAt
  }
}
```

---

## ✏️ 3. GraphQL Mutations

### أ) إضافة منشور جديد
```graphql
mutation AddNewPost($input: PostInput!) {
  addPost(input: $input) {
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

**Variables:**
```json
{
  "input": {
    "platform": "Twitter",
    "contentType": "TWEET",
    "content": "منشور جديد رائع! 🚀 #تطوير #برمجة",
    "author": "my_username"
  }
}
```

### ب) تحديث منشور
```graphql
mutation UpdateExistingPost($id: ID!, $input: PostInput!) {
  updatePost(id: $id, input: $input) {
    id
    content
    platform
    likes
    author
    createdAt
  }
}
```

**Variables:**
```json
{
  "id": "60f7b1234567890abcdef123",
  "input": {
    "content": "محتوى محدث! ✨",
    "platform": "Instagram"
  }
}
```

### ج) حذف منشور
```graphql
mutation DeletePost($id: ID!) {
  deletePost(id: $id)
}
```

**Variables:**
```json
{
  "id": "60f7b1234567890abcdef123"
}
```

---

## 📊 4. Analytics Queries

### أ) تحليلات المحتوى
```graphql
query GetContentAnalytics($contentId: ID!) {
  analyticsByContent(contentId: $contentId) {
    id
    contentId
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
      saves
    }
    snapshotDate
  }
}
```

**Variables:**
```json
{
  "contentId": "post_1"
}
```

### ب) تحليلات المنصة
```graphql
query GetPlatformAnalytics($platform: String!, $periodType: String) {
  analyticsByPlatform(platform: $platform, periodType: $periodType) {
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

**Variables:**
```json
{
  "platform": "Instagram",
  "periodType": "DAILY"
}
```

---

## 🔑 5. مصادقة GraphQL

جميع queries و mutations تحتاج لـ authorization header:

```json
{
  "Authorization": "Bearer YOUR_JWT_TOKEN"
}
```

---

## 🧪 6. اختبار الـ Endpoints

### في Postman:

1. **تسجيل/دخول** للحصول على token
2. **استخدام token** في GraphQL headers
3. **اختبار queries** مع بيانات حقيقية

### في GraphQL Playground:

1. **افتح**: http://localhost:4000
2. **Headers** (أسفل يسار):
```json
{
  "Authorization": "Bearer YOUR_TOKEN"
}
```
3. **اكتب query** واضغط ▶️

---

## 🆕 7. المميزات الجديدة

### ✅ المحسنات:
- **اتصال حقيقي بـ MongoDB**
- **فلترة متقدمة** (بالتاريخ، المؤلف، الإعجابات)
- **ترتيب ديناميكي** (تصاعدي/تنازلي)
- **pagination** (limit & skip)
- **معالجة أخطاء محسنة**
- **تشفير كلمات المرور**
- **validation للبيانات**
- **populate للمراجع**

### 🔒 الأمان:
- **مصادقة إجبارية** لجميع العمليات
- **التحقق من الملكية** للتحديث/الحذف
- **تشفير كلمات المرور**
- **validation شامل**

---

## 📋 8. أمثلة عملية

### مثال 1: إنشاء منشور وعرضه
```bash
# 1. تسجيل دخول
curl -X POST http://localhost:4000/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"ahmed@example.com","password":"password123"}'

# 2. استخدام Token في GraphQL
# Headers: {"Authorization": "Bearer TOKEN"}
# Query: addPost mutation
```

### مثال 2: فلترة المنشورات الشائعة
```graphql
query PopularPosts {
  allPosts(
    filter: { likes: { gte: 500 } }
    sort: { field: "likes", order: "DESC" }
    limit: 5
  ) {
    id
    content
    likes
    platform
    author
  }
}
```

### مثال 3: منشورات مستخدم معين
```graphql
query UserPosts {
  allPosts(
    filter: { author: "sara_mohamed" }
    sort: { field: "createdAt", order: "DESC" }
  ) {
    id
    content
    platform
    createdAt
  }
}
```

---

## 🐛 استكشاف الأخطاء

### خطأ UNAUTHENTICATED:
- تأكد من وجود Authorization header
- تحقق من صحة التوكن
- تأكد من عدم انتهاء صلاحية التوكن

### خطأ اتصال قاعدة البيانات:
- تأكد من تشغيل MongoDB
- تحقق من MONGODB_URI
- تأكد من الاتصال بالشبكة

### خطأ Validation:
- تحقق من صحة البيانات المرسلة
- تأكد من وجود الحقول المطلوبة
- راجع أنواع البيانات

---

🎉 **الآن جميع الـ endpoints تعمل مع قاعدة البيانات الحقيقية!** 