const mongoose = require('mongoose');
const { User } = require('./src/models/User');
const { SocialConnection, SocialContent, SocialAnalytics } = require('./src/models/SocialMediaModels');

// MongoDB URI المطلوب
const MONGODB_URI = 'mongodb+srv://abdulrahman:201621623An@ac-hg1kzhy.icjtx3t.mongodb.net/socialApi';

// بيانات حقيقية ومتنوعة
const userData = [
  { name: 'أحمد محمد علي', email: 'ahmed.ali@socialmedia.com', role: 'ADMIN' },
  { name: 'فاطمة السيد حسن', email: 'fatma.hassan@socialmedia.com', role: 'USER' },
  { name: 'محمد إبراهيم محمود', email: 'mohamed.mahmoud@socialmedia.com', role: 'MANAGER' },
  { name: 'مريم أحمد عبدالله', email: 'mariam.abdullah@socialmedia.com', role: 'USER' },
  { name: 'عمر خالد الشريف', email: 'omar.alsharif@socialmedia.com', role: 'USER' },
  { name: 'سارة محمد الزهراء', email: 'sara.alzahra@socialmedia.com', role: 'MANAGER' },
  { name: 'يوسف علي الدين', email: 'yousef.aldin@socialmedia.com', role: 'USER' },
  { name: 'نور الهدى عبدالرحمن', email: 'nour.abdulrahman@socialmedia.com', role: 'USER' },
  { name: 'كريم أسامة فؤاد', email: 'karim.fouad@socialmedia.com', role: 'USER' },
  { name: 'دينا طارق السعيد', email: 'dina.alsaeed@socialmedia.com', role: 'MANAGER' }
];

const socialAccountNames = [
  'tech_enthusiast_eg', 'cairo_foodie', 'travel_egypt_blog', 'fitness_trainer_alex',
  'music_lover_official', 'photography_cairo', 'business_growth_tips', 'cooking_with_mama',
  'sports_fan_egypt', 'art_gallery_official', 'fashion_style_blog', 'health_wellness_coach',
  'gaming_community_eg', 'education_hub_egypt', 'lifestyle_blogger_cairo', 'tech_reviews_arabic',
  'beauty_secrets_eg', 'travel_adventures_mena', 'food_recipes_arabic', 'fitness_motivation_eg'
];

// روابط حقيقية مباشرة
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

const contentTemplates = [
  {
    title: 'نصائح تقنية مفيدة للمطورين',
    description: 'أفضل النصائح في عالم التكنولوجيا والبرمجة',
    caption: 'تعلم معنا أحدث التقنيات وطور مهاراتك! 🚀 #تقنية #تطوير #برمجة',
    hashtags: ['#تقنية', '#برمجة', '#تطوير', '#تعلم', '#مصر']
  },
  {
    title: 'وصفات طبخ شهية ومميزة',
    description: 'أشهى الوصفات المصرية التقليدية والعالمية',
    caption: 'جربوا معايا الوصفة دي هتعجبكم جداً! 😋 #طبخ #وصفات #مصري',
    hashtags: ['#طبخ', '#وصفات', '#مصري', '#شهي', '#بيتي']
  },
  {
    title: 'سفر ومغامرات حول العالم',
    description: 'اكتشف أجمل الأماكن في مصر والعالم',
    caption: 'رحلة رائعة لأجمل الأماكن في مصر! 🏖️ #سفر #مصر #سياحة',
    hashtags: ['#سفر', '#مصر', '#سياحة', '#مغامرة', '#جمال']
  },
  {
    title: 'تمارين رياضية يومية',
    description: 'تمارين يومية للحفاظ على اللياقة البدنية',
    caption: 'تمرين اليوم هيخليكم في أحسن حال! 💪 #رياضة #لياقة #صحة',
    hashtags: ['#رياضة', '#لياقة', '#صحة', '#تمارين', '#قوة']
  },
  {
    title: 'موسيقى وفن عربي أصيل',
    description: 'أجمل الألحان والأغاني العربية',
    caption: 'استمتعوا بأجمل الألحان معانا! 🎵 #موسيقى #فن #عربي',
    hashtags: ['#موسيقى', '#فن', '#عربي', '#أغاني', '#طرب']
  }
];

