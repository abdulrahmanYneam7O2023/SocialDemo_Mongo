const mongoose = require('mongoose');
const { User } = require('./src/models/User');
const { SocialConnection, SocialContent, SocialAnalytics } = require('./src/models/SocialMediaModels');

// التأكد من load المتغيرات البيئية
require('dotenv').config();

// MongoDB URI مباشرة (يمكن تغييرها حسب الحاجة)
const MONGODB_URI = process.env.MONGODB_URI || 'mongodb+srv://abdulrahman:201621623An@ac-hg1kzhy.icjtx3t.mongodb.net/socialApi';

// بيانات حقيقية للمستخدمين
const userData = [
  { name: 'أحمد محمد علي', email: 'ahmed.ali@example.com', role: 'ADMIN' },
  { name: 'فاطمة السيد حسن', email: 'fatma.hassan@example.com', role: 'USER' },
  { name: 'محمد إبراهيم محمود', email: 'mohamed.mahmoud@example.com', role: 'MANAGER' },
  { name: 'مريم أحمد عبدالله', email: 'mariam.abdullah@example.com', role: 'USER' },
  { name: 'عمر خالد الشريف', email: 'omar.alsharif@example.com', role: 'USER' },
  { name: 'سارة محمد الزهراء', email: 'sara.alzahra@example.com', role: 'MANAGER' },
  { name: 'يوسف علي الدين', email: 'yousef.aldin@example.com', role: 'USER' },
  { name: 'نور الهدى عبدالرحمن', email: 'nour.abdulrahman@example.com', role: 'USER' },
  { name: 'كريم أسامة فؤاد', email: 'karim.fouad@example.com', role: 'USER' },
  { name: 'دينا طارق السعيد', email: 'dina.alsaeed@example.com', role: 'MANAGER' }
];

// أسماء أكانت حقيقية للسوشيال ميديا
const socialAccountNames = [
  'tech_enthusiast_eg', 'cairo_foodie', 'travel_egypt_blog', 'fitness_trainer_alex',
  'music_lover_official', 'photography_cairo', 'business_growth_tips', 'cooking_with_mama',
  'sports_fan_egypt', 'art_gallery_official', 'fashion_style_blog', 'health_wellness_coach',
  'gaming_community_eg', 'education_hub_egypt', 'lifestyle_blogger_cairo', 'tech_reviews_arabic',
  'beauty_secrets_eg', 'travel_adventures_mena', 'food_recipes_arabic', 'fitness_motivation_eg'
];

// روابط حقيقية للفيديوهات والصور
const realMediaUrls = {
  youtube: [
    'https://www.youtube.com/watch?v=dQw4w9WgXcQ',
    'https://www.youtube.com/watch?v=9bZkp7q19f0',
    'https://www.youtube.com/watch?v=ScMzIvxBSi4',
    'https://www.youtube.com/watch?v=60ItHLz5WEA',
    'https://www.youtube.com/watch?v=fJ9rUzIMcZQ',
    'https://www.youtube.com/watch?v=SQoA_wjmE9w',
    'https://www.youtube.com/watch?v=ZZ5LpwO-An4',
    'https://www.youtube.com/watch?v=hTWKbfoikeg',
    'https://www.youtube.com/watch?v=Zi_XLOBDo_Y',
    'https://www.youtube.com/watch?v=kJQP7kiw5Fk'
  ],
  images: [
    'https://picsum.photos/800/600?random=1',
    'https://picsum.photos/800/600?random=2',
    'https://picsum.photos/800/600?random=3',
    'https://picsum.photos/800/600?random=4',
    'https://picsum.photos/800/600?random=5',
    'https://picsum.photos/1200/800?random=6',
    'https://picsum.photos/1200/800?random=7',
    'https://picsum.photos/1200/800?random=8',
    'https://picsum.photos/1200/800?random=9',
    'https://picsum.photos/1200/800?random=10'
  ],
  facebook: [
    'https://www.facebook.com/watch/?v=123456789',
    'https://www.facebook.com/watch/?v=987654321',
    'https://www.facebook.com/photo/?fbid=123456789',
    'https://www.facebook.com/photo/?fbid=987654321',
    'https://www.facebook.com/reel/123456789',
    'https://www.facebook.com/reel/987654321'
  ]
};

