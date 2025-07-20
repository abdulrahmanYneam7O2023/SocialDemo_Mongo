const { SocialAnalytics } = require('../../models/SocialAnalytics');
const { SocialContent } = require('../../models/SocialContent');
const { authMiddleware } = require('../../middleware/auth');
const { handleError } = require('../../utils/errorHandler');

const analyticsResolvers = {
  Query: {
    analyticsByContent: authMiddleware(async (parent, { contentId }) => {
      try {
        console.log(`📊 Fetching analytics for content: ${contentId}`);
        
        // التحقق من وجود المحتوى أولاً
        const content = await SocialContent.findOne({ contentId });
        if (!content) {
          throw handleError('Content not found', 'CONTENT_NOT_FOUND', 404);
        }
        
        const snapshots = await SocialAnalytics.find({ contentId })
          .sort({ snapshotDate: -1 });
        
        console.log(`✅ Found ${snapshots.length} analytics snapshots for ${contentId}`);
        
        return snapshots.map(snapshot => ({
          id: snapshot._id.toString(),
          contentId: snapshot.contentId,
          connectionId: snapshot.connectionId,
          analyticsType: snapshot.analyticsType,
          platform: snapshot.platform,
          periodType: snapshot.periodType,
          periodStart: snapshot.periodStart ? snapshot.periodStart.toISOString() : null,
          periodEnd: snapshot.periodEnd ? snapshot.periodEnd.toISOString() : null,
          metrics: snapshot.normalizedMetrics,
          snapshotDate: snapshot.snapshotDate.toISOString(),
        }));
      } catch (error) {
        console.error(`❌ Error fetching analytics for content ${contentId}:`, error);
        throw handleError('Failed to fetch content analytics', 'FETCH_ERROR', 500);
      }
    }),
    analyticsByPlatform: authMiddleware(async (parent, { platform, periodType }) => {
      try {
        console.log(`📊 Fetching analytics for platform: ${platform}${periodType ? ` (${periodType})` : ''}`);
        
        let filter = { platform };
        if (periodType) {
          filter.periodType = periodType;
        }
        
        const snapshots = await SocialAnalytics.find(filter)
          .sort({ snapshotDate: -1 })
          .limit(100); // تحديد العدد لتجنب استعلامات كبيرة
        
        console.log(`✅ Found ${snapshots.length} analytics snapshots for ${platform}`);
        
        return snapshots.map(snapshot => ({
          id: snapshot._id.toString(),
          contentId: snapshot.contentId,
          connectionId: snapshot.connectionId,
          analyticsType: snapshot.analyticsType,
          platform: snapshot.platform,
          periodType: snapshot.periodType,
          periodStart: snapshot.periodStart ? snapshot.periodStart.toISOString() : null,
          periodEnd: snapshot.periodEnd ? snapshot.periodEnd.toISOString() : null,
          metrics: snapshot.normalizedMetrics,
          snapshotDate: snapshot.snapshotDate.toISOString(),
        }));
      } catch (error) {
        console.error(`❌ Error fetching analytics for platform ${platform}:`, error);
        throw handleError('Failed to fetch platform analytics', 'FETCH_ERROR', 500);
      }
    }),
  },
};

module.exports = analyticsResolvers;