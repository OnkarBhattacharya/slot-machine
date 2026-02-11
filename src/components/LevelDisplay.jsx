import React from 'react';
import './LevelDisplay.css';

const LevelDisplay = ({ level, xp, xpForNext }) => {
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
