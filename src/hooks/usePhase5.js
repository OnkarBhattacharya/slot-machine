import { useState, useEffect, useCallback } from 'react';
import { CloudSyncService } from '../services/cloudSyncService';
import { AnalyticsService } from '../services/analyticsService';
import { SecurityService } from '../services/securityService';
import { OfflineService } from '../utils/offlineService';
import { gameStore } from '../utils/stateStore';

export const useGameState = () => {
  const [state, setState] = useState(gameStore.getState());

  useEffect(() => {
    const unsubscribe = gameStore.subscribe(setState);
    return unsubscribe;
  }, []);

  const updateState = useCallback((updates) => {
    gameStore.setState(updates);
  }, []);

  return [state, updateState];
};

export const useCloudSync = (userId) => {
  const [syncing, setSyncing] = useState(false);
  const [lastSync, setLastSync] = useState(null);

  const sync = useCallback(async () => {
    if (!userId) return;
    setSyncing(true);
    const result = await CloudSyncService.saveToCloud(userId);
    if (result.success) {
      setLastSync(Date.now());
    }
    setSyncing(false);
    return result;
  }, [userId]);

  const load = useCallback(async () => {
    if (!userId) return;
    setSyncing(true);
    const result = await CloudSyncService.loadFromCloud(userId);
    setSyncing(false);
    return result;
  }, [userId]);

  useEffect(() => {
    if (userId) {
      const interval = setInterval(() => {
        CloudSyncService.autoSync(userId);
      }, 5 * 60 * 1000);
      return () => clearInterval(interval);
    }
  }, [userId]);

  return { sync, load, syncing, lastSync };
};

export const useAnalytics = () => {
  useEffect(() => {
    AnalyticsService.init();
  }, []);

  return {
    trackSpin: AnalyticsService.trackSpin.bind(AnalyticsService),
    trackPurchase: AnalyticsService.trackPurchase.bind(AnalyticsService),
    trackAdView: AnalyticsService.trackAdView.bind(AnalyticsService),
    trackLevelUp: AnalyticsService.trackLevelUp.bind(AnalyticsService),
    trackAchievement: AnalyticsService.trackAchievement.bind(AnalyticsService)
  };
};

export const useOfflineStatus = () => {
  const [isOnline, setIsOnline] = useState(OfflineService.isOnline);

  useEffect(() => {
    OfflineService.init();
    const unsubscribe = OfflineService.subscribe(setIsOnline);
    return unsubscribe;
  }, []);

  return isOnline;
};

export const useSecureStorage = (key, defaultValue) => {
  const [value, setValue] = useState(() => 
    SecurityService.loadSecure(key, defaultValue)
  );

  const setSecureValue = useCallback((newValue) => {
    SecurityService.saveSecure(key, newValue);
    setValue(newValue);
  }, [key]);

  return [value, setSecureValue];
};
