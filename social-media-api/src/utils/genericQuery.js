const mongoose = require('mongoose');
const _ = require('lodash');

// قاموس النماذج المتاحة
const MODEL_REGISTRY = {
  'SocialContent': () => require('../models/SocialMediaModels').SocialContent,
  'SocialConnection': () => require('../models/SocialMediaModels').SocialConnection,
  'SocialAnalytics': () => require('../models/SocialMediaModels').SocialAnalytics,
  'User': () => require('../models/User').User,
  'SocialContent': () => require('../models/SocialMediaModels').SocialContent,
  'SocialConnection': () => require('../models/SocialMediaModels').SocialConnection,
  'SocialAnalytics': () => require('../models/SocialMediaModels').SocialAnalytics
};

/**
 * بناء الاستعلام من الفلاتر المرسلة
 * @param {Array} filters - مصفوفة الفلاتر
 * @param {Object} Model - النموذج المستخدم
 * @returns {Object} - كائن الاستعلام لـ MongoDB
 */
function buildQuery(filters = [], Model) {
  const query = {};
  
  // إضافة فلاتر افتراضية للحقول المشتركة
  query.isDeleted = false; // عدم عرض المحذوفة
  
  filters.forEach(filter => {
    const { field, operator, value } = filter;
    
    // التحقق من وجود الحقل في النموذج
    if (!isFieldValid(field, Model)) {
      throw new Error(`الحقل "${field}" غير موجود في النموذج`);
    }
    
    switch (operator) {
      case 'eq':
        query[field] = value;
        break;
        
      case 'ne':
        query[field] = { $ne: value };
        break;
        
      case 'in':
        query[field] = { $in: Array.isArray(value) ? value : [value] };
        break;
        
      case 'nin':
        query[field] = { $nin: Array.isArray(value) ? value : [value] };
        break;
        
      case 'gt':
        query[field] = { $gt: value };
        break;
        
      case 'gte':
        query[field] = { $gte: value };
        break;
        
      case 'lt':
        query[field] = { $lt: value };
        break;
        
      case 'lte':
        query[field] = { $lte: value };
        break;
        
      case 'regex':
        query[field] = { $regex: value, $options: 'i' };
        break;
        
      case 'exists':
        query[field] = { $exists: value };
        break;
        
      default:
        throw new Error(`المشغل "${operator}" غير مدعوم`);
    }
  });
  
  return query;
}

/**
 * بناء ترتيب النتائج
 * @param {Array} sort - مصفوفة الترتيب
 * @param {Object} Model - النموذج المستخدم
 * @returns {Object} - كائن الترتيب لـ MongoDB
 */
function buildSort(sort = [], Model) {
  const sortObject = {};
  
  sort.forEach(sortItem => {
    const { field, direction } = sortItem;
    
    if (!isFieldValid(field, Model)) {
      throw new Error(`حقل الترتيب "${field}" غير موجود في النموذج`);
    }
    
    sortObject[field] = direction === 'desc' ? -1 : 1;
  });
  
  // ترتيب افتراضي حسب تاريخ الإنشاء
  if (Object.keys(sortObject).length === 0) {
    sortObject.createdAt = -1;
  }
  
  return sortObject;
}

/**
 * بناء استعلام البحث النصي
 * @param {string} searchTerm - النص المراد البحث عنه
 * @param {Object} Model - النموذج المستخدم
 * @returns {Object} - كائن استعلام البحث
 */
function buildSearchQuery(searchTerm, Model) {
  if (!searchTerm) return {};
  
  // الحقول القابلة للبحث لكل نموذج
  const searchableFields = getSearchableFields(Model);
  
  if (searchableFields.length === 0) return {};
  
  const searchQueries = searchableFields.map(field => ({
    [field]: { $regex: searchTerm, $options: 'i' }
  }));
  
  return { $or: searchQueries };
}

/**
 * الحصول على الحقول القابلة للبحث
 * @param {Object} Model - النموذج المستخدم
 * @returns {Array} - مصفوفة الحقول القابلة للبحث
 */
function getSearchableFields(Model) {
  const modelName = Model.modelName;
  
  const searchableFieldsMap = {
    'SocialContent': ['content', 'title', 'description', 'author', 'hashtags'],
    'SocialConnection': ['platformAccountName', 'platformAccountHandle', 'platformAccountUsername'],
    'SocialAnalytics': ['analyticsType', 'platform'],
    'User': ['username', 'email', 'name']
  };
  
  return searchableFieldsMap[modelName] || [];
}

/**
 * التحقق من صحة الحقل
 * @param {string} field - اسم الحقل
 * @param {Object} Model - النموذج المستخدم
 * @returns {boolean} - صحة الحقل
 */
function isFieldValid(field, Model) {
  // التحقق من الحقول المتداخلة (مثل metrics.likes)
  const fieldParts = field.split('.');
  let currentSchema = Model.schema;
  
  for (const part of fieldParts) {
    const pathType = currentSchema.paths[part];
    if (!pathType) {
      return false;
    }
    
    // إذا كان الحقل متداخل، انتقل للمستوى التالي
    if (pathType.schema) {
      currentSchema = pathType.schema;
    }
  }
  
  return true;
}

