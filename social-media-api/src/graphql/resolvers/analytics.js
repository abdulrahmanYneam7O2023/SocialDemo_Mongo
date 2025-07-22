const { SocialAnalytics } = require('../../models/SocialMediaModels');
const { mockDB } = require('../../utils/mockData');

const analyticsResolvers = {
  Query: {
    analyticsByContent: async (parent, { contentId }) => {
      console.log(`📝 Using mock database for analyticsByContent: ${contentId}`);
      
      const snapshots = mockDB.getAnalyticsByContent(contentId);
      
      return snapshots.map(snapshot => ({
        id: snapshot.id,
        contentId: snapshot.contentId,
        connectionId: snapshot.connectionId,
        analyticsType: snapshot.analyticsType,
        platform: snapshot.platform,
        periodType: snapshot.periodType,
        periodStart: snapshot.periodStart,
        periodEnd: snapshot.periodEnd,
        metrics: snapshot.normalizedMetrics,
        snapshotDate: snapshot.snapshotDate,
      }));
    },

    analyticsByPlatform: async (parent, { platform, periodType }) => {
      console.log(`📝 Using mock database for analyticsByPlatform: ${platform}`);
      
      const snapshots = mockDB.getAnalyticsByPlatform(platform, periodType);
      
      return snapshots.map(snapshot => ({
        id: snapshot.id,
        contentId: snapshot.contentId,
        connectionId: snapshot.connectionId,
        analyticsType: snapshot.analyticsType,
        platform: snapshot.platform,
        periodType: snapshot.periodType,
        periodStart: snapshot.periodStart,
        periodEnd: snapshot.periodEnd,
        metrics: snapshot.normalizedMetrics,
        snapshotDate: snapshot.snapshotDate,
      }));
    },
  },
};

module.exports = analyticsResolvers;