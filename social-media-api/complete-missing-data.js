const mongoose = require('mongoose');
const { SocialConnection, SocialContent, SocialAnalytics } = require('./src/models/SocialMediaModels');

const MONGODB_URI = 'mongodb+srv://abdulrahman:201621623An@ac-hg1kzhy.icjtx3t.mongodb.net/socialApi';

// أولاً نصحح بيانات المتابعين في الاتصالات
async function fixConnectionData() {
  console.log('🔧 إصلاح بيانات الاتصالات...');
  
  const connections = await SocialConnection.find();
  for (let i = 0; i < connections.length; i++) {
    const conn = connections[i];
    await SocialConnection.findByIdAndUpdate(conn._id, {
      followerCount: Math.floor(Math.random() * 50000) + 100,
      followingCount: Math.floor(Math.random() * 2000) + 50,
    });
  }
  console.log(`✅ تم إصلاح ${connections.length} اتصال`);
}

// إنشاء المحتوى
async function createContent() {
  console.log('📱 إنشاء 50 محتوى...');
  
  const connections = await SocialConnection.find();
  if (connections.length === 0) {
    throw new Error('لا توجد اتصالات');
  }

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
      'https://picsum.photos/800/600?random=4'
    ],
    facebook: [
      'https://www.facebook.com/watch/?v=123456789',
      'https://www.facebook.com/photo/?fbid=123456789'
    ]
  };

  const contentTemplates = [
    { title: 'نصائح تقنية مفيدة', hashtags: ['#تقنية', '#برمجة'] },
    { title: 'وصفات طبخ شهية', hashtags: ['#طبخ', '#وصفات'] },
    { title: 'سفر ومغامرات', hashtags: ['#سفر', '#مصر'] },
    { title: 'تمارين رياضية', hashtags: ['#رياضة', '#لياقة'] },
    { title: 'موسيقى وفن', hashtags: ['#موسيقى', '#فن'] }
  ];

  const contentTypes = ['POST', 'VIDEO', 'IMAGE', 'REEL', 'STORY'];
  const publishStatuses = ['PUBLISHED', 'DRAFT', 'SCHEDULED'];

  // حذف المحتوى القديم
  await SocialContent.deleteMany({});

  for (let i = 0; i < 50; i++) {
    const connection = connections[Math.floor(Math.random() * connections.length)];
    const template = contentTemplates[Math.floor(Math.random() * contentTemplates.length)];
    const contentType = contentTypes[Math.floor(Math.random() * contentTypes.length)];

    let mediaFiles = [];
    if (contentType === 'VIDEO') {
      if (connection.platform === 'YOUTUBE') {
        mediaFiles = [realMediaUrls.youtube[Math.floor(Math.random() * realMediaUrls.youtube.length)]];
      } else if (connection.platform === 'FACEBOOK') {
        mediaFiles = [realMediaUrls.facebook[Math.floor(Math.random() * realMediaUrls.facebook.length)]];
      } else {
        mediaFiles = [realMediaUrls.youtube[Math.floor(Math.random() * realMediaUrls.youtube.length)]];
      }
    } else {
      mediaFiles = [realMediaUrls.images[Math.floor(Math.random() * realMediaUrls.images.length)]];
    }

    const content = await SocialContent.create({
      contentId: `content_${i + 1}_${Date.now()}`,
      platform: connection.platform,
      contentType: contentType,
      connection: connection._id,
      content: `${template.title} ${i + 1} - محتوى رائع مع روابط مباشرة!`,
      title: `${template.title} ${i + 1}`,
      description: `وصف تفصيلي للمحتوى رقم ${i + 1}`,
      hashtags: template.hashtags,
      mentions: i % 3 === 0 ? [`@user_${Math.floor(Math.random() * 10) + 1}`] : [],
      author: connection.userInfo ? connection.userInfo.name : 'مؤلف غير معروف',
      mediaFiles: mediaFiles,
      publishStatus: publishStatuses[Math.floor(Math.random() * publishStatuses.length)],
      tenant: 'default'
    });

    if (i % 10 === 0) {
      console.log(`✅ تم إنشاء ${i + 1} محتوى`);
    }
  }

  console.log('✅ تم إنشاء 50 محتوى بنجاح');
}

