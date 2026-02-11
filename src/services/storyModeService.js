import { Storage } from '../utils/storage';

const STORY_LEVELS = [
  { id: 1, name: 'The Beginning', boss: 'Lucky Larry', bossHP: 1000, reward: 500, unlockMachine: null },
  { id: 2, name: 'Vegas Nights', boss: 'Casino Carl', bossHP: 2000, reward: 1000, unlockMachine: null },
  { id: 3, name: 'Desert Oasis', boss: 'Pharaoh Pete', bossHP: 3000, reward: 2000, unlockMachine: 'egyptian' },
  { id: 4, name: 'Ocean Depths', boss: 'Captain Jack', bossHP: 5000, reward: 3500, unlockMachine: 'ocean' },
  { id: 5, name: 'Space Station', boss: 'Alien Ace', bossHP: 8000, reward: 5000, unlockMachine: 'space' }
];

export class StoryModeService {
  static getLevels() {
    return STORY_LEVELS;
  }

  static getCurrentLevel() {
    return Storage.load('storyLevel', 1);
  }

  static getLevelProgress(levelId) {
    const progress = Storage.load('storyProgress', {});
    return progress[levelId] || { completed: false, bossHP: STORY_LEVELS[levelId - 1].bossHP };
  }

  static damageBoss(levelId, damage) {
    const progress = Storage.load('storyProgress', {});
    const level = STORY_LEVELS[levelId - 1];
    
    if (!progress[levelId]) {
      progress[levelId] = { completed: false, bossHP: level.bossHP };
    }
    
    progress[levelId].bossHP -= damage;
    
    if (progress[levelId].bossHP <= 0) {
      progress[levelId].completed = true;
      progress[levelId].bossHP = 0;
      
      const currentLevel = Storage.load('storyLevel', 1);
      if (levelId === currentLevel) {
        Storage.save('storyLevel', levelId + 1);
      }
    }
    
    Storage.save('storyProgress', progress);
    return progress[levelId];
  }

  static isLevelUnlocked(levelId) {
    const currentLevel = this.getCurrentLevel();
    return levelId <= currentLevel;
  }

  static getReward(levelId) {
    return STORY_LEVELS[levelId - 1].reward;
  }
}
