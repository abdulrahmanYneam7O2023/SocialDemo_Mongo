const mongoose = require('mongoose');
const _ = require('lodash');
const { v4: uuidv4 } = require('uuid');
const { MODEL_REGISTRY, buildQuery } = require('./genericQuery');

/**
 * إنشاء سجل جديد
 * @param {string} modelName - اسم النموذج
 * @param {Object} data - البيانات المراد إنشاؤها
 * @param {string} tenant - معرف المؤسسة
 * @param {string} userId - معرف المستخدم المنشئ
 * @returns {Object} - السجل المنشأ
 */
async function createRecord(modelName, data, tenant = 'default', userId = null) {
  try {
    if (!MODEL_REGISTRY[modelName]) {
      throw new Error(`النموذج "${modelName}" غير موجود`);
    }
    
    const Model = MODEL_REGISTRY[modelName]();
    
    // إعداد البيانات الأساسية
    const recordData = {
      ...data,
      tenant,
      uuid: uuidv4(),
      createdBy: userId,
      updatedBy: userId,
      status: data.status || 'ACTIVE'
    };
    
    // إضافة معرف خاص بالنموذج إذا لم يكن موجوداً
    if (modelName === 'SocialContent' && !recordData.contentId) {
      recordData.contentId = `content_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    }
    
    const record = new Model(recordData);
    const savedRecord = await record.save();
    
    // تحميل البيانات المرتبطة
    await savedRecord.populate(getPopulateFields(modelName));
    
    return {
      success: true,
      data: savedRecord,
      message: 'تم إنشاء السجل بنجاح'
    };
    
  } catch (error) {
    console.error('خطأ في إنشاء السجل:', error);
    return {
      success: false,
      data: null,
      error: error.message
    };
  }
}

/**
 * تحديث سجل موجود
 * @param {string} modelName - اسم النموذج
 * @param {string} id - معرف السجل
 * @param {Object} data - البيانات المحدثة
 * @param {string} userId - معرف المستخدم المحدث
 * @returns {Object} - السجل المحدث
 */
async function updateRecord(modelName, id, data, userId = null) {
  try {
    if (!MODEL_REGISTRY[modelName]) {
      throw new Error(`النموذج "${modelName}" غير موجود`);
    }
    
    const Model = MODEL_REGISTRY[modelName]();
    
    // العثور على السجل
    const existingRecord = await Model.findOne({
      _id: id,
      isDeleted: false
    });
    
    if (!existingRecord) {
      throw new Error('السجل غير موجود أو محذوف');
    }
    
    // إعداد البيانات المحدثة
    const updateData = {
      ...data,
      updatedBy: userId,
      updatedAt: new Date()
    };
    
    // حذف الحقول التي لا يجب تحديثها
    delete updateData._id;
    delete updateData.uuid;
    delete updateData.createdAt;
    delete updateData.createdBy;
    
    const updatedRecord = await Model.findByIdAndUpdate(
      id,
      updateData,
      { new: true, runValidators: true }
    );
    
    // تحميل البيانات المرتبطة
    await updatedRecord.populate(getPopulateFields(modelName));
    
    return {
      success: true,
      data: updatedRecord,
      message: 'تم تحديث السجل بنجاح'
    };
    
  } catch (error) {
    console.error('خطأ في تحديث السجل:', error);
    return {
      success: false,
      data: null,
      error: error.message
    };
  }
}

/**
 * حذف سجل (حذف ناعم)
 * @param {string} modelName - اسم النموذج
 * @param {string} id - معرف السجل
 * @param {string} userId - معرف المستخدم المحذف
 * @returns {Object} - نتيجة الحذف
 */
async function deleteRecord(modelName, id, userId = null) {
  try {
    if (!MODEL_REGISTRY[modelName]) {
      throw new Error(`النموذج "${modelName}" غير موجود`);
    }
    
    const Model = MODEL_REGISTRY[modelName]();
    
    const record = await Model.findOne({
      _id: id,
      isDeleted: false
    });
    
    if (!record) {
      throw new Error('السجل غير موجود أو محذوف مسبقاً');
    }
    
    // تنفيذ الحذف الناعم
    await record.softDelete(userId);
    
    return {
      success: true,
      data: {
        deletedId: id,
        deletedAt: new Date(),
        message: 'تم حذف السجل بنجاح'
      }
    };
    
  } catch (error) {
    console.error('خطأ في حذف السجل:', error);
    return {
      success: false,
      data: null,
      error: error.message
    };
  }
}

/**
 * نسخ سجل موجود
 * @param {string} modelName - اسم النموذج
 * @param {string} id - معرف السجل المراد نسخه
 * @param {Object} modifications - التعديلات على النسخة
 * @param {string} userId - معرف المستخدم
 * @returns {Object} - السجل المنسوخ
 */
async function duplicateRecord(modelName, id, modifications = {}, userId = null) {
  try {
    if (!MODEL_REGISTRY[modelName]) {
      throw new Error(`النموذج "${modelName}" غير موجود`);
    }
    
    const Model = MODEL_REGISTRY[modelName]();
    
    const originalRecord = await Model.findOne({
      _id: id,
      isDeleted: false
    });
    
    if (!originalRecord) {
      throw new Error('السجل الأصلي غير موجود');
    }
    
    // إنشاء نسخة من البيانات
    const duplicateData = originalRecord.toObject();
    
    // حذف الحقول الفريدة
    delete duplicateData._id;
    delete duplicateData.__v;
    delete duplicateData.uuid;
    delete duplicateData.createdAt;
    delete duplicateData.updatedAt;
    delete duplicateData.createdBy;
    delete duplicateData.updatedBy;
    
    // حذف المعرفات الفريدة بالنموذج
    if (modelName === 'SocialContent') {
      delete duplicateData.contentId;
      delete duplicateData.platformPostId;
      delete duplicateData.platformUrl;
    }
    
    // تطبيق التعديلات
    const finalData = {
      ...duplicateData,
      ...modifications,
      uuid: uuidv4(),
      createdBy: userId,
      updatedBy: userId,
      status: 'DRAFT' // النسخ تبدأ كمسودة
    };
    
    // إنشاء السجل الجديد
    return await createRecord(modelName, finalData, duplicateData.tenant, userId);
    
  } catch (error) {
    console.error('خطأ في نسخ السجل:', error);
    return {
      success: false,
      data: null,
      error: error.message
    };
  }
}

/**
 * إنشاء عدة سجلات
 * @param {string} modelName - اسم النموذج
 * @param {Array} dataArray - مصفوفة البيانات
 * @param {string} tenant - معرف المؤسسة
 * @param {string} userId - معرف المستخدم
 * @returns {Object} - السجلات المنشأة
 */
async function bulkCreate(modelName, dataArray, tenant = 'default', userId = null) {
  try {
    if (!MODEL_REGISTRY[modelName]) {
      throw new Error(`النموذج "${modelName}" غير موجود`);
    }
    
    if (!Array.isArray(dataArray) || dataArray.length === 0) {
      throw new Error('يجب تمرير مصفوفة غير فارغة من البيانات');
    }
    
    const Model = MODEL_REGISTRY[modelName]();
    const results = [];
    const errors = [];
    
    for (const data of dataArray) {
      try {
        const result = await createRecord(modelName, data, tenant, userId);
        if (result.success) {
          results.push(result.data);
        } else {
          errors.push(result.error);
        }
      } catch (error) {
        errors.push(error.message);
      }
    }
    
    return {
      success: true,
      data: {
        created: results.length,
        records: results,
        errors: errors.length > 0 ? errors : undefined
      },
      message: `تم إنشاء ${results.length} سجل من أصل ${dataArray.length}`
    };
    
  } catch (error) {
    console.error('خطأ في الإنشاء المجمع:', error);
    return {
      success: false,
      data: null,
      error: error.message
    };
  }
}

/**
 * تحديث عدة سجلات بالفلتر
 * @param {string} modelName - اسم النموذج
 * @param {Array} filter - فلاتر تحديد السجلات
 * @param {Object} updateData - البيانات المحدثة
 * @param {string} userId - معرف المستخدم
 * @returns {Object} - نتيجة التحديث
 */
async function bulkUpdate(modelName, filter, updateData, userId = null) {
  try {
    if (!MODEL_REGISTRY[modelName]) {
      throw new Error(`النموذج "${modelName}" غير موجود`);
    }
    
    const Model = MODEL_REGISTRY[modelName]();
    
    // بناء الاستعلام من الفلاتر
    const query = buildQuery(filter, Model);
    
    // إعداد البيانات المحدثة
    const update = {
      ...updateData,
      updatedBy: userId,
      updatedAt: new Date()
    };
    
    const result = await Model.updateMany(query, update);
    
    return {
      success: true,
      data: {
        matchedCount: result.matchedCount,
        modifiedCount: result.modifiedCount,
        message: `تم تحديث ${result.modifiedCount} سجل`
      }
    };
    
  } catch (error) {
    console.error('خطأ في التحديث المجمع:', error);
    return {
      success: false,
      data: null,
      error: error.message
    };
  }
}

/**
 * حذف عدة سجلات بالفلتر
 * @param {string} modelName - اسم النموذج
 * @param {Array} filter - فلاتر تحديد السجلات
 * @param {string} userId - معرف المستخدم
 * @returns {Object} - نتيجة الحذف
 */
async function bulkDelete(modelName, filter, userId = null) {
  try {
    if (!MODEL_REGISTRY[modelName]) {
      throw new Error(`النموذج "${modelName}" غير موجود`);
    }
    
    const Model = MODEL_REGISTRY[modelName]();
    
    // بناء الاستعلام من الفلاتر
    const query = buildQuery(filter, Model);
    
    // تحديث حالة الحذف الناعم
    const result = await Model.updateMany(
      query,
      {
        isDeleted: true,
        deletedAt: new Date(),
        deletedBy: userId
      }
    );
    
    return {
      success: true,
      data: {
        deletedCount: result.modifiedCount,
        message: `تم حذف ${result.modifiedCount} سجل`
      }
    };
    
  } catch (error) {
    console.error('خطأ في الحذف المجمع:', error);
    return {
      success: false,
      data: null,
      error: error.message
    };
  }
}

/**
 * أرشفة سجل
 * @param {string} modelName - اسم النموذج
 * @param {string} id - معرف السجل
 * @param {string} reason - سبب الأرشفة
 * @param {string} userId - معرف المستخدم
 * @returns {Object} - نتيجة الأرشفة
 */
async function archiveRecord(modelName, id, reason, userId = null) {
  try {
    if (!MODEL_REGISTRY[modelName]) {
      throw new Error(`النموذج "${modelName}" غير موجود`);
    }
    
    const Model = MODEL_REGISTRY[modelName]();
    
    const record = await Model.findOne({
      _id: id,
      isDeleted: false
    });
    
    if (!record) {
      throw new Error('السجل غير موجود');
    }
    
    await record.archive(userId, reason);
    
    return {
      success: true,
      data: {
        id: record._id,
        isArchived: true,
        archivedAt: record.archivedAt,
        archiveReason: record.archiveReason
      },
      message: 'تم أرشفة السجل بنجاح'
    };
    
  } catch (error) {
    console.error('خطأ في أرشفة السجل:', error);
    return {
      success: false,
      data: null,
      error: error.message
    };
  }
}

/**
 * إلغاء أرشفة سجل
 * @param {string} modelName - اسم النموذج
 * @param {string} id - معرف السجل
 * @returns {Object} - نتيجة إلغاء الأرشفة
 */
async function unarchiveRecord(modelName, id) {
  try {
    if (!MODEL_REGISTRY[modelName]) {
      throw new Error(`النموذج "${modelName}" غير موجود`);
    }
    
    const Model = MODEL_REGISTRY[modelName]();
    
    const record = await Model.findOne({
      _id: id,
      isDeleted: false,
      isArchived: true
    });
    
    if (!record) {
      throw new Error('السجل غير موجود أو غير مؤرشف');
    }
    
    await record.unarchive();
    
    return {
      success: true,
      data: {
        id: record._id,
        isArchived: false
      },
      message: 'تم إلغاء أرشفة السجل بنجاح'
    };
    
  } catch (error) {
    console.error('خطأ في إلغاء أرشفة السجل:', error);
    return {
      success: false,
      data: null,
      error: error.message
    };
  }
}

/**
 * دالة GenericMutation الرئيسية
 * @param {Object} params - معاملات العملية
 * @returns {Object} - نتيجة العملية
 */
async function genericMutation(params) {
  const {
    modelName,
    operation,
    id,
    data,
    filter,
    tenant = 'default',
    userId = null
  } = params;
  
  try {
    switch (operation) {
      case 'CREATE':
        return await createRecord(modelName, data, tenant, userId);
        
      case 'UPDATE':
        return await updateRecord(modelName, id, data, userId);
        
      case 'DELETE':
        return await deleteRecord(modelName, id, userId);
        
      case 'DUPLICATE':
        return await duplicateRecord(modelName, id, data, userId);
        
      case 'BULK_CREATE':
        return await bulkCreate(modelName, data, tenant, userId);
        
      case 'BULK_UPDATE':
        return await bulkUpdate(modelName, filter, data, userId);
        
      case 'BULK_DELETE':
        return await bulkDelete(modelName, filter, userId);
        
      case 'ARCHIVE':
        return await archiveRecord(modelName, id, data?.archiveReason, userId);
        
      case 'UNARCHIVE':
        return await unarchiveRecord(modelName, id);
        
      default:
        throw new Error(`العملية "${operation}" غير مدعومة`);
    }
    
  } catch (error) {
    console.error('خطأ في GenericMutation:', error);
    return {
      success: false,
      data: null,
      error: error.message
    };
  }
}

/**
 * الحصول على حقول التحميل التلقائي لكل نموذج
 * @param {string} modelName - اسم النموذج
 * @returns {Array} - مصفوفة حقول التحميل التلقائي
 */
function getPopulateFields(modelName) {
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
  
  return populateMap[modelName] || [];
}

module.exports = {
  genericMutation,
  createRecord,
  updateRecord,
  deleteRecord,
  duplicateRecord,
  bulkCreate,
  bulkUpdate,
  bulkDelete,
  archiveRecord,
  unarchiveRecord
}; 