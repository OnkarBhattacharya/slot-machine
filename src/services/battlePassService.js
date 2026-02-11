import { Storage } from '../utils/storage';

const BATTLE_PASS_TIERS = [
  { level: 1, xpRequired: 0, freeReward: { coins: 100 }, premiumReward: { coins: 300, booster: '2x_1h' } },
  { level: 2, xpRequired: 500, freeReward: { coins: 150 }, premiumReward: { coins: 500, machine: 'neon' } },
  { level: 3, xpRequired: 1200, freeReward: { coins: 200 }, premiumReward: { coins: 800, theme: 'retro' } },
  { level: 4, xpRequired: 2000, freeReward: { coins: 300 }, premiumReward: { coins: 1200, booster: '3x_2h' } },
  { level: 5, xpRequired: 3000, freeReward: { coins: 500 }, premiumReward: { coins: 2000, exclusive: 'golden_reel' } },
  { level: 6, xpRequired: 4200, freeReward: { coins: 700 }, premiumReward: { coins: 3000, machine: 'cosmic' } },
  { level: 7, xpRequired: 5600, freeReward: { coins: 1000 }, premiumReward: { coins: 5000, booster: '5x_3h' } },
  { level: 8, xpRequired: 7200, freeReward: { coins: 1500 }, premiumReward: { coins: 8000, theme: 'diamond' } },
  { level: 9, xpRequired: 9000, freeReward: { coins: 2000 }, premiumReward: { coins: 12000, exclusive: 'jackpot_boost' } },
  { level: 10, xpRequired: 11000, freeReward: { coins: 5000 }, premiumReward: { coins: 25000, exclusive: 'legendary_frame' } }
];

const SEASON_DURATION = 30 * 24 * 60 * 60 * 1000; // 30 days
const PREMIUM_PASS_PRICE = 999; // $9.99

export class BattlePassService {
  static getCurrentSeason() {
    const seasons = Storage.load('battlepass_seasons', []);
    const now = Date.now();
    
    let currentSeason = seasons.find(s => s.startTime <= now && s.endTime > now);
    
    if (!currentSeason) {
      currentSeason = this.createNewSeason();
    }
    
    return currentSeason;
  }

  static createNewSeason() {
    const seasons = Storage.load('battlepass_seasons', []);
    const seasonNumber = seasons.length + 1;
    const now = Date.now();
    
    const newSeason = {
      id: `season_${seasonNumber}`,
      number: seasonNumber,
      startTime: now,
      endTime: now + SEASON_DURATION,
      theme: this.getSeasonTheme(seasonNumber)
    };
    
    seasons.push(newSeason);
    Storage.save('battlepass_seasons', seasons);
    
    // Reset player progress for new season
    Storage.save('battlepass_progress', {
      seasonId: newSeason.id,
      xp: 0,
      level: 1,
      isPremium: false,
      claimedRewards: []
    });
    
    return newSeason;
  }

  static getSeasonTheme(seasonNumber) {
    const themes = ['Spring Festival', 'Summer Beach', 'Autumn Harvest', 'Winter Wonderland', 
                    'Space Odyssey', 'Ocean Adventure', 'Desert Mirage', 'Neon City'];
    return themes[(seasonNumber - 1) % themes.length];
  }

  static getProgress() {
    const season = this.getCurrentSeason();
    const progress = Storage.load('battlepass_progress', {
      seasonId: season.id,
      xp: 0,
      level: 1,
      isPremium: false,
      claimedRewards: []
    });
    
    // Reset if season changed
    if (progress.seasonId !== season.id) {
      this.createNewSeason();
      const refreshedSeason = this.getCurrentSeason();
      return Storage.load('battlepass_progress', {
        seasonId: refreshedSeason.id,
        xp: 0,
        level: 1,
        isPremium: false,
        claimedRewards: []
      });
    }
    
    return progress;
  }

  static addXP(amount) {
    const progress = this.getProgress();
    progress.xp += amount;
    
    // Calculate level
    let newLevel = 1;
    for (let i = BATTLE_PASS_TIERS.length - 1; i >= 0; i--) {
      if (progress.xp >= BATTLE_PASS_TIERS[i].xpRequired) {
        newLevel = i + 1;
        break;
      }
    }
    
    const leveledUp = newLevel > progress.level;
    progress.level = newLevel;
    
    Storage.save('battlepass_progress', progress);
    
    return { xp: progress.xp, level: newLevel, leveledUp };
  }

  static purchasePremium() {
    const progress = this.getProgress();
    progress.isPremium = true;
    Storage.save('battlepass_progress', progress);
    return true;
  }

  static isPremium() {
    return this.getProgress().isPremium;
  }

  static canClaimReward(level, isPremiumReward) {
    const progress = this.getProgress();
    
    if (progress.level < level) return false;
    if (isPremiumReward && !progress.isPremium) return false;
    
    const rewardKey = `${level}_${isPremiumReward ? 'premium' : 'free'}`;
    return !progress.claimedRewards.includes(rewardKey);
  }

  static claimReward(level, isPremiumReward) {
    if (!this.canClaimReward(level, isPremiumReward)) {
      return null;
    }
    
    const progress = this.getProgress();
    const tier = BATTLE_PASS_TIERS[level - 1];
    const reward = isPremiumReward ? tier.premiumReward : tier.freeReward;
    
    const rewardKey = `${level}_${isPremiumReward ? 'premium' : 'free'}`;
    progress.claimedRewards.push(rewardKey);
    Storage.save('battlepass_progress', progress);
    
    return reward;
  }

  static getTiers() {
    return BATTLE_PASS_TIERS;
  }

  static getTimeRemaining() {
    const season = this.getCurrentSeason();
    return Math.max(0, season.endTime - Date.now());
  }

  static getPremiumPrice() {
    return PREMIUM_PASS_PRICE;
  }

  static getSeasonStats() {
    const progress = this.getProgress();
    const season = this.getCurrentSeason();
    
    return {
      seasonNumber: season.number,
      theme: season.theme,
      level: progress.level,
      xp: progress.xp,
      nextLevelXP: BATTLE_PASS_TIERS[progress.level]?.xpRequired || 0,
      isPremium: progress.isPremium,
      timeRemaining: this.getTimeRemaining(),
      totalTiers: BATTLE_PASS_TIERS.length,
      claimedRewards: progress.claimedRewards.length
    };
  }
}
