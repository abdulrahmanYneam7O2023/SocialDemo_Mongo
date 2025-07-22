const mongoose = require('mongoose');
const BaseSchema = require('./BaseSchema');

const UserSchema = new mongoose.Schema({
  ...BaseSchema.obj,
  
  // User Information
  email: {
    type: String,
    required: true,
    unique: true,
    lowercase: true,
    trim: true
  },
  
  name: {
    type: String,
    required: true,
    trim: true
  },
  
  role: {
    type: String,
    enum: ['ADMIN', 'USER', 'MANAGER'],
    default: 'USER'
  },
  
  isActive: {
    type: Boolean,
    default: true
  }
  
}, {
  timestamps: true
});

// استخدام الطريقة الآمنة لتجنب إعادة تعريف النموذج
const User = mongoose.models.User || mongoose.model('User', UserSchema);

module.exports = { User }; 