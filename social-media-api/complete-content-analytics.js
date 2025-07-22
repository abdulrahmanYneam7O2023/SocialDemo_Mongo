const mongoose = require('mongoose');
const { SocialConnection, SocialContent, SocialAnalytics } = require('./src/models/SocialMediaModels');

const MONGODB_URI = 'mongodb+srv://abdulrahman:201621623An@ac-hg1kzhy.icjtx3t.mongodb.net/socialApi';

// روابط حقيقية
const realMediaUrls = {
  youtube: [
    'https://www.youtube.com/watch?v=dQw4w9WgXcQ',
    'https://www.youtube.com/watch?v=9bZkp7q19f0',
    'https://www.youtube.com/watch?v=ScMzIvxBSi4',
    'https://www.youtube.com/watch?v=60ItHLz5WEA',
    'https://www.youtube.com/watch?v=fJ9rUzIMcZQ'
  ],
  images: [
    'https://picsum.photos/800/600?random=1',
    'https://picsum.photos/800/600?random=2',
    'https://picsum.photos/1200/800?random=3',
    'https://picsum.photos/800/600?random=4',
    'https://picsum.photos/800/600?random=5'
  ],
  facebook: [
    'https://www.facebook.com/watch/?v=123456789',
    'https://www.facebook.com/photo/?fbid=123456789'
  ]
};

const contentTemplates = [
  {
    title: 'نصائح تقنية مفيدة',
    description: 'أفضل النصائح في عالم التكنولوجيا',
    caption: 'تعلم معنا أحدث التقنيات! 🚀 #تقنية #برمجة',
    hashtags: ['#تقنية', '#برمجة', '#تطوير']
  },
  {
    title: 'وصفات طبخ شهية',
    description: 'أشهى الوصفات المصرية',
    caption: 'جربوا الوصفة دي! 😋 #طبخ #وصفات',
    hashtags: ['#طبخ', '#وصفات', '#مصري']
  },
  {
    title: 'سفر ومغامرات',
    description: 'أجمل الأماكن في العالم',
    caption: 'رحلة رائعة! 🏖️ #سفر #سياحة',
    hashtags: ['#سفر', '#سياحة', '#مغامرة']
  },
  {
    title: 'تمارين رياضية',
    description: 'تمارين للياقة البدنية',
    caption: 'تمرين اليوم! 💪 #رياضة #لياقة',
    hashtags: ['#رياضة', '#لياقة', '#صحة']
  },
  {
    title: 'موسيقى وفن',
    description: 'أجمل الألحان العربية',
    caption: 'استمتعوا بالموسيقى! 🎵 #موسيقى #فن',
    hashtags: ['#موسيقى', '#فن', '#عربي']
  }
];

function getRandomElement(array) {
  return array[Math.floor(Math.random() * array.length)];
}

