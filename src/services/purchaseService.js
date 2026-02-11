export const PurchaseService = {
  initialized: false,

  initialize: async () => {
    try {
      if (window.Capacitor) {
        const { Purchases } = await import('@revenuecat/purchases-capacitor');
        await Purchases.configure({
          apiKey: 'YOUR_REVENUECAT_API_KEY'
        });
        PurchaseService.initialized = true;
      }
    } catch (error) {
      console.log('In-app purchases not available:', error);
    }
  },

  buyCoins: async (amount) => {
    try {
      if (!window.Capacitor) {
        const confirm = window.confirm(`Purchase ${amount} coins?`);
        return confirm;
      }

      const { Purchases } = await import('@revenuecat/purchases-capacitor');
      const productId = `coins_${amount}`;
      
      const { customerInfo } = await Purchases.purchaseProduct({ product: productId });
      return customerInfo.entitlements.active['coins'] !== undefined;
    } catch (error) {
      console.error('Purchase error:', error);
      return false;
    }
  },

  buyBundle: async (bundleId) => {
    try {
      if (!window.Capacitor) {
        const confirm = window.confirm(`Purchase bundle ${bundleId}?`);
        return confirm;
      }

      const { Purchases } = await import('@revenuecat/purchases-capacitor');
      const { customerInfo } = await Purchases.purchaseProduct({ product: bundleId });
      return !!customerInfo;
    } catch (error) {
      console.error('Bundle purchase error:', error);
      return false;
    }
  },

  restorePurchases: async () => {
    try {
      if (!window.Capacitor) return;
      
      const { Purchases } = await import('@revenuecat/purchases-capacitor');
      await Purchases.restorePurchases();
    } catch (error) {
      console.error('Restore error:', error);
    }
  }
};