// دوال مساعدة
function getRandomElement(array) {
  return array[Math.floor(Math.random() * array.length)];
}

function generateRandomNumber(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

function generateRandomDate(start, end) {
  return new Date(start.getTime() + Math.random() * (end.getTime() - start.getTime()));
}

async function clearAllData() {
  console.log('🗑️ حذف جميع البيانات القديمة...');
  try {
    await User.deleteMany({});
    await SocialConnection.deleteMany({});
    await SocialContent.deleteMany({});
    await SocialAnalytics.deleteMany({});
    console.log('✅ تم حذف جميع البيانات القديمة');
  } catch (error) {
    console.log('⚠️ تحذير: بعض المجموعات غير موجودة (طبيعي للمرة الأولى)');
  }
}

async function seedUsers() {
  console.log('\n👥 إنشاء 50 مستخدم...');
  const users = [];
  
  for (let i = 0; i < 50; i++) {
    const baseUser = userData[i % userData.length];
    const user = await User.create({
      email: `${baseUser.email.split('@')[0]}_${i + 1}@socialmedia.com`,
      name: `${baseUser.name} ${i + 1}`,
      role: getRandomElement(['ADMIN', 'USER', 'MANAGER']),
      isActive: Math.random() > 0.1, // 90% نشط
      tenant: 'default'
    });
    users.push(user);
    
    if ((i + 1) % 10 === 0) {
      console.log(`✅ تم إنشاء ${i + 1} مستخدم`);
    }
  }
  
  console.log(`🎉 تم إنشاء ${users.length} مستخدم بنجاح`);
  return users;
}

async function seedConnections(users) {
  console.log('\n🔗 إنشاء 50 اتصال سوشيال ميديا...');
  const connections = [];
  
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
    
    if ((i + 1) % 10 === 0) {
      console.log(`✅ تم إنشاء ${i + 1} اتصال`);
    }
  }
  
  console.log(`🎉 تم إنشاء ${connections.length} اتصال بنجاح`);
  return connections;
}

async function seedContent(connections) {
  console.log('\n📱 إنشاء 50 محتوى سوشيال ميديا...');
  const contents = [];
  
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
      content: `${contentTemplate.caption} ${i + 1}`,
      title: `${contentTemplate.title} ${i + 1}`,
      description: `${contentTemplate.description} - محتوى رقم ${i + 1}`,
      hashtags: contentTemplate.hashtags,
      mentions: i % 3 === 0 ? [`@user_${generateRandomNumber(1, 10)}`] : [],
      author: connection.userInfo.name,
      mediaFiles: mediaFiles,
      publishStatus: getRandomElement(publishStatuses),
      scheduledAt: Math.random() > 0.5 ? generateRandomDate(new Date(), new Date(Date.now() + 7 * 24 * 60 * 60 * 1000)) : null,
      publishedAt: getRandomElement(publishStatuses) === 'PUBLISHED' ? generateRandomDate(new Date(2024, 0, 1), new Date()) : null,
      tenant: 'default'
    });
    contents.push(content);
    
    if ((i + 1) % 10 === 0) {
      console.log(`✅ تم إنشاء ${i + 1} محتوى`);
    }
  }
  
  console.log(`🎉 تم إنشاء ${contents.length} محتوى بنجاح`);
  return contents;
}

async function seedAnalytics(contents, connections) {
  console.log('\n📊 إنشاء 50 تحليل سوشيال ميديا...');
  const analytics = [];
  
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
        session_duration: generateRandomNumber(30, 300)
      },
      
      tenant: 'default'
    });
    analytics.push(analytic);
    
    if ((i + 1) % 10 === 0) {
      console.log(`✅ تم إنشاء ${i + 1} تحليل`);
    }
  }
  
  console.log(`🎉 تم إنشاء ${analytics.length} تحليل بنجاح`);
  return analytics;
}

