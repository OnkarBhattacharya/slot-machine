import { Storage } from '../utils/storage';

const INTEGRITY_KEY = 'dataIntegrity';
const RATE_LIMIT_KEY = 'rateLimits';

export const SecurityService = {
  encrypt(data) {
    try {
      const str = JSON.stringify(data);
      return btoa(encodeURIComponent(str));
    } catch (e) {
      console.error('Encryption error:', e);
      return null;
    }
  },

  decrypt(encrypted) {
    try {
      return JSON.parse(decodeURIComponent(atob(encrypted)));
    } catch (e) {
      console.error('Decryption error:', e);
      return null;
    }
  },

  saveSecure(key, value) {
    const encrypted = this.encrypt(value);
    if (encrypted) {
      Storage.save(key, encrypted);
      this.updateIntegrity(key, value);
    }
  },

  loadSecure(key, defaultValue = null) {
    const encrypted = Storage.load(key);
    if (!encrypted) return defaultValue;
    
    const decrypted = this.decrypt(encrypted);
    if (decrypted && this.verifyIntegrity(key, decrypted)) {
      return decrypted;
    }
    return defaultValue;
  },

  updateIntegrity(key, value) {
    const integrity = Storage.load(INTEGRITY_KEY, {});
    integrity[key] = this.hash(value);
    Storage.save(INTEGRITY_KEY, integrity);
  },

  verifyIntegrity(key, value) {
    const integrity = Storage.load(INTEGRITY_KEY, {});
    const expected = integrity[key];
    if (!expected) return true;
    return expected === this.hash(value);
  },

  hash(value) {
    const str = JSON.stringify(value);
    let hash = 0;
    for (let i = 0; i < str.length; i++) {
      const char = str.charCodeAt(i);
      hash = ((hash << 5) - hash) + char;
      hash = hash & hash;
    }
    return hash.toString(36);
  },

  checkRateLimit(action, maxAttempts = 10, windowMs = 60000) {
    const limits = Storage.load(RATE_LIMIT_KEY, {});
    const now = Date.now();
    
    if (!limits[action]) {
      limits[action] = { count: 1, resetAt: now + windowMs };
      Storage.save(RATE_LIMIT_KEY, limits);
      return true;
    }

    if (now > limits[action].resetAt) {
      limits[action] = { count: 1, resetAt: now + windowMs };
      Storage.save(RATE_LIMIT_KEY, limits);
      return true;
    }

    if (limits[action].count >= maxAttempts) {
      return false;
    }

    limits[action].count++;
    Storage.save(RATE_LIMIT_KEY, limits);
    return true;
  },

  detectCheat(coins, previousCoins, maxGain = 10000) {
    if (coins - previousCoins > maxGain) {
      console.warn('Potential cheat detected');
      return true;
    }
    return false;
  }
};