function generateRandomNumber(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

function generateRandomDate(start, end) {
  return new Date(start.getTime() + Math.random() * (end.getTime() - start.getTime()));
}

async function completeData() {
  try {
    console.log('🚀 إكمال المحتوى والتحليلات...');
    
    await mongoose.connect(MONGODB_URI);
    console.log('✅ متصل بقاعدة البيانات');

    // التحقق من الاتصالات الموجودة
    const connections = await SocialConnection.find();
    console.log(`🔗 وجدت ${connections.length} اتصال موجود`);

    if (connections.length === 0) {
      throw new Error('لا توجد اتصالات في قاعدة البيانات');
    }

    // إنشاء 50 محتوى
    console.log('\n📱 إنشاء 50 محتوى...');
    await SocialContent.deleteMany({}); // حذف المحتوى القديم
    
    const contents = [];
    const contentTypes = ['POST', 'VIDEO', 'IMAGE', 'REEL', 'STORY'];
    const publishStatuses = ['PUBLISHED', 'DRAFT', 'SCHEDULED'];

    for (let i = 0; i < 50; i++) {
      const connection = getRandomElement(connections);
      const template = getRandomElement(contentTemplates);
      const contentType = getRandomElement(contentTypes);

      // اختيار الروابط حسب النوع والمنصة
      let mediaFiles = [];
      if (contentType === 'VIDEO') {
        if (connection.platform === 'YOUTUBE') {
          mediaFiles = [getRandomElement(realMediaUrls.youtube)];
        } else if (connection.platform === 'FACEBOOK') {
          mediaFiles = [getRandomElement(realMediaUrls.facebook)];
        } else {
          mediaFiles = [getRandomElement(realMediaUrls.youtube)];
        }
      } else {
        mediaFiles = [getRandomElement(realMediaUrls.images)];
      }

      const content = await SocialContent.create({
        contentId: `content_${i + 1}_${Date.now()}`,
        platform: connection.platform,
        contentType: contentType,
        connection: connection._id,
        content: `${template.caption} ${i + 1}`,
        title: `${template.title} ${i + 1}`,
        description: `${template.description} - رقم ${i + 1}`,
        hashtags: template.hashtags,
        mentions: i % 3 === 0 ? [`@user_${generateRandomNumber(1, 10)}`] : [],
        author: connection.userInfo ? connection.userInfo.name : 'مؤلف غير معروف',
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

    // إنشاء 50 تحليل
    console.log('\n📊 إنشاء 50 تحليل...');
    await SocialAnalytics.deleteMany({}); // حذف التحليلات القديمة
    
    const analytics = [];

    for (let i = 0; i < 50; i++) {
      const content = getRandomElement(contents);
      const connection = connections.find(c => c._id.toString() === content.connection.toString());

      const analytic = await SocialAnalytics.create({
        analyticsId: `analytics_${i + 1}_${Date.now()}`,
        platform: content.platform,
        contentId: content._id,
        connectionId: connection._id,
        
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
          interests: ['تقنية', 'طبخ', 'سفر', 'رياضة', 'موسيقى'].slice(0, generateRandomNumber(2, 4)),
          languages: ['Arabic', 'English'],
          devices: {
            mobile: generateRandomNumber(60, 90),
            desktop: generateRandomNumber(10, 40),
            tablet: generateRandomNumber(5, 20)
          }
        },
        
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

    // ملخص نهائي
    console.log('\n' + '='.repeat(60));
    console.log('🎉 تم إكمال البيانات بنجاح!');
    console.log('='.repeat(60));
    console.log(`📱 المحتوى: ${contents.length}/50 ✅`);
    console.log(`📊 التحليلات: ${analytics.length}/50 ✅`);
    
    // إحصائيات أداء
    const totalViews = analytics.reduce((sum, a) => sum + a.metrics.views, 0);
    const totalLikes = analytics.reduce((sum, a) => sum + a.metrics.likes, 0);
    
    console.log('\n📈 إحصائيات الأداء:');
    console.log(`👀 إجمالي المشاهدات: ${totalViews.toLocaleString()}`);
    console.log(`❤️ إجمالي الإعجابات: ${totalLikes.toLocaleString()}`);
    
    // عينات روابط
    console.log('\n🔗 عينات روابط مباشرة:');
    const sampleContent = contents.filter(c => c.mediaFiles && c.mediaFiles.length > 0).slice(0, 5);
    sampleContent.forEach((content, index) => {
      console.log(`   ${index + 1}. ${content.title}`);
      console.log(`      🎬 ${content.mediaFiles[0]}`);
    });

    console.log('\n🎯 البيانات جاهزة الآن! يمكنك:');
    console.log('   📊 اختبار GraphQL API');
    console.log('   🌐 فتح GraphQL Playground: http://localhost:4000/graphql');
    console.log('   🔍 استكشاف البيانات والعلاقات');

    console.log('\n🚀 مبروك! قاعدة البيانات مكتملة 100%!');

  } catch (error) {
    console.error('\n❌ خطأ:', error);
  } finally {
    await mongoose.disconnect();
    console.log('\n🔌 تم قطع الاتصال');
    process.exit(0);
  }
}

completeData(); 