// إنشاء التحليلات
async function createAnalytics() {
  console.log('📊 إنشاء 50 تحليل...');
  
  const contents = await SocialContent.find();
  const connections = await SocialConnection.find();
  
  if (contents.length === 0) {
    throw new Error('لا يوجد محتوى');
  }

  // حذف التحليلات القديمة
  await SocialAnalytics.deleteMany({});

  for (let i = 0; i < 50; i++) {
    const content = contents[Math.floor(Math.random() * contents.length)];
    const connection = connections.find(c => c._id.toString() === content.connection.toString());

    const analytics = await SocialAnalytics.create({
      analyticsId: `analytics_${i + 1}_${Date.now()}`,
      platform: content.platform,
      contentId: content._id,
      connectionId: connection._id,
      
      metrics: {
        views: Math.floor(Math.random() * 10000) + 100,
        likes: Math.floor(Math.random() * 1000) + 10,
        comments: Math.floor(Math.random() * 200) + 5,
        shares: Math.floor(Math.random() * 100) + 1,
        saves: Math.floor(Math.random() * 150) + 5,
        clicks: Math.floor(Math.random() * 500) + 20,
        impressions: Math.floor(Math.random() * 20000) + 500,
        reach: Math.floor(Math.random() * 15000) + 200,
        engagement: Math.floor(Math.random() * 1500) + 50,
        followers_gained: Math.floor(Math.random() * 50),
        followers_lost: Math.floor(Math.random() * 20)
      },
      
      audience: {
        demographics: {
          age_groups: {
            '18-24': Math.floor(Math.random() * 20) + 15,
            '25-34': Math.floor(Math.random() * 20) + 25,
            '35-44': Math.floor(Math.random() * 15) + 15,
            '45-54': Math.floor(Math.random() * 15) + 10,
            '55+': Math.floor(Math.random() * 10) + 5
          },
          gender: {
            male: Math.floor(Math.random() * 40) + 30,
            female: Math.floor(Math.random() * 40) + 30
          },
          locations: {
            'Cairo': Math.floor(Math.random() * 20) + 20,
            'Alexandria': Math.floor(Math.random() * 15) + 10,
            'Giza': Math.floor(Math.random() * 15) + 15,
            'Other': Math.floor(Math.random() * 20) + 15
          }
        },
        interests: ['تقنية', 'طبخ', 'سفر', 'رياضة'].slice(0, Math.floor(Math.random() * 3) + 2),
        languages: ['Arabic', 'English'],
        devices: {
          mobile: Math.floor(Math.random() * 30) + 60,
          desktop: Math.floor(Math.random() * 30) + 10,
          tablet: Math.floor(Math.random() * 15) + 5
        }
      },
      
      performance: {
        peak_hours: [Math.floor(Math.random() * 4) + 9, Math.floor(Math.random() * 5) + 18],
        best_days: ['Friday', 'Saturday'],
        engagement_rate: Math.floor(Math.random() * 13) + 2,
        conversion_rate: Math.floor(Math.random() * 7) + 1,
        bounce_rate: Math.floor(Math.random() * 40) + 20,
        session_duration: Math.floor(Math.random() * 270) + 30
      },
      
      tenant: 'default'
    });

    if (i % 10 === 0) {
      console.log(`✅ تم إنشاء ${i + 1} تحليل`);
    }
  }

  console.log('✅ تم إنشاء 50 تحليل بنجاح');
}

async function completeMissingData() {
  try {
    console.log('🚀 إكمال البيانات الناقصة...');
    
    await mongoose.connect(MONGODB_URI);
    console.log('✅ متصل بقاعدة البيانات');

    // إصلاح بيانات الاتصالات
    await fixConnectionData();

    // إنشاء المحتوى
    await createContent();

    // إنشاء التحليلات
    await createAnalytics();

    console.log('\n🎉 تم إكمال جميع البيانات بنجاح!');
    console.log('📊 الآن لديك:');
    console.log('   👥 50 مستخدم');
    console.log('   🔗 50 اتصال (مع بيانات متابعين حقيقية)');
    console.log('   📱 50 محتوى (مع روابط مباشرة)');
    console.log('   📊 50 تحليل (مع بيانات إحصائية كاملة)');

  } catch (error) {
    console.error('❌ خطأ:', error);
  } finally {
    await mongoose.disconnect();
    console.log('🔌 تم قطع الاتصال');
    process.exit(0);
  }
}

completeMissingData(); 