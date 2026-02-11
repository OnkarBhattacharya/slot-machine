import { Storage } from '../utils/storage';

export const LevelService = {
  getXP: () => Storage.load('xp', 0),
  getLevel: () => Storage.load('level', 1),

  xpForLevel: (level) => level * 100,

  addXP: (amount) => {
    let xp = LevelService.getXP() + amount;
    let level = LevelService.getLevel();
    let leveledUp = false;

    while (xp >= LevelService.xpForLevel(level)) {
      xp -= LevelService.xpForLevel(level);
      level++;
      leveledUp = true;
    }

    Storage.save('xp', xp);
    Storage.save('level', level);
    return { xp, level, leveledUp };
  },

  getLevelPerks: (level) => {
    const bonusCoins = Math.floor(level / 5) * 100;
    const oddsBoost = Math.min(level * 0.5, 10);
    return { bonusCoins, oddsBoost };
  }
};
