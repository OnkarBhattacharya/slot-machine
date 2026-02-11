import { Storage } from '../utils/storage';

const MAX_LEVEL = 100;
const PRESTIGE_LEVELS = 10;

const PRESTIGE_BENEFITS = {
  1: { coinMultiplier: 1.1, xpMultiplier: 1.1, badge: '⭐', color: '#ffd700' },
  2: { coinMultiplier: 1.2, xpMultiplier: 1.15, badge: '⭐⭐', color: '#ff6b6b' },
  3: { coinMultiplier: 1.3, xpMultiplier: 1.2, badge: '⭐⭐⭐', color: '#4ecdc4' },
  4: { coinMultiplier: 1.4, xpMultiplier: 1.25, badge: '💎', color: '#95e1d3' },
  5: { coinMultiplier: 1.5, xpMultiplier: 1.3, badge: '💎💎', color: '#f38181' },
  6: { coinMultiplier: 1.6, xpMultiplier: 1.35, badge: '💎💎💎', color: '#aa96da' },
  7: { coinMultiplier: 1.75, xpMultiplier: 1.4, badge: '👑', color: '#fcbad3' },
  8: { coinMultiplier: 2.0, xpMultiplier: 1.5, badge: '👑👑', color: '#ffffd2' },
  9: { coinMultiplier: 2.5, xpMultiplier: 1.75, badge: '👑👑👑', color: '#a8d8ea' },
  10: { coinMultiplier: 3.0, xpMultiplier: 2.0, badge: '🔥LEGEND🔥', color: '#ff0000' }
};

export class PrestigeService {
  static getPrestigeData() {
    return Storage.load('prestige', {
      level: 0,
      totalPrestiges: 0,
      prestigeHistory: []
    });
  }

  static canPrestige(currentLevel) {
    return currentLevel >= MAX_LEVEL;
  }

  static getPrestigeLevel() {
    return this.getPrestigeData().level;
  }

  static getTotalPrestiges() {
    return this.getPrestigeData().totalPrestiges;
  }

  static prestige(currentLevel, currentCoins) {
    if (!this.canPrestige(currentLevel)) {
      return { success: false, error: 'Must reach max level to prestige' };
    }

    const prestigeData = this.getPrestigeData();
    
    if (prestigeData.level >= PRESTIGE_LEVELS) {
      return { success: false, error: 'Max prestige level reached' };
    }

    const newPrestigeLevel = prestigeData.level + 1;
    const bonusCoins = this.calculatePrestigeBonus(currentLevel, currentCoins);

    prestigeData.level = newPrestigeLevel;
    prestigeData.totalPrestiges += 1;
    prestigeData.prestigeHistory.push({
      timestamp: Date.now(),
      level: newPrestigeLevel,
      bonusCoins
    });

    Storage.save('prestige', prestigeData);

    // Reset player level but keep prestige benefits
    Storage.save('level', 1);
    Storage.save('xp', 0);

    return {
      success: true,
      newPrestigeLevel,
      bonusCoins,
      benefits: PRESTIGE_BENEFITS[newPrestigeLevel]
    };
  }

  static calculatePrestigeBonus(level, coins) {
    // Bonus based on level and current coins
    const levelBonus = level * 1000;
    const coinBonus = Math.floor(coins * 0.1);
    return levelBonus + coinBonus;
  }

  static getPrestigeBenefits(prestigeLevel = null) {
    const level = prestigeLevel || this.getPrestigeLevel();
    return PRESTIGE_BENEFITS[level] || { 
      coinMultiplier: 1, 
      xpMultiplier: 1, 
      badge: '', 
      color: '#ffffff' 
    };
  }

  static getCoinMultiplier() {
    return this.getPrestigeBenefits().coinMultiplier;
  }

  static getXPMultiplier() {
    return this.getPrestigeBenefits().xpMultiplier;
  }

  static getPrestigeBadge() {
    const benefits = this.getPrestigeBenefits();
    return benefits.badge;
  }

  static getPrestigeColor() {
    const benefits = this.getPrestigeBenefits();
    return benefits.color;
  }

  static getPrestigeStats() {
    const data = this.getPrestigeData();
    const benefits = this.getPrestigeBenefits();
    
    return {
      currentPrestige: data.level,
      totalPrestiges: data.totalPrestiges,
      maxPrestige: PRESTIGE_LEVELS,
      badge: benefits.badge,
      color: benefits.color,
      coinMultiplier: benefits.coinMultiplier,
      xpMultiplier: benefits.xpMultiplier,
      canPrestigeAgain: data.level < PRESTIGE_LEVELS,
      history: data.prestigeHistory
    };
  }

  static getNextPrestigeBenefits() {
    const currentLevel = this.getPrestigeLevel();
    if (currentLevel >= PRESTIGE_LEVELS) return null;
    return PRESTIGE_BENEFITS[currentLevel + 1];
  }

  static getAllPrestigeLevels() {
    return Object.keys(PRESTIGE_BENEFITS).map(level => ({
      level: parseInt(level),
      ...PRESTIGE_BENEFITS[level]
    }));
  }

  static getMaxLevel() {
    return MAX_LEVEL;
  }
}
