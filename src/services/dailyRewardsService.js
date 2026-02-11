import { Storage } from '../utils/storage';

export const DailyRewardsService = {
  checkDailyReward: () => {
    const lastClaim = Storage.load('lastDailyReward', 0);
    const streak = Storage.load('dailyStreak', 0);
    const now = Date.now();
    const oneDay = 24 * 60 * 60 * 1000;
    
    if (now - lastClaim >= oneDay) {
      const newStreak = (now - lastClaim < 2 * oneDay) ? streak + 1 : 1;
      return { available: true, streak: newStreak };
    }
    return { available: false, streak };
  },

  claimDailyReward: () => {
    const { streak } = DailyRewardsService.checkDailyReward();
    const reward = Math.min(100 + (streak - 1) * 50, 500);
    Storage.save('lastDailyReward', Date.now());
    Storage.save('dailyStreak', streak);
    return { coins: reward, streak };
  },

  spinWheel: () => {
    const rewards = [50, 100, 150, 200, 500, 1000];
    return rewards[Math.floor(Math.random() * rewards.length)];
  }
};
