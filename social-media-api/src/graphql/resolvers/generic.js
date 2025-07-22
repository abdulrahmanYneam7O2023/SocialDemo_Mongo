const { genericQuery } = require('../../utils/genericQuery');
const { genericMutation } = require('../../utils/genericMutation');
const { handleError } = require('../../utils/errorHandler');

const genericResolvers = {
  Query: {
    /**
     * استعلام موحد للبيانات من أي نموذج
     */
    genericQuery: async (parent, args, context) => {
      try {
        const {
          modelName,
          filter,
          sort,
          pagination,
          searchTerm
        } = args;
        
        // استخدام tenant من السياق أو افتراضي
        const tenant = context?.tenant || 'default';
        
        console.log(`📊 تنفيذ genericQuery للنموذج: ${modelName}`);
        
        const result = await genericQuery({
          modelName,
          filter,
          sort,
          pagination,
          searchTerm,
          tenant
        });
        
        if (!result.success) {
          throw new Error(result.error);
        }
        
        return {
          data: JSON.stringify(result.data),
          totalCount: result.totalCount,
          pageInfo: result.pageInfo,
          success: result.success
        };
        
      } catch (error) {
        console.error('خطأ في genericQuery resolver:', error);
        throw handleError(error);
      }
    },
    
    /**
     * الحصول على قائمة النماذج المتاحة
     */
    availableModels: async () => {
      try {
        const { MODEL_REGISTRY } = require('../../utils/genericQuery');
        
        const models = Object.keys(MODEL_REGISTRY).map(modelName => ({
          name: modelName,
          description: getModelDescription(modelName),
          searchableFields: getModelSearchableFields(modelName),
          filterableFields: getModelFilterableFields(modelName)
        }));
        
        return {
          success: true,
          totalModels: models.length,
          models
        };
        
      } catch (error) {
        console.error('خطأ في availableModels:', error);
        throw handleError(error);
      }
    }
  },
  
  Mutation: {
    /**
     * عملية موحدة للتلاعب بالبيانات
     */
    genericMutation: async (parent, args, context) => {
      try {
        const {
          modelName,
          operation,
          id,
          data,
          filter
        } = args;
        
        // الحصول على معلومات المستخدم من السياق
        const userId = context?.user?.id || null;
        const tenant = context?.tenant || 'default';
        
        console.log(`🔧 تنفيذ genericMutation: ${operation} على ${modelName}`);
        
        // تحويل البيانات من JSON إذا كانت نص
        let parsedData = data;
        if (typeof data === 'string') {
          try {
            parsedData = JSON.parse(data);
          } catch (e) {
            throw new Error('البيانات المرسلة غير صحيحة (JSON غير صالح)');
          }
        }
        
        const result = await genericMutation({
          modelName,
          operation,
          id,
          data: parsedData,
          filter,
          tenant,
          userId
        });
        
        if (!result.success) {
          throw new Error(result.error);
        }
        
        return {
          success: result.success,
          data: JSON.stringify(result.data),
          message: result.message
        };
        
      } catch (error) {
        console.error('خطأ في genericMutation resolver:', error);
        throw handleError(error);
      }
    },
    
    
    createSocialContent: async (parent, { input }, context) => {
      try {
        const userId = context?.user?.id || null;
        const tenant = context?.tenant || 'default';
        
        console.log('📱 إنشاء محتوى سوشيال ميديا جديد');
        
        // تحسين البيانات للسوشيال ميديا
        const enhancedData = {
          ...input,
          publishStatus: input.publishStatus || 'DRAFT',
          contentType: input.contentType || 'POST',
          settings: {
            ...input.settings,
            commentsEnabled: input.settings?.commentsEnabled !== false
          }
        };
        
        const result = await genericMutation({
          modelName: 'SocialContent',
          operation: 'CREATE',
          data: enhancedData,
          tenant,
          userId
        });
        
        if (!result.success) {
          throw new Error(result.error);
        }
        
        return {
          success: true,
          data: result.data,
          message: 'تم إنشاء المحتوى بنجاح'
        };
        
      } catch (error) {
        console.error('خطأ في createSocialContent:', error);
        throw handleError(error);
      }
    },
    
    /**
     * جدولة محتوى للنشر
     */
    scheduleContent: async (parent, { contentId, scheduledAt }, context) => {
      try {
        const userId = context?.user?.id || null;
        
        console.log(`⏰ جدولة المحتوى ${contentId} للنشر في ${scheduledAt}`);
        
        const result = await genericMutation({
          modelName: 'SocialContent',
          operation: 'UPDATE',
          id: contentId,
          data: {
            scheduledAt: new Date(scheduledAt),
            publishStatus: 'SCHEDULED'
          },
          userId
        });
        
        if (!result.success) {
          throw new Error(result.error);
        }
        
        return {
          success: true,
          data: result.data,
          message: 'تم جدولة المحتوى للنشر بنجاح'
        };
        
      } catch (error) {
        console.error('خطأ في scheduleContent:', error);
        throw handleError(error);
      }
    },
    
    /**
     * تحديث إحصائيات المحتوى
     */
    updateContentMetrics: async (parent, { contentId, metrics }, context) => {
      try {
        const userId = context?.user?.id || null;
        
        console.log(`📈 تحديث إحصائيات المحتوى ${contentId}`);
        
        // حساب معدل التفاعل
        const engagementCount = (metrics.likes || 0) + (metrics.comments || 0) + (metrics.shares || 0);
        const engagementRate = metrics.views > 0 ? (engagementCount / metrics.views) * 100 : 0;
        
        const result = await genericMutation({
          modelName: 'SocialContent',
          operation: 'UPDATE',
          id: contentId,
          data: {
            'metrics.likes': metrics.likes,
            'metrics.comments': metrics.comments,
            'metrics.shares': metrics.shares,
            'metrics.views': metrics.views,
            'metrics.engagementCount': engagementCount,
            'metrics.engagementRate': engagementRate,
            'metrics.lastUpdatedAt': new Date(),
            lastMetricsSync: new Date()
          },
          userId
        });
        
        if (!result.success) {
          throw new Error(result.error);
        }
        
        return {
          success: true,
          data: result.data,
          message: 'تم تحديث الإحصائيات بنجاح'
        };
        
      } catch (error) {
        console.error('خطأ في updateContentMetrics:', error);
        throw handleError(error);
      }
    }
  }
};

