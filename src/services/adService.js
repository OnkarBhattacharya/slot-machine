export const AdService = {
  initialized: false,
  spinCount: 0,

  initialize: async () => {
    try {
      if (window.Capacitor) {
        const { AdMob } = await import('@capacitor-community/admob');
        await AdMob.initialize({
          requestTrackingAuthorization: true,
          initializeForTesting: true
        });
        AdService.initialized = true;
      }
    } catch (error) {
      console.log('AdMob not available:', error);
    }
  },

  showRewardedAd: async () => {
    try {
      if (!window.Capacitor) {
        alert('Ad watched! +100 coins (Web simulation)');
        return true;
      }

      const { AdMob, RewardAdPluginEvents } = await import('@capacitor-community/admob');
      
      return new Promise((resolve) => {
        AdMob.addListener(RewardAdPluginEvents.Rewarded, (reward) => {
          resolve(true);
        });

        AdMob.prepareRewardVideoAd({
          adId: 'ca-app-pub-3940256099942544/5224354917', // Test ID
          isTesting: true
        }).then(() => {
          AdMob.showRewardVideoAd();
        });
      });
    } catch (error) {
      console.error('Ad error:', error);
      return false;
    }
  },

  showBannerAd: async () => {
    try {
      if (!window.Capacitor) return;
      
      const { AdMob, BannerAdSize, BannerAdPosition } = await import('@capacitor-community/admob');
      
      await AdMob.showBanner({
        adId: 'ca-app-pub-3940256099942544/6300978111', // Test ID
        adSize: BannerAdSize.BANNER,
        position: BannerAdPosition.BOTTOM_CENTER,
        isTesting: true
      });
    } catch (error) {
      console.error('Banner ad error:', error);
    }
  },

  hideBannerAd: async () => {
    try {
      if (!window.Capacitor) return;

      const { AdMob } = await import('@capacitor-community/admob');
      await AdMob.hideBanner();
    } catch (error) {
      console.error('Hide banner ad error:', error);
    }
  },

  shouldShowInterstitial: () => {
    AdService.spinCount += 1;
    // Show roughly every 7 spins for non-VIP users.
    return AdService.spinCount % 7 === 0;
  },

  showInterstitialAd: async () => {
    try {
      if (!window.Capacitor) return true;

      const { AdMob } = await import('@capacitor-community/admob');
      await AdMob.prepareInterstitial({
        adId: 'ca-app-pub-3940256099942544/1033173712', // Test ID
        isTesting: true
      });
      await AdMob.showInterstitial();
      return true;
    } catch (error) {
      console.error('Interstitial ad error:', error);
      return false;
    }
  }
};
