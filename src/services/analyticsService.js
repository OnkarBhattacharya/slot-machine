export const AnalyticsService = {
  initialized: false,

  init() {
    if (this.initialized) return;
    
    if (window.gtag) {
      this.initialized = true;
      console.log('Analytics initialized');
    }
  },

  trackEvent(category, action, label, value) {
    if (window.gtag) {
      window.gtag('event', action, {
        event_category: category,
        event_label: label,
        value: value
      });
    }
  },

  trackSpin(betAmount, winAmount, symbols) {
    this.trackEvent('Gameplay', 'spin', `Bet: ${betAmount}`, winAmount);
  },

  trackPurchase(productId, amount) {
    this.trackEvent('Monetization', 'purchase', productId, amount);
    if (window.gtag) {
      window.gtag('event', 'purchase', {
        transaction_id: Date.now().toString(),
        value: amount,
        currency: 'USD',
        items: [{ item_id: productId, item_name: productId }]
      });
    }
  },

  trackAdView(adType) {
    this.trackEvent('Ads', 'view', adType);
  },

  trackLevelUp(level) {
    this.trackEvent('Progression', 'level_up', `Level ${level}`, level);
  },

  trackAchievement(achievementId) {
    this.trackEvent('Achievements', 'unlock', achievementId);
  },

  setUserProperty(property, value) {
    if (window.gtag) {
      window.gtag('set', 'user_properties', { [property]: value });
    }
  }
};
