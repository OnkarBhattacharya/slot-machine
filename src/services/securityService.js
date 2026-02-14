import { Storage } from '../utils/storage';
import CryptoJS from 'crypto-js';

const INTEGRITY_KEY = 'dataIntegrity';
const RATE_LIMIT_KEY = 'rateLimits';
const ANOMALY_KEY = 'securityAnomalies';
const SECURITY_KEY = process.env.REACT_APP_SECURITY_KEY || 'slot-machine-dev-security-key';
const REQUEST_SIGNING_KEY = process.env.REACT_APP_REQUEST_SIGNING_KEY || SECURITY_KEY;

export const SecurityService = {
  encrypt(data) {
    try {
      const str = JSON.stringify(data);
      return CryptoJS.AES.encrypt(str, SECURITY_KEY).toString();
    } catch (e) {
      console.error('Encryption error:', e);
      return null;
    }
  },

  decrypt(encrypted) {
    try {
      const bytes = CryptoJS.AES.decrypt(encrypted, SECURITY_KEY);
      const plaintext = bytes.toString(CryptoJS.enc.Utf8);
      if (!plaintext) return null;
      return JSON.parse(plaintext);
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
    return CryptoJS.SHA256(JSON.stringify(value)).toString(CryptoJS.enc.Hex);
  },

  getRateLimitState(action) {
    const limits = Storage.load(RATE_LIMIT_KEY, {});
    const now = Date.now();

    if (!limits[action] || now > limits[action].resetAt) {
      return {
        count: 0,
        resetAt: now,
        timeLeftMs: 0,
        blocked: false
      };
    }

    const entry = limits[action];
    const timeLeftMs = Math.max(0, entry.resetAt - now);
    return {
      count: entry.count || 0,
      resetAt: entry.resetAt,
      timeLeftMs,
      blocked: false
    };
  },

  checkRateLimit(action, maxAttempts = 10, windowMs = 60000) {
    const limits = Storage.load(RATE_LIMIT_KEY, {});
    const now = Date.now();

    if (!limits[action] || now > limits[action].resetAt) {
      limits[action] = { count: 1, resetAt: now + windowMs };
      Storage.save(RATE_LIMIT_KEY, limits);
      return true;
    }

    if ((limits[action].count || 0) >= maxAttempts) return false;

    limits[action].count = (limits[action].count || 0) + 1;
    Storage.save(RATE_LIMIT_KEY, limits);
    return true;
  },

  detectCheat(coins, previousCoins, maxGain = 10000) {
    const delta = coins - previousCoins;
    if (delta > maxGain || delta < -1000000) {
      this.trackAnomaly('coin_delta', { coins, previousCoins, delta, maxGain });
      return true;
    }
    return false;
  },

  trackAnomaly(type, details = {}) {
    const anomalies = Storage.load(ANOMALY_KEY, []);
    anomalies.push({
      type,
      details,
      timestamp: Date.now()
    });
    Storage.save(ANOMALY_KEY, anomalies.slice(-100));
  },

  getAnomalies() {
    return Storage.load(ANOMALY_KEY, []);
  },

  getSignedRequest(payload) {
    const timestamp = Date.now();
    const nonce = CryptoJS.lib.WordArray.random(16).toString(CryptoJS.enc.Hex);
    const body = JSON.stringify(payload || {});
    const payloadHash = CryptoJS.SHA256(body).toString(CryptoJS.enc.Hex);
    const signature = CryptoJS.HmacSHA256(
      `${timestamp}.${nonce}.${payloadHash}`,
      REQUEST_SIGNING_KEY
    ).toString(CryptoJS.enc.Hex);

    return {
      payload,
      signature,
      timestamp,
      nonce
    };
  },

  verifySignedRequest({ payload, signature, timestamp, nonce }, maxAgeMs = 120000) {
    if (!signature || !timestamp || !nonce) return false;
    if (Math.abs(Date.now() - Number(timestamp)) > maxAgeMs) return false;

    const body = JSON.stringify(payload || {});
    const payloadHash = CryptoJS.SHA256(body).toString(CryptoJS.enc.Hex);
    const expected = CryptoJS.HmacSHA256(
      `${timestamp}.${nonce}.${payloadHash}`,
      REQUEST_SIGNING_KEY
    ).toString(CryptoJS.enc.Hex);

    return expected === signature;
  }
};
