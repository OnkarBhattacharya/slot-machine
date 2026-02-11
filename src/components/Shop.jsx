import React from 'react';
import { motion } from 'framer-motion';
import './Shop.css';

const itemTransition = { type: 'spring', stiffness: 380, damping: 20 };

function Shop({ onClose, onPurchase, onSubscribe }) {
  const coinPacks = [
    { id: 'coins_500', amount: 500, price: '$0.99', type: 'coins' },
    { id: 'coins_1500', amount: 1500, price: '$2.99', type: 'coins' },
    { id: 'coins_5000', amount: 5000, price: '$7.99', type: 'coins' },
    { id: 'coins_15000', amount: 15000, price: '$19.99', type: 'coins' }
  ];

  const boosters = [
    { id: 'double_1h', multiplier: 2, duration: 60, price: '$1.99', type: 'booster' },
    { id: 'triple_30m', multiplier: 3, duration: 30, price: '$2.99', type: 'booster' }
  ];

  return (
    <div className="modal-overlay" onClick={onClose}>
      <motion.div
        className="modal-content shop"
        onClick={(e) => e.stopPropagation()}
        initial={{ opacity: 0, y: 18, scale: 0.98 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: 0.24 }}
      >
        <h2>Shop</h2>

        <section>
          <h3>Coin Packs</h3>
          <div className="shop-grid">
            {coinPacks.map((pack) => (
              <motion.div key={pack.id} className="shop-item" whileHover={{ y: -3 }} transition={itemTransition}>
                <div className="item-amount">{pack.amount} Coins</div>
                <div className="item-price">{pack.price}</div>
                <motion.button onClick={() => onPurchase(pack)} whileTap={{ scale: 0.96 }} transition={itemTransition}>
                  Buy
                </motion.button>
              </motion.div>
            ))}
          </div>
        </section>

        <section>
          <h3>Boosters</h3>
          <div className="shop-grid">
            {boosters.map((booster) => (
              <motion.div key={booster.id} className="shop-item" whileHover={{ y: -3 }} transition={itemTransition}>
                <div className="item-amount">
                  {booster.multiplier}x for {booster.duration}min
                </div>
                <div className="item-price">{booster.price}</div>
                <motion.button onClick={() => onPurchase(booster)} whileTap={{ scale: 0.96 }} transition={itemTransition}>
                  Buy
                </motion.button>
              </motion.div>
            ))}
          </div>
        </section>

        <section>
          <h3>VIP Subscription</h3>
          <div className="vip-card">
            <p>Daily bonus coins</p>
            <p>No ads</p>
            <p>Better odds</p>
            <motion.button onClick={() => onSubscribe('vip')} whileTap={{ scale: 0.97 }} transition={itemTransition}>
              Subscribe $4.99/month
            </motion.button>
          </div>
        </section>

        <motion.button className="close-btn" onClick={onClose} whileTap={{ scale: 0.98 }}>
          Close
        </motion.button>
      </motion.div>
    </div>
  );
}

export default Shop;
