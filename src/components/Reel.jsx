import React from 'react';
import './Reel.css';

function Reel({ symbol, isSpinning, isWinning }) {
  return (
    <div className={`reel ${isSpinning ? 'spinning' : ''} ${isWinning ? 'winning' : ''}`}>
      <div className="symbol">{symbol}</div>
    </div>
  );
}

export default Reel;
