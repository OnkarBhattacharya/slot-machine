import { Storage } from '../utils/storage';

export class SubscriptionService {
  static isSubscribed() {
    const sub = Storage.load('subscription', null);
    if (!sub) return false;
    return sub.expiresAt > Date.now();
  }

  static async subscribe(type) {
    // Mock subscription - in production, integrate with RevenueCat
    const duration = type === 'vip' ? 30 * 24 * 60 * 60 * 1000 : 0; // 30 days
    Storage.save('subscription', {
      type,
      expiresAt: Date.now() + duration,
      lastClaim: 0
    });
    return true;
  }

  static claimDailyCoins() {
    if (!this.isSubscribed()) return 0;
    
    const sub = Storage.load('subscription', null);
    const today = new Date().toDateString();
    const lastClaim = new Date(sub.lastClaim).toDateString();
    
    if (today !== lastClaim) {
      sub.lastClaim = Date.now();
      Storage.save('subscription', sub);
      return 500; // Daily VIP bonus
    }
    return 0;
  }
}
