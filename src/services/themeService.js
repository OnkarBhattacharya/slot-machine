import { Storage } from '../utils/storage';

const THEMES = {
  vegas: {
    name: 'Vegas',
    primary: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
    secondary: '#ffd700',
    accent: '#ff69b4',
    background: 'rgba(0,0,0,0.2)',
    text: '#ffffff'
  },
  retro: {
    name: 'Retro',
    primary: 'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)',
    secondary: '#ff6b6b',
    accent: '#4ecdc4',
    background: 'rgba(255,255,255,0.1)',
    text: '#ffffff'
  },
  neon: {
    name: 'Neon',
    primary: 'linear-gradient(135deg, #0f2027 0%, #203a43 50%, #2c5364 100%)',
    secondary: '#00ff41',
    accent: '#ff00ff',
    background: 'rgba(0,255,65,0.1)',
    text: '#00ff41'
  },
  dark: {
    name: 'Dark',
    primary: 'linear-gradient(135deg, #1a1a2e 0%, #16213e 100%)',
    secondary: '#e94560',
    accent: '#0f3460',
    background: 'rgba(233,69,96,0.1)',
    text: '#ffffff'
  }
};

export class ThemeService {
  static getCurrentTheme() {
    return Storage.load('theme', 'vegas');
  }

  static setTheme(themeName) {
    if (!THEMES[themeName]) return false;
    Storage.save('theme', themeName);
    this.applyTheme(themeName);
    return true;
  }

  static applyTheme(themeName) {
    const theme = THEMES[themeName];
    if (!theme) return;

    document.documentElement.style.setProperty('--primary-gradient', theme.primary);
    document.documentElement.style.setProperty('--secondary-color', theme.secondary);
    document.documentElement.style.setProperty('--accent-color', theme.accent);
    document.documentElement.style.setProperty('--background-overlay', theme.background);
    document.documentElement.style.setProperty('--text-color', theme.text);
  }

  static getThemes() {
    return Object.keys(THEMES).map(key => ({
      id: key,
      ...THEMES[key]
    }));
  }

  static isDarkMode() {
    return Storage.load('darkMode', false);
  }

  static toggleDarkMode() {
    const current = this.isDarkMode();
    Storage.save('darkMode', !current);
    this.applyDarkMode(!current);
    return !current;
  }

  static applyDarkMode(enabled) {
    if (enabled) {
      document.body.classList.add('dark-mode');
    } else {
      document.body.classList.remove('dark-mode');
    }
  }
}
