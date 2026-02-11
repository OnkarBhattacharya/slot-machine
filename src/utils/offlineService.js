import { Storage } from './storage';

const OFFLINE_QUEUE_KEY = 'offlineQueue';

export const OfflineService = {
  isOnline: navigator.onLine,
  listeners: new Set(),

  init() {
    window.addEventListener('online', () => {
      this.isOnline = true;
      this.notifyListeners();
      this.processQueue();
    });

    window.addEventListener('offline', () => {
      this.isOnline = false;
      this.notifyListeners();
    });
  },

  subscribe(listener) {
    this.listeners.add(listener);
    return () => this.listeners.delete(listener);
  },

  notifyListeners() {
    this.listeners.forEach(listener => listener(this.isOnline));
  },

  queueAction(action) {
    const queue = Storage.load(OFFLINE_QUEUE_KEY, []);
    queue.push({ ...action, timestamp: Date.now() });
    Storage.save(OFFLINE_QUEUE_KEY, queue);
  },

  async processQueue() {
    if (!this.isOnline) return;

    const queue = Storage.load(OFFLINE_QUEUE_KEY, []);
    if (queue.length === 0) return;

    const processed = [];
    
    for (const action of queue) {
      try {
        await this.executeAction(action);
        processed.push(action);
      } catch (error) {
        console.error('Failed to process queued action:', error);
      }
    }

    const remaining = queue.filter(a => !processed.includes(a));
    Storage.save(OFFLINE_QUEUE_KEY, remaining);
  },

  async executeAction(action) {
    console.log('Executing queued action:', action);
  },

  getQueueSize() {
    return Storage.load(OFFLINE_QUEUE_KEY, []).length;
  },

  clearQueue() {
    Storage.save(OFFLINE_QUEUE_KEY, []);
  }
};
