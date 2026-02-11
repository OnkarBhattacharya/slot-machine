import React from 'react';
import './DailyRewards.css';

const DailyRewards = ({ onClaim, available, streak }) => {
  const reward = Math.min(100 + (streak - 1) * 50, 500);

  return (
    <div className="daily-rewards">
      <div className="streak">🔥 {streak} Day Streak</div>
      <button 
        onClick={onClaim} 
        disabled={!available}
        className="claim-btn"
      >
        {available ? `Claim ${reward} Coins` : 'Come Back Tomorrow'}
      </button>
    </div>
  );
};

export default DailyRewards;
