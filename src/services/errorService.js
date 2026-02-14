import { Storage } from '../utils/storage';

const ERROR_LOG_KEY = 'errorLogs';
const MAX_LOG_ENTRIES = 200;

const wait = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

export const ErrorService = {
  log(error, context = 'unknown', metadata = {}) {
    const entry = {
      context,
      message: error?.message || String(error),
      stack: error?.stack || null,
      metadata,
      timestamp: Date.now()
    };

    console.error(`[${context}]`, error);
    const logs = Storage.load(ERROR_LOG_KEY, []);
    logs.push(entry);
    Storage.save(ERROR_LOG_KEY, logs.slice(-MAX_LOG_ENTRIES));
    return entry;
  },

  notifyUser(message, context = 'general') {
    window.dispatchEvent(
      new CustomEvent('app:error', {
        detail: { message, context, timestamp: Date.now() }
      })
    );
  },

  getUserMessage(context = 'general') {
    const messages = {
      purchase: 'Purchase failed. Please try again.',
      cloud_sync: 'Cloud sync is unavailable right now.',
      leaderboard: 'Leaderboard service is temporarily unavailable.',
      backend_validation: 'Validation failed. Retrying with fallback.',
      fatal: 'Something went wrong. Please retry.'
    };
    return messages[context] || 'Something went wrong. Please try again.';
  },

  async withRetry(operation, { retries = 1, delayMs = 250, context = 'general', notifyOnFailure = false } = {}) {
    let lastError;

    for (let attempt = 0; attempt <= retries; attempt += 1) {
      try {
        return await operation(attempt);
      } catch (error) {
        lastError = error;
        if (attempt < retries) {
          await wait(delayMs * (attempt + 1));
          continue;
        }
      }
    }

    this.log(lastError, context);
    if (notifyOnFailure) {
      this.notifyUser(this.getUserMessage(context), context);
    }
    throw lastError;
  }
};
