const { SocialConnection } = require('../../models/SocialMediaModels');
const { User } = require('../../models/User');
const { handleError } = require('../../utils/errorHandler');
const mongoose = require('mongoose');

const socialConnectionResolvers = {
  // Field resolvers for mapping database fields to GraphQL schema
  SocialConnection: {
    id: (parent) => parent._id.toString(),
    connectionId: (parent) => parent.connectionId || parent._id.toString(),
    accountName: (parent) => parent.platformAccountName,
    accountId: (parent) => parent.platformAccountId,
    displayName: (parent) => parent.platformAccountUsername || parent.platformAccountName,
    profilePicture: (parent) => parent.platformAccountProfilePicture,
    status: (parent) => parent.connectionStatus,
    userId: (parent) => parent.userId ? parent.userId.toString() : null,
    
    // Auto-resolve user information
    user: async (parent) => {
      try {
        if (parent.userId) {
          // If userId exists, fetch user data
          const user = await User.findById(parent.userId);
          if (user) {
            return {
              id: user._id.toString(),
              email: user.email,
              name: user.name,
              role: user.role,
              isActive: user.isActive
            };
          }
        }
        
        // Return cached user info if available
        if (parent.userInfo && parent.userInfo.email) {
          return {
            id: parent.userId ? parent.userId.toString() : null,
            email: parent.userInfo.email,
            name: parent.userInfo.name,
            role: parent.userInfo.role,
            isActive: parent.userInfo.isActive
          };
        }
        
        return null;
      } catch (error) {
        console.error('Error resolving user for connection:', error);
        return null;
      }
    }
  },

  Query: {
    // Get all connections with user data
    socialConnections: async () => {
      try {
        const connections = await SocialConnection.find({ isDeleted: false })
          .populate('userId', 'email name role isActive')
          .sort({ createdAt: -1 });
        
        return {
          success: true,
          message: 'Connections retrieved successfully',
          data: connections,
          totalCount: connections.length
        };
      } catch (error) {
        console.error('Error fetching social connections:', error);
        throw handleError(error);
      }
    },

    // Get connection by ID with user data
    socialConnection: async (parent, { id }) => {
      try {
        if (!mongoose.Types.ObjectId.isValid(id)) {
          throw new Error('Invalid connection ID format');
        }

        const connection = await SocialConnection.findOne({ 
          _id: id, 
          isDeleted: false 
        }).populate('userId', 'email name role isActive');
        
        if (!connection) {
          throw new Error('Social connection not found');
        }

        return {
          success: true,
          message: 'Connection retrieved successfully',
          data: connection
        };
      } catch (error) {
        console.error('Error fetching social connection:', error);
        throw handleError(error);
      }
    },

    // Get connections by platform with user data
    connectionsByPlatform: async (parent, { platform }) => {
      try {
        const connections = await SocialConnection.find({ 
          platform, 
          isDeleted: false 
        }).populate('userId', 'email name role isActive')
          .sort({ createdAt: -1 });
        
        return {
          success: true,
          message: `Connections for ${platform} retrieved successfully`,
          data: connections,
          totalCount: connections.length
        };
      } catch (error) {
        console.error('Error fetching connections by platform:', error);
        throw handleError(error);
      }
    },

    // Get active connections only with user data
    activeConnections: async () => {
      try {
        const connections = await SocialConnection.find({ 
          connectionStatus: 'ACTIVE',
          isDeleted: false 
        }).populate('userId', 'email name role isActive')
          .sort({ createdAt: -1 });
        
        return {
          success: true,
          message: 'Active connections retrieved successfully',
          data: connections,
          totalCount: connections.length
        };
      } catch (error) {
        console.error('Error fetching active connections:', error);
        throw handleError(error);
      }
    }
  },

  Mutation: {
    // Create new connection with auto user detection
    createSocialConnection: async (parent, { input }) => {
      try {
        console.log('🔗 Creating new social connection:', input.platform);
        
        // Auto-detect user from context or create default user
        let userId = null;
        let userInfo = {};
        
        // Try to find or create a default user for demo purposes
        try {
          let defaultUser = await User.findOne({ email: 'admin@socialmedia.com' });
          
          if (!defaultUser) {
            console.log('📝 Creating default user for connections...');
            defaultUser = await User.create({
              email: 'admin@socialmedia.com',
              name: 'Social Media Manager',
              role: 'ADMIN',
              isActive: true,
              tenant: 'default'
            });
            console.log('✅ Default user created:', defaultUser._id);
          }
          
          userId = defaultUser._id;
          userInfo = {
            email: defaultUser.email,
            name: defaultUser.name,
            role: defaultUser.role,
            isActive: defaultUser.isActive
          };
          
        } catch (userError) {
          console.log('⚠️ Could not create/find user, proceeding without user link');
        }
        
        // Check if connection already exists for this platform and account (if accountName provided)
        if (input.accountName) {
          const existingConnection = await SocialConnection.findOne({
            platform: input.platform,
            platformAccountName: input.accountName,
            isDeleted: false
          });

          if (existingConnection) {
            throw new Error(`Connection already exists for ${input.platform} account: ${input.accountName}`);
          }
        }

        // Create connection with mapped fields and required defaults
        const timestamp = Date.now();
        const connectionData = {
          platform: input.platform,
          platformAccountName: input.accountName || `${input.platform.toLowerCase()}_user_${timestamp}`,
          platformAccountHandle: input.accountName,
          platformAccountUsername: input.displayName || input.accountName,
          platformAccountProfilePicture: input.profilePicture,
          platformAccountId: input.accountId || `${input.platform.toLowerCase()}_${timestamp}`,
          connectionStatus: input.status || 'ACTIVE',
          followerCount: input.followerCount || 0,
          followingCount: input.followingCount || 0,
          isVerified: input.isVerified || false,
          connectedAt: new Date(),
          accessToken: input.accessToken || `temp_token_${timestamp}`,
          tenant: 'default',
          // User Information
          userId: userId,
          userInfo: userInfo
        };

        const connection = await SocialConnection.create(connectionData);
        
        // Populate user data for response
        await connection.populate('userId', 'email name role isActive');
        
        console.log('✅ Social connection created successfully:', connection._id);
        
        return {
          success: true,
          message: 'Social connection created successfully',
          data: connection
        };
      } catch (error) {
        console.error('Error creating social connection:', error);
        throw handleError(error);
      }
    },

    // Update existing connection
    updateSocialConnection: async (parent, { id, input }) => {
      try {
        console.log('🔄 Updating social connection:', id);
        
        if (!mongoose.Types.ObjectId.isValid(id)) {
          throw new Error('Invalid connection ID format');
        }

        // Map input fields to database fields
        const updateData = {};
        if (input.accountName !== undefined) updateData.platformAccountName = input.accountName;
        if (input.accountId !== undefined) updateData.platformAccountId = input.accountId;
        if (input.displayName !== undefined) updateData.platformAccountUsername = input.displayName;
        if (input.profilePicture !== undefined) updateData.platformAccountProfilePicture = input.profilePicture;
        if (input.followerCount !== undefined) updateData.followerCount = input.followerCount;
        if (input.followingCount !== undefined) updateData.followingCount = input.followingCount;
        if (input.isVerified !== undefined) updateData.isVerified = input.isVerified;
        if (input.status !== undefined) updateData.connectionStatus = input.status;
        if (input.accessToken !== undefined) updateData.accessToken = input.accessToken;
        if (input.refreshToken !== undefined) updateData.refreshToken = input.refreshToken;
        if (input.expiresAt !== undefined) updateData.tokenExpiresAt = input.expiresAt;
        
        updateData.lastSyncAt = new Date();

        const connection = await SocialConnection.findOneAndUpdate(
          { _id: id, isDeleted: false },
          updateData,
          { new: true, runValidators: true }
        ).populate('userId', 'email name role isActive');

        if (!connection) {
          throw new Error('Social connection not found');
        }

        console.log('✅ Social connection updated successfully');
        
        return {
          success: true,
          message: 'Social connection updated successfully',
          data: connection
        };
      } catch (error) {
        console.error('Error updating social connection:', error);
        throw handleError(error);
      }
    },

    // Delete connection (soft delete)
    deleteSocialConnection: async (parent, { id }) => {
      try {
        console.log('🗑️ Deleting social connection:', id);
        
        if (!mongoose.Types.ObjectId.isValid(id)) {
          throw new Error('Invalid connection ID format');
        }

        const connection = await SocialConnection.findOneAndUpdate(
          { _id: id, isDeleted: false },
          { isDeleted: true, deletedAt: new Date() },
          { new: true }
        ).populate('userId', 'email name role isActive');

        if (!connection) {
          throw new Error('Social connection not found');
        }

        console.log('✅ Social connection deleted successfully');
        
        return {
          success: true,
          message: 'Social connection deleted successfully',
          data: connection
        };
      } catch (error) {
        console.error('Error deleting social connection:', error);
        throw handleError(error);
      }
    },

    // Sync connection data
    syncSocialConnection: async (parent, { id }) => {
      try {
        console.log('🔄 Syncing social connection:', id);
        
        if (!mongoose.Types.ObjectId.isValid(id)) {
          throw new Error('Invalid connection ID format');
        }

        const connection = await SocialConnection.findOneAndUpdate(
          { _id: id, isDeleted: false },
          { 
            lastSyncAt: new Date(),
            connectionStatus: 'ACTIVE' // Update status to active after sync
          },
          { new: true }
        ).populate('userId', 'email name role isActive');

        if (!connection) {
          throw new Error('Social connection not found');
        }

        console.log('✅ Social connection synced successfully');
        
        return {
          success: true,
          message: 'Social connection synced successfully',
          data: connection
        };
      } catch (error) {
        console.error('Error syncing social connection:', error);
        throw handleError(error);
      }
    },

    // Toggle connection status
    toggleConnectionStatus: async (parent, { id }) => {
      try {
        console.log('🔄 Toggling connection status:', id);
        
        if (!mongoose.Types.ObjectId.isValid(id)) {
          throw new Error('Invalid connection ID format');
        }

        const connection = await SocialConnection.findOne({ _id: id, isDeleted: false });
        
        if (!connection) {
          throw new Error('Social connection not found');
        }

        const newStatus = connection.connectionStatus === 'ACTIVE' ? 'EXPIRED' : 'ACTIVE';
        connection.connectionStatus = newStatus;
        await connection.save();
        
        // Populate user data
        await connection.populate('userId', 'email name role isActive');

        console.log(`✅ Connection status changed to: ${newStatus}`);
        
        return {
          success: true,
          message: `Connection status changed to ${newStatus}`,
          data: connection
        };
      } catch (error) {
        console.error('Error toggling connection status:', error);
        throw handleError(error);
      }
    }
  }
};

module.exports = socialConnectionResolvers; 