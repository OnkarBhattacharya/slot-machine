import { Storage } from '../utils/storage';

const SYNC_KEYS = ['coins', 'level', 'xp', 'achievements', 'dailyRewards', 'leaderboard', 'guild'];
const LAST_SYNC_KEY = 'lastSync';

export const CloudSyncService = {
  apiEndpoint: process.env.REACT_APP_API_ENDPOINT || 'https://api.example.com',
  
  async saveToCloud(userId) {
    if (!userId) return { success: false, error: 'No user ID' };
    
    try {
      const data = {};
      SYNC_KEYS.forEach(key => {
        data[key] = Storage.load(key);
      });
      
      const response = await fetch(`${this.apiEndpoint}/save`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId, data, timestamp: Date.now() })
      });
      
      if (response.ok) {
        Storage.save(LAST_SYNC_KEY, Date.now());
        return { success: true };
      }
      return { success: false, error: 'Server error' };
    } catch (error) {
      console.error('Cloud save error:', error);
      return { success: false, error: error.message };
    }
  },

  async loadFromCloud(userId) {
    if (!userId) return { success: false, error: 'No user ID' };
    
    try {
      const response = await fetch(`${this.apiEndpoint}/load/${userId}`);
      
      if (response.ok) {
        const { data, timestamp } = await response.json();
        const lastSync = Storage.load(LAST_SYNC_KEY, 0);
        
        if (timestamp > lastSync) {
          Object.entries(data).forEach(([key, value]) => {
            if (value !== null) Storage.save(key, value);
          });
          Storage.save(LAST_SYNC_KEY, timestamp);
          return { success: true, data };
        }
        return { success: true, upToDate: true };
      }
      return { success: false, error: 'Server error' };
    } catch (error) {
      console.error('Cloud load error:', error);
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
