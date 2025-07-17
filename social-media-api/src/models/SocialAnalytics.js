const mongoose = require('mongoose');

const socialAnalyticsSchema = new mongoose.Schema({
  contentId: { type: String },
  connectionId: { type: String, required: true },
  analyticsType: { type: String, required: true },
  platform: { type: String, required: true, enum: ['Instagram', 'Facebook', 'Twitter', 'LinkedIn', 'TikTok', 'YouTube'] },
  periodType: { type: String, enum: ['DAILY', 'WEEKLY', 'MONTHLY'], required: true },
  periodStart: { type: Date },
  periodEnd: { type: Date },
  normalizedMetrics: {
    reach: { type: Number, default: 0 },
    impressions: { type: Number, default: 0 },
    engagement: { type: Number, default: 0 },
    clicks: { type: Number, default: 0 },
    shares: { type: Number, default: 0 },
    saves: { type: Number, default: 0 },
    comments: { type: Number, default: 0 },
    likes: { type: Number, default: 0 },
  },
  snapshotDate: { type: Date, default: Date.now },
});

const SocialAnalytics = mongoose.model('SocialAnalytics', socialAnalyticsSchema);

module.exports = { SocialAnalytics };