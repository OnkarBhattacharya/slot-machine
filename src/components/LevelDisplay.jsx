import React from 'react';
import { LevelService } from '../services/levelService';
import { useGameStore } from '../store/gameStore';
import './LevelDisplay.css';

const LevelDisplay = () => {
  const level = useGameStore((state) => state.level);
  const xp = useGameStore((state) => state.xp);
  const xpForNext = LevelService.xpForLevel(level);
  const progress = (xp / xpForNext) * 100;

  return (
    <div className="level-display">
      <div className="level-badge">⭐ Lv {level}</div>
      <div className="xp-bar">
        <div className="xp-fill" style={{ width: `${progress}%` }}></div>
        <span className="xp-text">{xp} / {xpForNext} XP</span>
      </div>
    </div>
  );
};

export default LevelDisplay;
