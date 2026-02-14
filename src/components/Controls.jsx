import React, { useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { BET_LEVELS } from '../utils/gameConfig';
import { useGameStore } from '../store/gameStore';
import './Controls.css';

function Controls({ onSpin, onWatchAd, onPurchase }) {
  const [showShop, setShowShop] = useState(false);
  const coins = useGameStore((state) => state.coins);
  const selectedBet = useGameStore((state) => state.selectedBet);
  const betAmount = BET_LEVELS[selectedBet].amount;
  const isSpinning = useGameStore((state) => state.isSpinning);
  const freeSpins = useGameStore((state) => state.freeSpins);

  const packages = [
    { coins: 500, price: '$0.99' },
    { coins: 1500, price: '$2.99' },
    { coins: 5000, price: '$7.99' },
    { coins: 15000, price: '$19.99' }
  ];

  const spinText = freeSpins > 0 ? 'FREE SPIN' : `SPIN (${betAmount} coins)`;

  return (
    <div className="controls">
      <motion.button
        className="spin-btn"
        onClick={onSpin}
        disabled={(coins < betAmount && freeSpins === 0) || isSpinning}
        whileHover={!isSpinning ? { scale: 1.03 } : undefined}
        whileTap={!isSpinning ? { scale: 0.95 } : undefined}
        transition={{ type: 'spring', stiffness: 500, damping: 16 }}
      >
        {isSpinning ? 'SPINNING...' : spinText}
      </motion.button>

      <div className="actions">
        <motion.button
          className="ad-btn"
          onClick={onWatchAd}
          disabled={isSpinning}
          whileHover={!isSpinning ? { y: -2 } : undefined}
          whileTap={!isSpinning ? { scale: 0.95 } : undefined}
          transition={{ type: 'spring', stiffness: 460, damping: 18 }}
        >
          Watch Ad (+100 coins)
        </motion.button>
        <motion.button
          className="shop-btn"
          onClick={() => setShowShop(!showShop)}
          whileHover={{ y: -2 }}
          whileTap={{ scale: 0.95 }}
          transition={{ type: 'spring', stiffness: 460, damping: 18 }}
        >
          Shop
        </motion.button>
      </div>

      <AnimatePresence>
        {showShop && (
          <motion.div
            className="shop"
            initial={{ opacity: 0, y: 12, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 10, scale: 0.98 }}
            transition={{ duration: 0.22 }}
          >
            <h3>Buy Coins</h3>
            {packages.map((pkg, i) => (
              <motion.button
                key={i}
                onClick={() => onPurchase(pkg.coins)}
                whileHover={{ x: 2 }}
                whileTap={{ scale: 0.98 }}
                transition={{ type: 'spring', stiffness: 360, damping: 20 }}
              >
                {pkg.coins} coins - {pkg.price}
              </motion.button>
            ))}
            <motion.button onClick={() => setShowShop(false)} whileTap={{ scale: 0.98 }}>
              Close
            </motion.button>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

export default Controls;
