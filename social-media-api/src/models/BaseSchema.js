const mongoose = require('mongoose');
const { v4: uuidv4 } = require('uuid');

// BaseSchema للحقول المشتركة بين جميع النماذج
const BaseSchema = new mongoose.Schema({
  // Tenant/Organization ID for multi-tenancy
  tenant: {
    type: String,
    default: 'default',
    index: true
  },
  
  // Unique identifier
  uuid: {
    type: String,
    default: uuidv4,
    unique: true,
    index: true
  },
  
  // User who created this record
  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  },
  
  // User who last updated this record  
  updatedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  },
  
  // Soft delete functionality
  isDeleted: {
    type: Boolean,
    default: false,
    index: true
  },
  
  deletedAt: {
    type: Date,
    index: true
  },
  
  deletedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  },
  
  // Archive functionality (alternative to delete)
  isArchived: {
    type: Boolean,
    default: false,
    index: true
  },
  
  archivedAt: {
    type: Date,
    index: true
  },
  
  archivedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  },
  
  archiveReason: String,
  
  // Metadata for tracking and analytics
  metadata: {
    type: mongoose.Schema.Types.Mixed,
    default: {}
  },
  
  // Tags for organization and search
  tags: [{
    type: String,
    trim: true,
    lowercase: true
  }],
  
  // Notes for internal use
  notes: {
    type: String,
    maxLength: 1000
  },
  
  // Status for workflow management
  status: {
    type: String,
    enum: ['DRAFT', 'ACTIVE', 'INACTIVE', 'PENDING', 'APPROVED', 'REJECTED'],
    default: 'ACTIVE',
    index: true
  }
  
}, {
  timestamps: true, // Adds createdAt and updatedAt automatically
  
  // Transform function to clean up output
  toJSON: {
    transform: function(doc, ret) {
      // Remove internal fields from JSON output
      delete ret.__v;
      return ret;
    }
  },
  
  // Add version key for optimistic concurrency control
  versionKey: '__version'
});

// Pre-save middleware to update timestamps and user tracking
BaseSchema.pre('save', function(next) {
  if (this.isNew) {
    this.createdAt = new Date();
  }
  this.updatedAt = new Date();
  next();
});

// Indexes for common queries
BaseSchema.index({ tenant: 1, isDeleted: 1, status: 1 });
BaseSchema.index({ tenant: 1, isArchived: 1, status: 1 });
BaseSchema.index({ tenant: 1, createdAt: -1 });
BaseSchema.index({ tenant: 1, tags: 1 });
BaseSchema.index({ uuid: 1 }, { unique: true });

// Methods for soft delete
BaseSchema.methods.softDelete = function(deletedBy) {
  this.isDeleted = true;
  this.deletedAt = new Date();
  this.deletedBy = deletedBy;
  return this.save();
};

// Methods for archiving
BaseSchema.methods.archive = function(archivedBy, reason) {
  this.isArchived = true;
  this.archivedAt = new Date();
  this.archivedBy = archivedBy;
  this.archiveReason = reason || 'Archived by user';
  return this.save();
};

// Methods for unarchiving
BaseSchema.methods.unarchive = function() {
  this.isArchived = false;
  this.archivedAt = undefined;
  this.archivedBy = undefined;
  this.archiveReason = undefined;
  return this.save();
};

// Static methods for common queries
BaseSchema.statics.findActive = function(filter = {}) {
  return this.find({
    ...filter,
    isDeleted: false,
    isArchived: false,
    status: { $ne: 'INACTIVE' }
  });
};

BaseSchema.statics.findByTenant = function(tenant, filter = {}) {
  return this.find({
    tenant,
    ...filter,
    isDeleted: false
  });
};

BaseSchema.statics.findWithDeleted = function(filter = {}) {
  return this.find(filter);
};

module.exports = BaseSchema; 