import { Storage } from '../utils/storage';

export const ACHIEVEMENTS = {
  FIRST_WIN: { id: 'first_win', name: 'First Win', desc: 'Win your first spin', reward: 100, icon: '🎉' },
  BIG_WINNER: { id: 'big_winner', name: 'Big Winner', desc: 'Win 1000+ coins in one spin', reward: 200, icon: '💰' },
  LUCKY_STREAK: { id: 'lucky_streak', name: 'Lucky Streak', desc: 'Win 5 spins in a row', reward: 300, icon: '🔥' },
  JACKPOT_HUNTER: { id: 'jackpot_hunter', name: 'Jackpot Hunter', desc: 'Win the jackpot', reward: 500, icon: '💎' },
  SPIN_MASTER: { id: 'spin_master', name: 'Spin Master', desc: 'Complete 100 spins', reward: 250, icon: '🎰' },
  HIGH_ROLLER: { id: 'high_roller', name: 'High Roller', desc: 'Bet 100 coins 10 times', reward: 400, icon: '👑' }
};

export const AchievementService = {
  getUnlocked: () => Storage.load('achievements', []),
  
  getProgress: () => Storage.load('achievementProgress', {
    wins: 0,
    winStreak: 0,
    totalSpins: 0,
    highBets: 0,
    biggestWin: 0
  }),

  checkAchievement: (id) => {
    const unlocked = AchievementService.getUnlocked();
    return unlocked.includes(id);
  },

  unlockAchievement: (id) => {
    if (AchievementService.checkAchievement(id)) return null;
    const unlocked = AchievementService.getUnlocked();
    unlocked.push(id);
    Storage.save('achievements', unlocked);
    return ACHIEVEMENTS[id];
  },

  updateProgress: (updates) => {
    const progress = AchievementService.getProgress();
    const newProgress = { ...progress, ...updates };
    Storage.save('achievementProgress', newProgress);

    const newAchievements = [];
    
    if (newProgress.wins >= 1 && !AchievementService.checkAchievement('first_win')) {
      newAchievements.push(AchievementService.unlockAchievement('FIRST_WIN'));
    }
    if (newProgress.biggestWin >= 1000 && !AchievementService.checkAchievement('big_winner')) {
      newAchievements.push(AchievementService.unlockAchievement('BIG_WINNER'));
    }
    if (newProgress.winStreak >= 5 && !AchievementService.checkAchievement('lucky_streak')) {
      newAchievements.push(AchievementService.unlockAchievement('LUCKY_STREAK'));
    }
    if (newProgress.totalSpins >= 100 && !AchievementService.checkAchievement('spin_master')) {
      newAchievements.push(AchievementService.unlockAchievement('SPIN_MASTER'));
    }
    if (newProgress.highBets >= 10 && !AchievementService.checkAchievement('high_roller')) {
      newAchievements.push(AchievementService.unlockAchievement('HIGH_ROLLER'));
    }

    return newAchievements.filter(a => a !== null);
  }
};
