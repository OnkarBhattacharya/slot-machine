import React from 'react';
import { motion } from 'framer-motion';
import { BET_LEVELS } from '../utils/gameConfig';
import { useGameStore } from '../store/gameStore';
import './BetSelector.css';

function BetSelector() {
  const selectedBet = useGameStore((state) => state.selectedBet);
  const onBetChange = useGameStore((state) => state.setSelectedBet);
  const coins = useGameStore((state) => state.coins);

  return (
    <div className="bet-selector">
      <label>Bet Amount:</label>
      <div className="bet-options">
        {BET_LEVELS.map((bet, i) => {
          const disabled = coins < bet.amount;
          const active = selectedBet === i;

          return (
            <motion.button
              key={i}
              className={`bet-option ${active ? 'active' : ''}`}
              onClick={() => onBetChange(i)}
              disabled={disabled}
              whileHover={!disabled ? { y: -3, scale: 1.02 } : undefined}
              whileTap={!disabled ? { scale: 0.97 } : undefined}
              transition={{ type: 'spring', stiffness: 460, damping: 18 }}
            >
              <div className="bet-amount">{bet.amount}</div>
              <div className="bet-label">{bet.label}</div>
              <div className="bet-multiplier">{bet.multiplier}x</div>
            </motion.button>
          );
        })}
      </div>
    </div>
  );
}

export default BetSelector;
