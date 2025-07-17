const mongoose = require('mongoose');

const socialContentSchema = new mongoose.Schema({
  contentId: { type: String, required: true, unique: true },
  platform: { type: String, required: true, enum: ['Instagram', 'Facebook', 'Twitter', 'LinkedIn', 'TikTok', 'YouTube'] },
  contentType: { type: String, required: true, enum: ['IMAGE', 'VIDEO', 'STORY', 'POST', 'REEL', 'TWEET'] },
  content: { type: String },
  author: { type: String },
  status: { type: String, enum: ['PUBLISHED', 'DRAFT', 'ARCHIVED'], default: 'PUBLISHED' },
  createdAt: { type: Date, default: Date.now },
  createdBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  metrics: {
    likes: { type: Number, default: 0 },
    comments: { type: Number, default: 0 },
    shares: { type: Number, default: 0 },
    views: { type: Number, default: 0 },
  },
});

const SocialContent = mongoose.model('SocialContent', socialContentSchema);

module.exports = { SocialContent };