// محتوى حقيقي للمنشورات
const contentTemplates = [
  {
    title: 'نصائح تقنية مفيدة',
    description: 'أفضل النصائح في عالم التكنولوجيا',
    caption: 'تعلم معنا أحدث التقنيات وطور مهاراتك! 🚀 #تقنية #تطوير #برمجة',
    hashtags: ['#تقنية', '#برمجة', '#تطوير', '#تعلم', '#مصر']
  },
  {
    title: 'وصفات طبخ شهية',
    description: 'أشهى الوصفات المصرية التقليدية',
    caption: 'جربوا معايا الوصفة دي هتعجبكم جداً! 😋 #طبخ #وصفات #مصري',
    hashtags: ['#طبخ', '#وصفات', '#مصري', '#شهي', '#بيتي']
  },
  {
    title: 'سفر ومغامرات',
    description: 'اكتشف أجمل الأماكن في مصر والعالم',
    caption: 'رحلة رائعة لأجمل الأماكن في مصر! 🏖️ #سفر #مصر #سياحة',
    hashtags: ['#سفر', '#مصر', '#سياحة', '#مغامرة', '#جمال']
  },
  {
    title: 'تمارين رياضية',
    description: 'تمارين يومية للحفاظ على اللياقة البدنية',
    caption: 'تمرين اليوم هيخليكم في أحسن حال! 💪 #رياضة #لياقة #صحة',
    hashtags: ['#رياضة', '#لياقة', '#صحة', '#تمارين', '#قوة']
  },
  {
    title: 'موسيقى وفن',
    description: 'أجمل الألحان والأغاني العربية',
    caption: 'استمتعوا بأجمل الألحان معانا! 🎵 #موسيقى #فن #عربي',
    hashtags: ['#موسيقى', '#فن', '#عربي', '#أغاني', '#طرب']
  }
];

// دالة إنشاء بيانات عشوائية
function getRandomElement(array) {
  return array[Math.floor(Math.random() * array.length)];
}

