import React from 'react';
import { motion } from 'framer-motion';
import './DailyRewards.css';

const DailyRewards = ({ onClaim, available, streak }) => {
  const reward = Math.min(100 + (streak - 1) * 50, 500);

  return (
    <motion.div
      className="daily-rewards"
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.45, ease: 'easeOut' }}
    >
      <div className="streak">{streak} Day Streak</div>
      <motion.button
        onClick={onClaim}
        disabled={!available}
        className="claim-btn"
        whileHover={available ? { scale: 1.04 } : undefined}
        whileTap={available ? { scale: 0.96 } : undefined}
        transition={{ type: 'spring', stiffness: 420, damping: 18 }}
      >
        {available ? `Claim ${reward} Coins` : 'Come Back Tomorrow'}
      </motion.button>
    </motion.div>
  );
};

export default DailyRewards;
