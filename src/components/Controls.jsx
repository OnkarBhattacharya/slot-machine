import React, { useState } from 'react';
import './Controls.css';

function Controls({ coins, betAmount, isSpinning, onSpin, onWatchAd, onPurchase, freeSpins }) {
  const [showShop, setShowShop] = useState(false);

  const packages = [
    { coins: 500, price: '$0.99' },
    { coins: 1500, price: '$2.99' },
    { coins: 5000, price: '$7.99' },
    { coins: 15000, price: '$19.99' }
  ];

  const spinText = freeSpins > 0 ? 'FREE SPIN' : `SPIN (${betAmount} coins)`;

  return (
    <div className="controls">
      <button 
        className="spin-btn" 
        onClick={onSpin}
        disabled={(coins < betAmount && freeSpins === 0) || isSpinning}
      >
        {isSpinning ? 'SPINNING...' : spinText}
      </button>
      
      <div className="actions">
        <button className="ad-btn" onClick={onWatchAd} disabled={isSpinning}>
          📺 Watch Ad (+100 coins)
        </button>
        <button className="shop-btn" onClick={() => setShowShop(!showShop)}>
          🛒 Shop
        </button>
      </div>

      {showShop && (
        <div className="shop">
          <h3>Buy Coins</h3>
          {packages.map((pkg, i) => (
            <button key={i} onClick={() => onPurchase(pkg.coins)}>
              {pkg.coins} coins - {pkg.price}
            </button>
          ))}
          <button onClick={() => setShowShop(false)}>Close</button>
        </div>
      )}
    </div>
  );
}

export default Controls;
