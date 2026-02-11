import React from 'react';
import { BET_LEVELS } from '../utils/gameConfig';
import './BetSelector.css';

function BetSelector({ selectedBet, onBetChange, coins }) {
  return (
    <div className="bet-selector">
      <label>Bet Amount:</label>
      <div className="bet-options">
        {BET_LEVELS.map((bet, i) => (
          <button
            key={i}
            className={`bet-option ${selectedBet === i ? 'active' : ''}`}
            onClick={() => onBetChange(i)}
            disabled={coins < bet.amount}
          >
            <div className="bet-amount">{bet.amount}</div>
            <div className="bet-label">{bet.label}</div>
            <div className="bet-multiplier">{bet.multiplier}x</div>
          </button>
        ))}
      </div>
    </div>
  );
}

export default BetSelector;