/**
 * حساب معلومات التصفح
 * @param {number} totalCount - العدد الإجمالي
 * @param {Object} pagination - معلومات التصفح
 * @returns {Object} - معلومات التصفح المحسوبة
 */
function calculatePageInfo(totalCount, pagination) {
  const { type, limit, offset, page } = pagination;
  
  if (type === 'offset') {
    const currentPage = Math.floor(offset / limit) + 1;
    const totalPages = Math.ceil(totalCount / limit);
    
    return {
      hasNextPage: offset + limit < totalCount,
      hasPreviousPage: offset > 0,
      totalPages,
      currentPage,
      totalCount
    };
  }
  
  if (type === 'page') {
    const totalPages = Math.ceil(totalCount / limit);
    
    return {
      hasNextPage: page < totalPages,
      hasPreviousPage: page > 1,
      totalPages,
      currentPage: page,
      totalCount
    };
  }
  
  return {
    hasNextPage: false,
    hasPreviousPage: false,
    totalPages: 1,
    currentPage: 1,
    totalCount
  };
}

/**
 * دالة GenericQuery الرئيسية
 * @param {Object} params - معاملات الاستعلام
 * @returns {Object} - نتائج الاستعلام
 */
async function genericQuery(params) {
  try {
    const {
      modelName,
      filter = [],
      sort = [],
      pagination = { type: 'offset', limit: 20, offset: 0 },
      searchTerm,
      tenant = 'default'
    } = params;
    
    // التحقق من وجود النموذج
    if (!MODEL_REGISTRY[modelName]) {
      throw new Error(`النموذج "${modelName}" غير موجود`);
    }
    
    const Model = MODEL_REGISTRY[modelName]();
    
    // بناء الاستعلام الأساسي
    let query = buildQuery(filter, Model);
    
    // إضافة معرف المؤسسة
    query.tenant = tenant;
    
    // إضافة استعلام البحث النصي
    const searchQuery = buildSearchQuery(searchTerm, Model);
    if (Object.keys(searchQuery).length > 0) {
      query = { $and: [query, searchQuery] };
    }
    
    // بناء الترتيب
    const sortObject = buildSort(sort, Model);
    
    // حساب التصفح
    const { type, limit, offset, page, after } = pagination;
    let skip = 0;
    
    if (type === 'offset') {
      skip = offset || 0;
    } else if (type === 'page') {
      skip = ((page || 1) - 1) * limit;
    }
    
    // تنفيذ الاستعلام للحصول على العدد الإجمالي
    const totalCount = await Model.countDocuments(query);
    
    // تنفيذ الاستعلام للحصول على البيانات
    let queryBuilder = Model.find(query)
      .sort(sortObject)
      .limit(limit)
      .skip(skip);
    
    // إضافة التحميل التلقائي للمراجع
    queryBuilder = addPopulateFields(queryBuilder, Model);
    
    const data = await queryBuilder.exec();
    
    // حساب معلومات التصفح
    const pageInfo = calculatePageInfo(totalCount, { ...pagination, limit });
    
    return {
      data,
      totalCount,
      pageInfo,
      success: true
    };
    
  } catch (error) {
    console.error('خطأ في GenericQuery:', error);
    
    return {
      data: [],
      totalCount: 0,
      pageInfo: {
        hasNextPage: false,
        hasPreviousPage: false,
        totalPages: 0,
        currentPage: 1,
        totalCount: 0
      },
      success: false,
      error: error.message
    };
  }
}

/**
 * إضافة التحميل التلقائي للمراجع
 * @param {Object} queryBuilder - باني الاستعلام
 * @param {Object} Model - النموذج المستخدم
 * @returns {Object} - باني الاستعلام مع التحميل التلقائي
 */
function addPopulateFields(queryBuilder, Model) {
  const modelName = Model.modelName;
  
  // تحديد الحقول التي تحتاج تحميل تلقائي لكل نموذج
  const populateMap = {
    'SocialContent': [
      { path: 'connection', select: 'platform platformAccountName' },
      { path: 'createdBy', select: 'username email' },
      { path: 'approvedBy', select: 'username email' }
    ],
    'SocialAnalytics': [
      { path: 'contentId', select: 'contentId content platform' },
      { path: 'connectionId', select: 'platform platformAccountName' }
    ],
    'SocialConnection': [
      { path: 'createdBy', select: 'username email' }
    ]
  };
  
  const populateFields = populateMap[modelName];
  if (populateFields) {
    populateFields.forEach(field => {
      queryBuilder = queryBuilder.populate(field);
    });
  }
  
  return queryBuilder;
}

module.exports = {
  genericQuery,
  buildQuery,
  buildSort,
  buildSearchQuery,
  calculatePageInfo,
  MODEL_REGISTRY
}; 