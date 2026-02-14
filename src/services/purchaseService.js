import { BackendService } from './backendService';
import { ErrorService } from './errorService';

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
        if (!confirm) return false;
        const verification = await BackendService.verifyPurchase({
          type: 'coins',
          productId: `coins_${amount}`,
          amount,
          platform: 'web'
        });
        return verification?.verified !== false;
      }

      const { Purchases } = await import('@revenuecat/purchases-capacitor');
      const productId = `coins_${amount}`;
      
      const { customerInfo } = await Purchases.purchaseProduct({ product: productId });
      const hasEntitlement = customerInfo.entitlements.active['coins'] !== undefined;
      if (!hasEntitlement) return false;

      const verification = await BackendService.verifyPurchase({
        type: 'coins',
        productId,
        amount,
        platform: 'capacitor'
      });
      return verification?.verified !== false;
    } catch (error) {
      ErrorService.log(error, 'purchase');
      ErrorService.notifyUser(ErrorService.getUserMessage('purchase'), 'purchase');
      return false;
    }
  },

  buyBundle: async (bundleId) => {
    try {
      if (!window.Capacitor) {
        const confirm = window.confirm(`Purchase bundle ${bundleId}?`);
        if (!confirm) return false;
        const verification = await BackendService.verifyPurchase({
          type: 'bundle',
          productId: bundleId,
          platform: 'web'
        });
        return verification?.verified !== false;
      }

      const { Purchases } = await import('@revenuecat/purchases-capacitor');
      const { customerInfo } = await Purchases.purchaseProduct({ product: bundleId });
      if (!customerInfo) return false;

      const verification = await BackendService.verifyPurchase({
        type: 'bundle',
        productId: bundleId,
        platform: 'capacitor'
      });
      return verification?.verified !== false;
    } catch (error) {
      ErrorService.log(error, 'purchase');
      ErrorService.notifyUser(ErrorService.getUserMessage('purchase'), 'purchase');
      return false;
    }
  },

  restorePurchases: async () => {
    try {
      if (!window.Capacitor) return;
      
      const { Purchases } = await import('@revenuecat/purchases-capacitor');
      await Purchases.restorePurchases();
    } catch (error) {
      ErrorService.log(error, 'purchase');
      ErrorService.notifyUser(ErrorService.getUserMessage('purchase'), 'purchase');
    }
  }
};