function generateRandomNumber(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

function generateRandomDate(start, end) {
  return new Date(start.getTime() + Math.random() * (end.getTime() - start.getTime()));
}

async function seedDatabase() {
  try {
    console.log('🚀 بدء عملية رفع البيانات إلى قاعدة البيانات...');
    
    // الاتصال بقاعدة البيانات
    if (!MONGODB_URI) {
      throw new Error('❌ MONGODB_URI غير موجود في متغيرات البيئة');
    }
    
    await mongoose.connect(MONGODB_URI);
    console.log('✅ تم الاتصال بقاعدة البيانات بنجاح');

    // 1. إنشاء 50 مستخدم
    console.log('\n👥 إنشاء 50 مستخدم...');
    const users = [];
    
    // حذف البيانات القديمة
    await User.deleteMany({});
    
    for (let i = 0; i < 50; i++) {
      const baseUser = userData[i % userData.length];
      const user = await User.create({
        email: `${baseUser.email.split('@')[0]}_${i + 1}@example.com`,
        name: `${baseUser.name} ${i + 1}`,
        role: getRandomElement(['ADMIN', 'USER', 'MANAGER']),
        isActive: Math.random() > 0.1, // 90% نشط
        tenant: 'default'
      });
      users.push(user);
    }
    console.log(`✅ تم إنشاء ${users.length} مستخدم`);

    // 2. إنشاء 50 اتصال سوشيال ميديا
    console.log('\n🔗 إنشاء 50 اتصال سوشيال ميديا...');
    const connections = [];
    
    await SocialConnection.deleteMany({});
    
    const platforms = ['INSTAGRAM', 'FACEBOOK', 'TWITTER', 'LINKEDIN', 'TIKTOK', 'YOUTUBE'];
    
    for (let i = 0; i < 50; i++) {
      const user = getRandomElement(users);
      const platform = getRandomElement(platforms);
      const accountName = `${getRandomElement(socialAccountNames)}_${i + 1}`;
      
      const connection = await SocialConnection.create({
        platform: platform,
        platformAccountName: accountName,
        platformAccountHandle: accountName.toLowerCase(),
        platformAccountUsername: accountName.replace(/_/g, ' ').toUpperCase(),
        platformAccountId: `${platform.toLowerCase()}_${generateRandomNumber(100000, 999999)}`,
        platformAccountProfilePicture: getRandomElement(realMediaUrls.images),
        connectionStatus: getRandomElement(['ACTIVE', 'INACTIVE', 'EXPIRED']),
        followerCount: generateRandomNumber(100, 50000),
        followingCount: generateRandomNumber(50, 2000),
        isVerified: Math.random() > 0.7, // 30% verified
        connectedAt: generateRandomDate(new Date(2023, 0, 1), new Date()),
        lastSyncAt: generateRandomDate(new Date(2024, 0, 1), new Date()),
        accessToken: `token_${platform.toLowerCase()}_${generateRandomNumber(10000, 99999)}`,
        refreshToken: `refresh_${platform.toLowerCase()}_${generateRandomNumber(10000, 99999)}`,
        tokenExpiresAt: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000), // 30 days
        tenant: 'default',
        userId: user._id,
        userInfo: {
          email: user.email,
          name: user.name,
          role: user.role,
          isActive: user.isActive
        }
      });
      connections.push(connection);
    }
    console.log(`✅ تم إنشاء ${connections.length} اتصال سوشيال ميديا`);

    // 3. إنشاء 50 محتوى سوشيال ميديا
    console.log('\n📱 إنشاء 50 محتوى سوشيال ميديا...');
    const contents = [];
    
    await SocialContent.deleteMany({});
    
    const contentTypes = ['POST', 'VIDEO', 'IMAGE', 'REEL', 'STORY'];
    const publishStatuses = ['PUBLISHED', 'DRAFT', 'SCHEDULED', 'FAILED'];
    
    for (let i = 0; i < 50; i++) {
      const connection = getRandomElement(connections);
      const contentTemplate = getRandomElement(contentTemplates);
      const contentType = getRandomElement(contentTypes);
      
      // اختيار الروابط حسب نوع المحتوى والمنصة
      let mediaFiles = [];
      if (contentType === 'VIDEO') {
        if (connection.platform === 'YOUTUBE') {
          mediaFiles = [getRandomElement(realMediaUrls.youtube)];
        } else if (connection.platform === 'FACEBOOK') {
          mediaFiles = [getRandomElement(realMediaUrls.facebook)];
        } else {
          mediaFiles = [getRandomElement(realMediaUrls.youtube)];
        }
      } else if (contentType === 'IMAGE' || contentType === 'POST') {
        mediaFiles = [
          getRandomElement(realMediaUrls.images),
          getRandomElement(realMediaUrls.images)
        ];
      }

      const content = await SocialContent.create({
        contentId: `content_${i + 1}_${Date.now()}`,
        platform: connection.platform,
        contentType: contentType,
        connection: connection._id,
        content: `${contentTemplate.caption} ${i + 1}`, // String instead of object
        title: `${contentTemplate.title} ${i + 1}`,
        description: `${contentTemplate.description} - ${i + 1}`,
        hashtags: contentTemplate.hashtags,
        mentions: i % 3 === 0 ? [`@user_${generateRandomNumber(1, 10)}`] : [],
        author: connection.userInfo.name,
        mediaFiles: mediaFiles,
        publishStatus: getRandomElement(publishStatuses),
        scheduledAt: Math.random() > 0.5 ? generateRandomDate(new Date(), new Date(Date.now() + 7 * 24 * 60 * 60 * 1000)) : null,
        publishedAt: getRandomElement(publishStatuses) === 'PUBLISHED' ? generateRandomDate(new Date(2024, 0, 1), new Date()) : null,
        
        // إعدادات متقدمة
        settings: {
          locationId: i % 5 === 0 ? `location_${generateRandomNumber(1, 100)}` : null,
          locationName: i % 5 === 0 ? `القاهرة، مصر` : null,
          altText: contentType === 'IMAGE' ? `صورة ${i + 1}` : null,
          link: i % 4 === 0 ? `https://example.com/link_${i + 1}` : null,
          linkName: i % 4 === 0 ? `رابط ${i + 1}` : null,
          linkCaption: i % 4 === 0 ? `وصف الرابط ${i + 1}` : null,
          linkDescription: i % 4 === 0 ? `تفاصيل الرابط ${i + 1}` : null,
          isThread: Math.random() > 0.8,
          visibility: getRandomElement(['PUBLIC', 'CONNECTIONS']),
          privacyLevel: getRandomElement(['PUBLIC_TO_EVERYONE', 'MUTUAL_FOLLOW_FRIENDS']),
          disableDuet: Math.random() > 0.7,
          disableComment: Math.random() > 0.9,
          disableStitch: Math.random() > 0.8,
          privacyStatus: getRandomElement(['public', 'private', 'unlisted']),
          categoryId: `cat_${generateRandomNumber(1, 10)}`,
          defaultLanguage: 'ar',
          commentsEnabled: Math.random() > 0.2
        },
        
        tenant: 'default'
      });
      contents.push(content);
    }
    console.log(`✅ تم إنشاء ${contents.length} محتوى سوشيال ميديا`);

    // 4. إنشاء 50 تحليل سوشيال ميديا
    console.log('\n📊 إنشاء 50 تحليل سوشيال ميديا...');
    const analytics = [];
    
    await SocialAnalytics.deleteMany({});
    
    for (let i = 0; i < 50; i++) {
      const content = getRandomElement(contents);
      const connection = connections.find(c => c._id.toString() === content.connection.toString());
      
      const analytic = await SocialAnalytics.create({
        analyticsId: `analytics_${i + 1}_${Date.now()}`,
        platform: content.platform,
        contentId: content._id,
        connectionId: connection._id,
        
        // مقاييس الأداء
        metrics: {
          views: generateRandomNumber(100, 10000),
          likes: generateRandomNumber(10, 1000),
          comments: generateRandomNumber(5, 200),
          shares: generateRandomNumber(1, 100),
          saves: generateRandomNumber(5, 150),
          clicks: generateRandomNumber(20, 500),
          impressions: generateRandomNumber(500, 20000),
          reach: generateRandomNumber(200, 15000),
          engagement: generateRandomNumber(50, 1500),
          followers_gained: generateRandomNumber(0, 50),
          followers_lost: generateRandomNumber(0, 20)
        },
        
        // تفاصيل الجمهور
        audience: {
          demographics: {
            age_groups: {
              '18-24': generateRandomNumber(15, 35),
              '25-34': generateRandomNumber(25, 45),
              '35-44': generateRandomNumber(15, 30),
              '45-54': generateRandomNumber(10, 25),
              '55+': generateRandomNumber(5, 15)
            },
            gender: {
              male: generateRandomNumber(30, 70),
              female: generateRandomNumber(30, 70)
            },
            locations: {
              'Cairo': generateRandomNumber(20, 40),
              'Alexandria': generateRandomNumber(10, 25),
              'Giza': generateRandomNumber(15, 30),
              'Other': generateRandomNumber(15, 35)
            }
          },
          interests: ['تقنية', 'طبخ', 'سفر', 'رياضة', 'موسيقى', 'فن'].slice(0, generateRandomNumber(2, 4)),
          languages: ['Arabic', 'English'],
          devices: {
            mobile: generateRandomNumber(60, 90),
            desktop: generateRandomNumber(10, 40),
            tablet: generateRandomNumber(5, 20)
          }
        },
        
        // أداء الوقت
        performance: {
          peak_hours: [generateRandomNumber(9, 12), generateRandomNumber(18, 22)],
          best_days: getRandomElement([['Monday', 'Wednesday'], ['Friday', 'Saturday'], ['Sunday', 'Tuesday']]),
          engagement_rate: generateRandomNumber(2, 15),
          conversion_rate: generateRandomNumber(1, 8),
          bounce_rate: generateRandomNumber(20, 60),
          session_duration: generateRandomNumber(30, 300) // seconds
        },
        
        // المقارنات
        comparison: {
          previous_period: {
            views_change: generateRandomNumber(-30, 50),
            likes_change: generateRandomNumber(-20, 40),
            engagement_change: generateRandomNumber(-25, 35)
          },
          industry_average: {
            engagement_rate: generateRandomNumber(3, 8),
            reach_rate: generateRandomNumber(15, 35)
          }
        },
        
        // البيانات المالية
        revenue: i % 10 === 0 ? {
          ad_revenue: generateRandomNumber(10, 500),
          sponsored_content: generateRandomNumber(50, 1000),
          affiliate_earnings: generateRandomNumber(5, 200),
          total_earnings: generateRandomNumber(65, 1700)
        } : null,
        
        // التكاليف
        costs: i % 15 === 0 ? {
          ad_spend: generateRandomNumber(20, 300),
          content_creation: generateRandomNumber(50, 500),
          tools_and_software: generateRandomNumber(10, 100)
        } : null,
        
        // الفترة الزمنية
        period: {
          start_date: generateRandomDate(new Date(2024, 0, 1), new Date(2024, 10, 1)),
          end_date: generateRandomDate(new Date(2024, 10, 1), new Date()),
          duration_days: generateRandomNumber(1, 30)
        },
        
        tenant: 'default'
      });
      analytics.push(analytic);
    }
    console.log(`✅ تم إنشاء ${analytics.length} تحليل سوشيال ميديا`);

    // 5. عرض الملخص النهائي
    console.log('\n📋 ملخص البيانات المُنشأة:');
    console.log('='.repeat(50));
    console.log(`👥 المستخدمين: ${users.length}`);
    console.log(`🔗 الاتصالات: ${connections.length}`);
    console.log(`📱 المحتوى: ${contents.length}`);
    console.log(`📊 التحليلات: ${analytics.length}`);
    console.log('='.repeat(50));
    
    // إحصائيات إضافية
    const activeConnections = connections.filter(c => c.connectionStatus === 'ACTIVE').length;
    const publishedContent = contents.filter(c => c.publishStatus === 'PUBLISHED').length;
    const totalViews = analytics.reduce((sum, a) => sum + a.metrics.views, 0);
    const totalLikes = analytics.reduce((sum, a) => sum + a.metrics.likes, 0);
    
    console.log('\n📈 إحصائيات سريعة:');
    console.log(`🟢 الاتصالات النشطة: ${activeConnections}/${connections.length}`);
    console.log(`📺 المحتوى المنشور: ${publishedContent}/${contents.length}`);
    console.log(`👀 إجمالي المشاهدات: ${totalViews.toLocaleString()}`);
    console.log(`❤️ إجمالي الإعجابات: ${totalLikes.toLocaleString()}`);
    
    // عرض عينات من البيانات
    console.log('\n🔍 عينات من البيانات:');
    console.log('\n👤 عينة مستخدم:');
    console.log(`   الاسم: ${users[0].name}`);
    console.log(`   البريد: ${users[0].email}`);
    console.log(`   الدور: ${users[0].role}`);
    
    console.log('\n🔗 عينة اتصال:');
    console.log(`   المنصة: ${connections[0].platform}`);
    console.log(`   الحساب: ${connections[0].platformAccountName}`);
    console.log(`   المتابعين: ${connections[0].followerCount.toLocaleString()}`);
    
    console.log('\n📱 عينة محتوى:');
    console.log(`   العنوان: ${contents[0].title}`);
    console.log(`   النوع: ${contents[0].contentType}`);
    console.log(`   المنصة: ${contents[0].platform}`);
    console.log(`   الحالة: ${contents[0].publishStatus}`);
    if (contents[0].mediaFiles && contents[0].mediaFiles.length > 0) {
      console.log(`   الملفات: ${contents[0].mediaFiles[0]}`);
    }
    
    console.log('\n📊 عينة تحليل:');
    console.log(`   المشاهدات: ${analytics[0].metrics.views.toLocaleString()}`);
    console.log(`   الإعجابات: ${analytics[0].metrics.likes.toLocaleString()}`);
    console.log(`   التفاعل: ${analytics[0].metrics.engagement.toLocaleString()}`);
    
    console.log('\n🎉 تم رفع جميع البيانات بنجاح!');
    console.log('🌐 يمكنك الآن استخدام GraphQL Playground على: http://localhost:4000/graphql');
    
  } catch (error) {
    console.error('❌ خطأ في رفع البيانات:', error);
  } finally {
    await mongoose.disconnect();
    console.log('🔌 تم قطع الاتصال بقاعدة البيانات');
    process.exit(0);
  }
}

// تشغيل السكريبت
if (require.main === module) {
  seedDatabase();
}

module.exports = { seedDatabase }; 