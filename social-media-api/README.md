# Social Media API - مشروع إدارة المحتوى للوسائط الاجتماعية

## وصف المشروع

هذا مشروع API للوسائط الاجتماعية مبني باستخدام Node.js و GraphQL و MongoDB. يوفر المشروع إمكانيات إدارة المحتوى والمستخدمين مع نظام تحليلات متقدم.

## التقنيات المستخدمة

- **Node.js** - بيئة تشغيل JavaScript
- **Express.js** - إطار عمل الخادم
- **GraphQL + Apollo Server** - API متقدم
- **MongoDB + Mongoose** - قاعدة البيانات
- **JWT** - نظام المصادقة
- **Winston** - نظام التسجيل

## المتطلبات المسبقة

قبل البدء، تأكد من تنصيب:

1. **Node.js** (الإصدار 16 أو أعلى)
   ```bash
   node --version
   ```

2. **MongoDB** 
   - تنصيب محلي: قم بتحميل MongoDB من [موقعهم الرسمي](https://www.mongodb.com/try/download/community)
   - أو استخدم MongoDB Atlas (السحابي)

3. **npm** (يأتي مع Node.js)
   ```bash
   npm --version
   ```

## خطوات التشغيل

### الخطوة 1: استنساخ المشروع وتنصيب التبعيات

```bash
# الانتقال إلى مجلد المشروع
cd social-media-api

# تنصيب جميع التبعيات
npm install
```

### الخطوة 2: إعداد متغيرات البيئة

قم بإنشاء ملف `.env` في الجذر الرئيسي للمشروع:

```env
# إعدادات قاعدة البيانات
MONGODB_URI=mongodb://localhost:27017/social-media-api

# إعدادات الخادم
PORT=4000

# إعدادات الأمان (غيّر هذا في الإنتاج!)
JWT_SECRET=your-super-secret-jwt-key-change-this-in-production

# إعدادات البيئة
NODE_ENV=development
```

### الخطوة 3: تشغيل MongoDB

#### للتنصيب المحلي:
```bash
# تشغيل خدمة MongoDB
mongod
```

#### لاستخدام MongoDB Atlas:
- قم بإنشاء حساب على [MongoDB Atlas](https://www.mongodb.com/atlas)
- أنشئ Cluster جديد
- احصل على connection string
- استبدل `MONGODB_URI` في ملف `.env`

### الخطوة 4: تشغيل المشروع

```bash
# للتطوير (مع إعادة التشغيل التلقائي)
npm run dev

# أو للتشغيل العادي
npm start
```

### الخطوة 5: إضافة بيانات تجريبية (اختياري)

```bash
npm run seed
```

## الوصول إلى المشروع

بعد التشغيل الناجح:

- **GraphQL Playground**: http://localhost:4000
- **API Endpoint**: http://localhost:4000/graphql
- **Authentication Routes**: http://localhost:4000/auth

## 🚀 **المشروع يعمل الآن مع بيانات وهمية!**

### اختبار سريع:
```graphql
# في GraphQL Playground (http://localhost:4000)
query {
  allPosts {
    id
    platform
    content
    likes
    author
  }
}
```

### مستخدمون للاختبار:
- **Email**: ahmed@example.com **Password**: password123
- **Email**: sara@example.com **Password**: password123
- **Email**: omar@example.com **Password**: password123

### مثال تسجيل دخول:
```bash
curl -X POST http://localhost:4000/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"ahmed@example.com","password":"password123"}'
```

📖 **راجع ملف `API_USAGE_GUIDE.md` للحصول على دليل شامل!**

## بنية المشروع

```
social-media-api/
├── src/
│   ├── config/
│   │   └── db.js              # إعداد قاعدة البيانات
│   ├── graphql/
│   │   ├── index.js           # تجميع GraphQL
│   │   ├── resolvers/         # GraphQL Resolvers
│   │   └── schemas/           # GraphQL Schemas
│   ├── middleware/
│   │   └── auth.js            # وسائل المصادقة
│   ├── models/
│   │   ├── User.js            # نموذج المستخدم
│   │   ├── SocialContent.js   # نموذج المحتوى
│   │   └── SocialAnalytics.js # نموذج التحليلات
│   ├── routes/
│   │   └── auth.js            # مسارات المصادقة
│   ├── seed/
│   │   └── seedData.js        # بيانات تجريبية
│   └── utils/
│       ├── errorHandler.js    # معالج الأخطاء
│       └── logger.js          # نظام التسجيل
├── Tests/
│   └── socialMedia.test.js    # اختبارات المشروع
├── index.js                   # نقطة البداية
└── package.json               # معلومات المشروع
```

## الأوامر المتاحة

```bash
npm start          # تشغيل المشروع
npm run dev        # تشغيل للتطوير مع nodemon
npm test           # تشغيل الاختبارات
npm run seed       # إضافة بيانات تجريبية
```

## استكشاف الأخطاء الشائعة

### خطأ في الاتصال بـ MongoDB
```
MongoDB connection error: connect ECONNREFUSED 127.0.0.1:27017
```
**الحل**: تأكد من تشغيل خدمة MongoDB محلياً أو تحقق من صحة connection string

### خطأ في متغيرات البيئة
```
Error: JWT_SECRET is not defined
```
**الحل**: تأكد من وجود ملف `.env` وأنه يحتوي على جميع المتغيرات المطلوبة

### خطأ في المنفذ
```
Error: listen EADDRINUSE :::4000
```
**الحل**: المنفذ 4000 مستخدم، غيّر `PORT` في ملف `.env` أو أغلق العملية التي تستخدم المنفذ

## الميزات الرئيسية

- 🔐 **نظام مصادقة** باستخدام JWT
- 📊 **تحليلات المحتوى** مع إحصائيات مفصلة
- 🚀 **GraphQL API** للاستعلامات المرنة
- 📝 **إدارة المحتوى** الكاملة
- 🧪 **اختبارات شاملة** مع Jest
- 📋 **تسجيل متقدم** مع Winston

## المساهمة

للمساهمة في المشروع:
1. قم بعمل Fork للمشروع
2. أنشئ branch جديد لميزتك
3. اكتب اختبارات لكودك الجديد
4. قم بعمل commit لتغييراتك
5. ادفع إلى branch الخاص بك
6. أنشئ Pull Request

## الترخيص

هذا المشروع مرخص تحت رخصة MIT - راجع ملف LICENSE للتفاصيل. 