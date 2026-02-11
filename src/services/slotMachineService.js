import { Storage } from '../utils/storage';

const MACHINES = {
  classic: {
    id: 'classic',
    name: 'Classic Vegas',
    theme: '🎰',
    unlockLevel: 1,
    symbols: ['🍒', '🍋', '🍊', '🍇', '7️⃣', '💎', '⭐', '🎁'],
    payouts: { '💎💎💎': 500, '7️⃣7️⃣7️⃣': 1000, '🍒🍒🍒': 100 },
    upgrades: { level: 1, maxLevel: 5 }
  },
  egyptian: {
    id: 'egyptian',
    name: 'Egyptian Treasure',
    theme: '🏺',
    unlockLevel: 5,
    symbols: ['🏺', '👁️', '🐍', '🦅', '💰', '👑', '⭐', '🎁'],
    payouts: { '👑👑👑': 800, '💰💰💰': 1500, '🏺🏺🏺': 150 },
    upgrades: { level: 1, maxLevel: 5 }
  },
  ocean: {
    id: 'ocean',
    name: 'Ocean Fortune',
    theme: '🌊',
    unlockLevel: 10,
    symbols: ['🐚', '🐠', '🦈', '🐙', '💎', '🏴‍☠️', '⭐', '🎁'],
    payouts: { '🏴‍☠️🏴‍☠️🏴‍☠️': 1200, '💎💎💎': 2000, '🐚🐚🐚': 200 },
    upgrades: { level: 1, maxLevel: 5 }
  },
  space: {
    id: 'space',
    name: 'Space Adventure',
    theme: '🚀',
    unlockLevel: 15,
    symbols: ['🚀', '🛸', '👽', '🌟', '🪐', '💫', '⭐', '🎁'],
    payouts: { '💫💫💫': 1500, '🪐🪐🪐': 2500, '🚀🚀🚀': 300 },
    upgrades: { level: 1, maxLevel: 5 }
  }
};

export class SlotMachineService {
  static getMachines() {
    return MACHINES;
  }

  static getUnlockedMachines(playerLevel) {
    return Object.values(MACHINES).filter(m => m.unlockLevel <= playerLevel);
  }

  static getCurrentMachine() {
    return Storage.load('currentMachine', 'classic');
  }

  static setCurrentMachine(machineId) {
    Storage.save('currentMachine', machineId);
  }

  static getMachineUpgrade(machineId) {
    const upgrades = Storage.load('machineUpgrades', {});
    return upgrades[machineId] || 1;
  }

  static upgradeMachine(machineId, cost) {
    const upgrades = Storage.load('machineUpgrades', {});
    const currentLevel = upgrades[machineId] || 1;
    const machine = MACHINES[machineId];
    
    if (currentLevel >= machine.upgrades.maxLevel) return false;
    
    upgrades[machineId] = currentLevel + 1;
    Storage.save('machineUpgrades', upgrades);
    return true;
  }

  static getUpgradeCost(machineId) {
    const level = this.getMachineUpgrade(machineId);
    return level * 1000;
  }

  static getUpgradeBonus(machineId) {
    const level = this.getMachineUpgrade(machineId);
    return 1 + (level - 1) * 0.2; // 20% per level
  }
}