/**
 * الحصول على وصف النموذج
 */
function getModelDescription(modelName) {
  const descriptions = {
    'SocialContent': 'محتوى السوشيال ميديا - منشورات، صور، فيديوهات، ريلز',
    'SocialConnection': 'الاتصالات بمنصات السوشيال ميديا - Instagram, Facebook, Twitter',
    'SocialAnalytics': 'تحليلات وإحصائيات المحتوى والحسابات',
    'User': 'المستخدمين والحسابات'
  };
  
  return descriptions[modelName] || 'نموذج بيانات';
}

/**
 * الحصول على الحقول القابلة للبحث
 */
function getModelSearchableFields(modelName) {
  const searchableFields = {
    'SocialContent': ['content', 'title', 'description', 'author', 'hashtags'],
    'SocialConnection': ['platformAccountName', 'platformAccountHandle', 'platformAccountUsername'],
    'SocialAnalytics': ['analyticsType', 'platform'],
    'User': ['username', 'email', 'name']
  };
  
  return searchableFields[modelName] || [];
}

/**
 * الحصول على الحقول القابلة للفلترة
 */
function getModelFilterableFields(modelName) {
  const filterableFields = {
    'SocialContent': ['platform', 'contentType', 'publishStatus', 'author', 'createdAt', 'publishedAt'],
    'SocialConnection': ['platform', 'connectionStatus', 'isActive', 'isDefault'],
    'SocialAnalytics': ['platform', 'analyticsType', 'periodType', 'snapshotDate'],
    'User': ['status', 'createdAt', 'isActive']
  };
  
  return filterableFields[modelName] || [];
}

module.exports = genericResolvers; 