import { Storage } from '../utils/storage';
import { BackendService } from './backendService';
import { ErrorService } from './errorService';

const SYNC_KEYS = ['coins', 'level', 'xp', 'achievements', 'dailyRewards', 'leaderboard', 'guild'];
const LAST_SYNC_KEY = 'lastSync';

export const CloudSyncService = {
  apiEndpoint: process.env.REACT_APP_API_ENDPOINT || 'https://api.example.com',
  
  async saveToCloud(userId) {
    const resolvedUserId = userId || (await BackendService.getUserId());
    if (!resolvedUserId) return { success: false, error: 'No user ID' };
    
    try {
      const data = {};
      SYNC_KEYS.forEach(key => {
        data[key] = Storage.load(key);
      });

      const saved = await BackendService.saveUserData(data);
      if (saved) {
        Storage.save(LAST_SYNC_KEY, Date.now());
        return { success: true };
      }
      return { success: false, error: 'Server error' };
    } catch (error) {
      ErrorService.log(error, 'cloud_sync');
      ErrorService.notifyUser(ErrorService.getUserMessage('cloud_sync'), 'cloud_sync');
      return { success: false, error: error.message };
    }
  },

  async loadFromCloud(userId) {
    const resolvedUserId = userId || (await BackendService.getUserId());
    if (!resolvedUserId) return { success: false, error: 'No user ID' };
    
    try {
      const cloudData = await BackendService.loadUserData();
      if (!cloudData) {
        return { success: false, error: 'Server error' };
      }

      const { data, timestamp } = cloudData;
      const lastSync = Storage.load(LAST_SYNC_KEY, 0);

      if (timestamp > lastSync) {
        Object.entries(data).forEach(([key, value]) => {
          if (value !== null) Storage.save(key, value);
        });
        Storage.save(LAST_SYNC_KEY, timestamp);
        return { success: true, data };
      }

      return { success: true, upToDate: true };
    } catch (error) {
      ErrorService.log(error, 'cloud_sync');
      ErrorService.notifyUser(ErrorService.getUserMessage('cloud_sync'), 'cloud_sync');
      return { success: false, error: error.message };
    }
  },

  async autoSync(userId) {
    const lastSync = Storage.load(LAST_SYNC_KEY, 0);
    const fiveMinutes = 5 * 60 * 1000;
    
    if (Date.now() - lastSync > fiveMinutes) {
      await this.saveToCloud(userId);
    }
  }
};