async function generateFinalSummary(users, connections, contents, analytics) {
  console.log('\n' + '='.repeat(80));
  console.log('🎉 تم إنشاء قاعدة البيانات الشاملة بنجاح!');
  console.log('='.repeat(80));
  
  console.log('\n📊 الإحصائيات النهائية:');
  console.log(`👥 المستخدمين: ${users.length}/50 ✅`);
  console.log(`🔗 الاتصالات: ${connections.length}/50 ✅`);
  console.log(`📱 المحتوى: ${contents.length}/50 ✅`);
  console.log(`📊 التحليلات: ${analytics.length}/50 ✅`);
  
  // إحصائيات المنصات
  const platformStats = {};
  connections.forEach(conn => {
    platformStats[conn.platform] = (platformStats[conn.platform] || 0) + 1;
  });
  
  console.log('\n📱 توزيع المنصات:');
  Object.entries(platformStats).forEach(([platform, count]) => {
    console.log(`   ${platform}: ${count} اتصال`);
  });
  
  // إحصائيات أداء
  const totalViews = analytics.reduce((sum, a) => sum + a.metrics.views, 0);
  const totalLikes = analytics.reduce((sum, a) => sum + a.metrics.likes, 0);
  const avgViews = Math.round(totalViews / analytics.length);
  
  console.log('\n📈 إحصائيات الأداء:');
  console.log(`👀 إجمالي المشاهدات: ${totalViews.toLocaleString()}`);
  console.log(`❤️ إجمالي الإعجابات: ${totalLikes.toLocaleString()}`);
  console.log(`📊 متوسط المشاهدات: ${avgViews.toLocaleString()}`);
  
  // عينات من الروابط
  console.log('\n🔗 عينات من الروابط المباشرة:');
  const sampleContent = contents.filter(c => c.mediaFiles && c.mediaFiles.length > 0).slice(0, 5);
  sampleContent.forEach((content, index) => {
    console.log(`   ${index + 1}. ${content.title}`);
    console.log(`      🎬 ${content.mediaFiles[0]}`);
  });
  
  console.log('\n🌐 روابط مفيدة:');
  console.log('   📊 GraphQL Playground: http://localhost:4000/graphql');
  console.log('   🔍 استعلامات جاهزة متوفرة في الـ playground');
  console.log('   📝 جميع العمليات CRUD متاحة');
  
  console.log('\n✨ المميزات المتوفرة:');
  console.log('   ✅ روابط يوتيوب وفيسبوك مباشرة');
  console.log('   ✅ صور عشوائية من Picsum');
  console.log('   ✅ بيانات مستخدمين باللغة العربية');
  console.log('   ✅ تحليلات شاملة لكل محتوى');
  console.log('   ✅ علاقات مترابطة بين النماذج');
  console.log('   ✅ دعم جميع منصات التواصل');
  
  console.log('\n🎯 الخطوات التالية:');
  console.log('   1. شغل السيرفر: npm start');
  console.log('   2. افتح GraphQL Playground');
  console.log('   3. جرب الاستعلامات والطفرات');
  console.log('   4. استكشف البيانات والعلاقات');
  
  console.log('\n🚀 مبروك! قاعدة البيانات جاهزة للاستخدام!');
}

async function runComprehensiveSeed() {
  try {
    console.log('🚀 بدء إنشاء قاعدة البيانات الشاملة...');
    console.log('📋 قاعدة البيانات: socialApi');
    console.log('🔗 الخادم: MongoDB Atlas');
    
    // الاتصال بقاعدة البيانات
    await mongoose.connect(MONGODB_URI);
    console.log('✅ تم الاتصال بقاعدة البيانات بنجاح');
    
    // حذف البيانات القديمة
    await clearAllData();
    
    // إنشاء البيانات الجديدة
    const users = await seedUsers();
    const connections = await seedConnections(users);
    const contents = await seedContent(connections);
    const analytics = await seedAnalytics(contents, connections);
    
    // ملخص نهائي
    await generateFinalSummary(users, connections, contents, analytics);
    
  } catch (error) {
    console.error('\n❌ خطأ في إنشاء قاعدة البيانات:', error);
    console.error('\n🔍 تفاصيل الخطأ:', error.message);
    
    if (error.message.includes('duplicate key')) {
      console.log('\n💡 نصيحة: جرب حذف المجموعات يدوياً من MongoDB Atlas أولاً');
    }
    
  } finally {
    await mongoose.disconnect();
    console.log('\n🔌 تم قطع الاتصال بقاعدة البيانات');
    process.exit(0);
  }
}

// تشغيل السكريبت
if (require.main === module) {
  runComprehensiveSeed();
}

module.exports = { runComprehensiveSeed }; 