import { SlotMachineService } from './slotMachineService';

describe('SlotMachineService', () => {
  beforeEach(() => {
    localStorage.clear();
  });

  test('getMachine falls back to default machine for unknown id', () => {
    const machine = SlotMachineService.getMachine('does-not-exist');
    expect(machine.id).toBe('classic');
  });

  test('getUnlockedMachines respects level gating', () => {
    const level1 = SlotMachineService.getUnlockedMachines(1);
    const level20 = SlotMachineService.getUnlockedMachines(20);

    expect(level1.map((m) => m.id)).toEqual(['classic']);
    expect(level20.map((m) => m.id)).toContain('neon');
    expect(level20.length).toBe(Object.keys(SlotMachineService.getMachines()).length);
  });

  test('upgradeMachine stops at max level and persists progress', () => {
    const machineId = 'classic';
    const maxLevel = SlotMachineService.getMachine(machineId).upgrades.maxLevel;

    for (let i = 1; i < maxLevel; i += 1) {
      expect(SlotMachineService.upgradeMachine(machineId)).toBe(true);
    }
    expect(SlotMachineService.upgradeMachine(machineId)).toBe(false);
    expect(SlotMachineService.getMachineUpgrade(machineId)).toBe(maxLevel);
  });

  test('upgrade cost and bonus scale with machine level', () => {
    localStorage.clear();
    expect(SlotMachineService.getUpgradeCost('classic')).toBe(1000);
    SlotMachineService.upgradeMachine('classic');
    expect(SlotMachineService.getUpgradeCost('classic')).toBe(2000);
    expect(SlotMachineService.getUpgradeBonus('classic')).toBeCloseTo(1.2, 5);
  });
});
