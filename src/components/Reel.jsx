import React from 'react';
import PixiReel from './PixiReel';
import { SYMBOLS } from '../utils/gameConfig';
import './Reel.css';

function Reel({ symbol, isSpinning, isWinning }) {
  const highlight = symbol === SYMBOLS.DIAMOND || symbol === SYMBOLS.WILD;

  return (
    <div className={`reel ${isWinning ? 'winning' : ''}`}>
      <PixiReel symbol={symbol} isSpinning={isSpinning} isWinning={isWinning} highlight={highlight} />
    </div>
  );
}

export default Reel;
