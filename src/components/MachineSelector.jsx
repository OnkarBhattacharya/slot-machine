import React, { useState } from 'react';
import { SlotMachineService } from '../services/slotMachineService';
import { useGameStore } from '../store/gameStore';
import './MachineSelector.css';

function MachineSelector({ onClose, onSelect, onUpgrade }) {
  const currentMachine = useGameStore((state) => state.currentMachine);
  const playerLevel = useGameStore((state) => state.level);
  const coins = useGameStore((state) => state.coins);
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
      <div className="modal-content machine-selector" onClick={(event) => event.stopPropagation()}>
        <h2>Game Options</h2>
        <p className="machine-selector-subtitle">
          Choose a machine with its own win profile, volatility, and free-spin behavior.
        </p>
        <div className="machines-grid">
          {Object.values(machines).map((machine) => {
            const isUnlocked = unlockedMachines.some((item) => item.id === machine.id);
            const upgradeLevel = SlotMachineService.getMachineUpgrade(machine.id);
            const upgradeCost = SlotMachineService.getUpgradeCost(machine.id);
            const bonus = SlotMachineService.getUpgradeBonus(machine.id);
            const isSelected = selectedMachine === machine.id;

            return (
              <div key={machine.id} className={`machine-card ${isUnlocked ? '' : 'locked'} ${isSelected ? 'selected' : ''}`}>
                <div className="machine-top">
                  <div className="machine-icon">{machine.theme}</div>
                  <div className="machine-status">{isUnlocked ? 'Unlocked' : `Level ${machine.unlockLevel}`}</div>
                </div>
                <h3>{machine.name}</h3>
                <p className="machine-description">{machine.description}</p>
                {isUnlocked ? (
                  <>
                    <div className="machine-tags">
                      <span>{machine.volatility}</span>
                      <span>{machine.baseRtp}% RTP</span>
                      <span>{machine.freeSpinsAmount} FS</span>
                    </div>
                    <div className="machine-level">Level {upgradeLevel}/{machine.upgrades.maxLevel}</div>
                    <div className="machine-bonus">+{Math.round((bonus - 1) * 100)}% Payout</div>
                    <button className="play-btn" onClick={() => { setSelectedMachine(machine.id); onSelect(machine.id); }} disabled={isSelected}>
                      {isSelected ? 'Active' : 'Play'}
                    </button>
                    {upgradeLevel < machine.upgrades.maxLevel && (
                      <button className="upgrade-btn" onClick={() => handleUpgrade(machine.id)} disabled={coins < upgradeCost}>
                        Upgrade ({upgradeCost} coins)
                      </button>
                    )}
                  </>
                ) : (
                  <div className="unlock-req">Unlock at Level {machine.unlockLevel}</div>
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
