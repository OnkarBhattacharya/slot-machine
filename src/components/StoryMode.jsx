import React, { useState, useEffect } from 'react';
import { StoryModeService } from '../services/storyModeService';
import './StoryMode.css';

function StoryMode({ onClose, onBattleSpin, coins }) {
  const [levels, setLevels] = useState([]);
  const [selectedLevel, setSelectedLevel] = useState(null);
  const [inBattle, setInBattle] = useState(false);

  useEffect(() => {
    setLevels(StoryModeService.getLevels());
  }, []);

  const startBattle = (level) => {
    if (StoryModeService.isLevelUnlocked(level.id)) {
      setSelectedLevel(level);
      setInBattle(true);
    }
  };

  const handleBattleSpin = (damage) => {
    const progress = StoryModeService.damageBoss(selectedLevel.id, damage);
    
    if (progress.completed) {
      const reward = StoryModeService.getReward(selectedLevel.id);
      alert(`Boss defeated! You earned ${reward} coins!`);
      setInBattle(false);
      setSelectedLevel(null);
      setLevels(StoryModeService.getLevels());
    }
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content story-mode" onClick={e => e.stopPropagation()}>
        <h2>📖 Story Mode</h2>
        
        {!inBattle ? (
          <div className="levels-list">
            {levels.map(level => {
              const isUnlocked = StoryModeService.isLevelUnlocked(level.id);
              const progress = StoryModeService.getLevelProgress(level.id);
              
              return (
                <div key={level.id} className={`level-card ${isUnlocked ? '' : 'locked'} ${progress.completed ? 'completed' : ''}`}>
                  <h3>Level {level.id}: {level.name}</h3>
                  <div className="boss-info">
                    <div className="boss-name">👹 {level.boss}</div>
                    <div className="boss-hp">
                      HP: {progress.bossHP}/{level.bossHP}
                    </div>
                    <div className="hp-bar">
                      <div className="hp-fill" style={{ width: `${(progress.bossHP / level.bossHP) * 100}%` }}></div>
                    </div>
                  </div>
                  <div className="level-reward">Reward: {level.reward} 💰</div>
                  {level.unlockMachine && <div className="unlock-bonus">Unlocks: {level.unlockMachine} machine</div>}
                  {isUnlocked && !progress.completed && (
                    <button onClick={() => startBattle(level)}>Battle</button>
                  )}
                  {progress.completed && <div className="completed-badge">✅ Completed</div>}
                  {!isUnlocked && <div className="locked-badge">🔒 Complete previous level</div>}
                </div>
              );
            })}
          </div>
        ) : (
          <div className="battle-screen">
            <h3>⚔️ Battle: {selectedLevel.name}</h3>
            <div className="boss-battle">
              <div className="boss-avatar">👹</div>
              <div className="boss-name">{selectedLevel.boss}</div>
              <div className="boss-hp">
                HP: {StoryModeService.getLevelProgress(selectedLevel.id).bossHP}/{selectedLevel.bossHP}
              </div>
              <div className="hp-bar large">
                <div className="hp-fill" style={{ 
                  width: `${(StoryModeService.getLevelProgress(selectedLevel.id).bossHP / selectedLevel.bossHP) * 100}%` 
                }}></div>
              </div>
            </div>
            <p className="battle-info">Each winning spin deals damage to the boss!</p>
            <button onClick={() => { onBattleSpin(handleBattleSpin); }}>Spin to Attack</button>
            <button onClick={() => setInBattle(false)}>Retreat</button>
          </div>
        )}

        <button className="close-btn" onClick={onClose}>Close</button>
      </div>
    </div>
  );
}

export default StoryMode;
