import { Storage } from '../utils/storage';

export class AccessibilityService {
  static getSettings() {
    return {
      screenReader: Storage.load('a11y_screenReader', false),
      colorblindMode: Storage.load('a11y_colorblind', 'none'),
      animationSpeed: Storage.load('a11y_animSpeed', 1),
      keyboardNav: Storage.load('a11y_keyboard', true)
    };
  }

  static setScreenReader(enabled) {
    Storage.save('a11y_screenReader', enabled);
    this.applyScreenReader(enabled);
  }

  static applyScreenReader(enabled) {
    document.body.setAttribute('aria-live', enabled ? 'polite' : 'off');
  }

  static setColorblindMode(mode) {
    const validModes = ['none', 'protanopia', 'deuteranopia', 'tritanopia'];
    if (!validModes.includes(mode)) return false;
    Storage.save('a11y_colorblind', mode);
    this.applyColorblindMode(mode);
    return true;
  }

  static applyColorblindMode(mode) {
    document.body.classList.remove('cb-protanopia', 'cb-deuteranopia', 'cb-tritanopia');
    if (mode !== 'none') {
      document.body.classList.add(`cb-${mode}`);
    }
  }

  static setAnimationSpeed(speed) {
    if (speed < 0.5 || speed > 2) return false;
    Storage.save('a11y_animSpeed', speed);
    this.applyAnimationSpeed(speed);
    return true;
  }

  static applyAnimationSpeed(speed) {
    document.documentElement.style.setProperty('--animation-speed', speed);
  }

  static announce(message) {
    const settings = this.getSettings();
    if (!settings.screenReader) return;

    const announcer = document.getElementById('a11y-announcer');
    if (announcer) {
      announcer.textContent = message;
    }
  }
}
