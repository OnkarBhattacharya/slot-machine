import { Storage } from '../utils/storage';
import { DEFAULT_MACHINE_ID, MACHINE_GAME_CONFIGS, getMachineGameConfig } from '../utils/gameConfig';

const MACHINE_PRESENTATION = {
  classic: {
    theme: 'Classic',
    description: 'Balanced base game with frequent medium wins.'
  },
  egyptian: {
    theme: 'Ancient',
    description: 'Higher volatility with stronger top-end combinations.'
  },
  ocean: {
    theme: 'Oceanic',
    description: 'Frequent hits and longer free-spin chains.'
  },
  space: {
    theme: 'Cosmic',
    description: 'Big-variance mode with rare but heavy payouts.'
  },
  neon: {
    theme: 'Neon',
    description: 'Fast paced mode with boosted multiplier chances.'
  }
};

const MACHINES = Object.keys(MACHINE_GAME_CONFIGS).reduce((acc, machineId) => {
  const config = MACHINE_GAME_CONFIGS[machineId];
  const present = MACHINE_PRESENTATION[machineId] || {};

  acc[machineId] = {
    id: config.id,
    name: config.name,
    theme: present.theme || 'Arcade',
    description: present.description || 'Slot game variation.',
    unlockLevel: config.unlockLevel,
    volatility: config.volatility,
    baseRtp: config.baseRtp,
    freeSpinsAmount: config.freeSpinsAmount,
    upgrades: { maxLevel: 5 }
  };

  return acc;
}, {});

export class SlotMachineService {
  static getMachines() {
    return MACHINES;
  }

  static getUnlockedMachines(playerLevel) {
    return Object.values(MACHINES).filter((machine) => machine.unlockLevel <= playerLevel);
  }

  static getMachine(machineId) {
    return MACHINES[machineId] || MACHINES[DEFAULT_MACHINE_ID];
  }

  static getMachineConfig(machineId) {
    return getMachineGameConfig(machineId);
  }

  static getCurrentMachine() {
    const storedMachine = Storage.load('currentMachine', DEFAULT_MACHINE_ID);
    return MACHINES[storedMachine] ? storedMachine : DEFAULT_MACHINE_ID;
  }

  static setCurrentMachine(machineId) {
    if (!MACHINES[machineId]) return;
    Storage.save('currentMachine', machineId);
  }

  static getMachineUpgrade(machineId) {
    const upgrades = Storage.load('machineUpgrades', {});
    return upgrades[machineId] || 1;
  }

  static upgradeMachine(machineId) {
    const upgrades = Storage.load('machineUpgrades', {});
    const currentLevel = upgrades[machineId] || 1;
    const machine = MACHINES[machineId];

    if (!machine || currentLevel >= machine.upgrades.maxLevel) return false;

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
    return 1 + (level - 1) * 0.2;
  }
}
