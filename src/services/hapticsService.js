import { Capacitor } from '@capacitor/core';
import { Haptics, ImpactStyle } from '@capacitor/haptics';

export class HapticsService {
  static isNative() {
    return Capacitor.isNativePlatform();
  }

  static async impact(style = ImpactStyle.Light) {
    try {
      if (this.isNative()) {
        await Haptics.impact({ style });
        return;
      }
      if (typeof navigator !== 'undefined' && navigator.vibrate) {
        const patternByStyle = {
          [ImpactStyle.Light]: 10,
          [ImpactStyle.Medium]: 20,
          [ImpactStyle.Heavy]: 40
        };
        navigator.vibrate(patternByStyle[style] || 15);
      }
    } catch {
      // Ignore haptics failures.
    }
  }

  static async menuNavigate() {
    try {
      if (this.isNative()) {
        await Haptics.selectionStart();
        await Haptics.selectionChanged();
        await Haptics.selectionEnd();
      } else if (typeof navigator !== 'undefined' && navigator.vibrate) {
        navigator.vibrate(8);
      }
    } catch {
      // Ignore haptics failures.
    }
  }

  static async reelStop() {
    await this.impact(ImpactStyle.Medium);
  }

  static async bigWin() {
    await this.impact(ImpactStyle.Heavy);
  }
}
