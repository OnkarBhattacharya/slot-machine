import React from 'react';
import { ACHIEVEMENTS } from '../services/achievementService';
import './Achievements.css';

const Achievements = ({ unlocked, onClose }) => {
  return (
    <div className="achievements-modal">
      <div className="achievements-content">
        <h2>🏆 Achievements</h2>
        <div className="achievements-grid">
          {Object.values(ACHIEVEMENTS).map(ach => {
            const isUnlocked = unlocked.includes(ach.id);
            return (
              <div key={ach.id} className={`achievement ${isUnlocked ? 'unlocked' : 'locked'}`}>
                <div className="ach-icon">{ach.icon}</div>
                <div className="ach-name">{ach.name}</div>
                <div className="ach-desc">{ach.desc}</div>
                <div className="ach-reward">+{ach.reward} coins</div>
              </div>
            );
          })}
        </div>
        <button onClick={onClose} className="close-btn">Close</button>
      </div>
    </div>
  );
};

export default Achievements;
