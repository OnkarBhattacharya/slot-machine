import React, { useState } from 'react';
import { SlotMachineService } from '../services/slotMachineService';
import './MachineSelector.css';

function MachineSelector({ onClose, currentMachine, playerLevel, coins, onSelect, onUpgrade }) {
  const machines = SlotMachineService.getMachines();
  const unlockedMachines = SlotMachineService.getUnlockedMachines(playerLevel);
  const [selectedMachine, setSelectedMachine] = useState(currentMachine);

  const handleUpgrade = (machineId) => {
    const cost = SlotMachineService.getUpgradeCost(machineId);
    if (coins >= cost) {
      onUpgrade(machineId, cost);
    }
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content machine-selector" onClick={e => e.stopPropagation()}>
        <h2>🎰 Slot Machines</h2>
        <div className="machines-grid">
          {Object.values(machines).map(machine => {
            const isUnlocked = unlockedMachines.some(m => m.id === machine.id);
            const upgradeLevel = SlotMachineService.getMachineUpgrade(machine.id);
            const upgradeCost = SlotMachineService.getUpgradeCost(machine.id);
            const bonus = SlotMachineService.getUpgradeBonus(machine.id);
            const isSelected = selectedMachine === machine.id;

            return (
              <div key={machine.id} className={`machine-card ${isUnlocked ? '' : 'locked'} ${isSelected ? 'selected' : ''}`}>
                <div className="machine-icon">{machine.theme}</div>
                <h3>{machine.name}</h3>
                {isUnlocked ? (
                  <>
                    <div className="machine-level">Level {upgradeLevel}/{machine.upgrades.maxLevel}</div>
                    <div className="machine-bonus">+{Math.round((bonus - 1) * 100)}% Payout</div>
                    <button onClick={() => { setSelectedMachine(machine.id); onSelect(machine.id); }} disabled={isSelected}>
                      {isSelected ? 'Selected' : 'Select'}
                    </button>
                    {upgradeLevel < machine.upgrades.maxLevel && (
                      <button onClick={() => handleUpgrade(machine.id)} disabled={coins < upgradeCost}>
                        Upgrade ({upgradeCost} 💰)
                      </button>
                    )}
                  </>
                ) : (
                  <div className="unlock-req">🔒 Unlock at Level {machine.unlockLevel}</div>
                )}
              </div>
            );
          })}
        </div>
        <button className="close-btn" onClick={onClose}>Close</button>
      </div>
    </div>
  );
}

export default MachineSelector;
