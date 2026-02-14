import {
  collection,
  doc,
  getDoc,
  getDocs,
  limit,
  orderBy,
  query,
  serverTimestamp,
  setDoc
} from 'firebase/firestore';
import { httpsCallable } from 'firebase/functions';
import { FirebaseService } from './firebaseService';
import { OfflineService } from '../utils/offlineService';
import { SecurityService } from './securityService';
import { ErrorService } from './errorService';

const CLOUD_ENABLED = process.env.REACT_APP_ENABLE_CLOUD_SYNC === 'true';

const BackendService = {
  initialized: false,
  enabled: false,
  userId: null,
  initPromise: null,

  async initialize() {
    if (this.initialized) {
      return { enabled: this.enabled, userId: this.userId };
    }
    if (this.initPromise) return this.initPromise;

    this.initPromise = (async () => {
      this.initialized = true;

      if (!CLOUD_ENABLED) return { enabled: false, userId: null };
      if (!FirebaseService.initialize()) return { enabled: false, userId: null };

      const user = await FirebaseService.ensureAnonymousAuth();
      this.enabled = Boolean(user?.uid);
      this.userId = user?.uid || null;

      return { enabled: this.enabled, userId: this.userId };
    })();

    return this.initPromise;
  },

  async getUserId() {
    if (!this.initialized) await this.initialize();
    return this.userId;
  },

  async validateSpin(payload) {
    try {
      const { enabled } = await this.initialize();
      if (!enabled || !OfflineService.isOnline) {
        return { valid: true, source: 'local_fallback' };
      }

      const functions = FirebaseService.getFunctions();
      if (!functions) {
        return { valid: true, source: 'local_fallback' };
      }

      const response = await ErrorService.withRetry(async () => {
        const callable = httpsCallable(functions, 'validateSpin');
        const signedRequest = SecurityService.getSignedRequest(payload);
        return await callable(signedRequest);
      }, { retries: 1, context: 'backend_validation' });
      return { ...response.data, source: 'firebase' };
    } catch (error) {
      ErrorService.log(error, 'backend_validation');
      return { valid: true, source: 'local_fallback', error: error.message };
    }
  },

  async verifyPurchase(payload) {
    try {
      const { enabled } = await this.initialize();
      if (!enabled || !OfflineService.isOnline) {
        return { verified: true, source: 'local_fallback' };
      }

      const functions = FirebaseService.getFunctions();
      if (!functions) {
        return { verified: true, source: 'local_fallback' };
      }

      const response = await ErrorService.withRetry(async () => {
        const callable = httpsCallable(functions, 'verifyPurchase');
        const signedRequest = SecurityService.getSignedRequest(payload);
        return await callable(signedRequest);
      }, { retries: 1, context: 'purchase', notifyOnFailure: true });
      return { ...response.data, source: 'firebase' };
    } catch (error) {
      ErrorService.log(error, 'purchase');
      return { verified: true, source: 'local_fallback', error: error.message };
    }
  },

  async syncLeaderboardScore(coins) {
    try {
      const { enabled, userId } = await this.initialize();
      if (!enabled || !userId || !OfflineService.isOnline) return false;

      const firestore = FirebaseService.getFirestore();
      if (!firestore) return false;

      const scoreRef = doc(firestore, 'leaderboard_scores', userId);
      const current = await getDoc(scoreRef);
      const previous = current.exists() ? (current.data().coins || 0) : 0;
      const best = Math.max(previous, coins);

      await setDoc(
        scoreRef,
        {
          userId,
          coins: best,
          updatedAt: serverTimestamp()
        },
        { merge: true }
      );

      return true;
    } catch (error) {
      ErrorService.log(error, 'leaderboard');
      return false;
    }
  },

  async fetchLeaderboard(limitCount = 100) {
    try {
      const { enabled } = await this.initialize();
      if (!enabled || !OfflineService.isOnline) return null;

      const firestore = FirebaseService.getFirestore();
      if (!firestore) return null;

      const leaderboardQuery = query(
        collection(firestore, 'leaderboard_scores'),
        orderBy('coins', 'desc'),
        limit(limitCount)
      );
      const snapshot = await getDocs(leaderboardQuery);

      return snapshot.docs.map((entry) => {
        const data = entry.data();
        return {
          id: entry.id,
          userId: data.userId,
          coins: data.coins || 0,
          timestamp: data.updatedAt?.toMillis?.() || Date.now()
        };
      });
    } catch (error) {
      ErrorService.log(error, 'leaderboard');
      return null;
    }
  },

  async saveUserData(data) {
    try {
      const { enabled, userId } = await this.initialize();
      if (!enabled || !userId || !OfflineService.isOnline) return false;

      const firestore = FirebaseService.getFirestore();
      if (!firestore) return false;

      const profileRef = doc(firestore, 'users', userId);
      await setDoc(
        profileRef,
        {
          data,
          updatedAt: serverTimestamp()
        },
        { merge: true }
      );
      return true;
    } catch (error) {
      ErrorService.log(error, 'cloud_sync');
      return false;
    }
  },

  async loadUserData() {
    try {
      const { enabled, userId } = await this.initialize();
      if (!enabled || !userId || !OfflineService.isOnline) return null;

      const firestore = FirebaseService.getFirestore();
      if (!firestore) return null;

      const profileRef = doc(firestore, 'users', userId);
      const snapshot = await getDoc(profileRef);
      if (!snapshot.exists()) return null;

      const data = snapshot.data();
      return {
        data: data.data || {},
        timestamp: data.updatedAt?.toMillis?.() || 0
      };
    } catch (error) {
      ErrorService.log(error, 'cloud_sync');
      return null;
    }
  }
};

export { BackendService };
