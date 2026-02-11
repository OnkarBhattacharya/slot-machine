import React from 'react';
import './Shop.css';

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
      <div className="modal-content shop" onClick={e => e.stopPropagation()}>
        <h2>🛒 Shop</h2>
        
        <section>
          <h3>💰 Coin Packs</h3>
          <div className="shop-grid">
            {coinPacks.map(pack => (
              <div key={pack.id} className="shop-item">
                <div className="item-amount">{pack.amount} 💰</div>
                <div className="item-price">{pack.price}</div>
                <button onClick={() => onPurchase(pack)}>Buy</button>
              </div>
            ))}
          </div>
        </section>

        <section>
          <h3>⚡ Boosters</h3>
          <div className="shop-grid">
            {boosters.map(booster => (
              <div key={booster.id} className="shop-item">
                <div className="item-amount">{booster.multiplier}x for {booster.duration}min</div>
                <div className="item-price">{booster.price}</div>
                <button onClick={() => onPurchase(booster)}>Buy</button>
              </div>
            ))}
          </div>
        </section>

        <section>
          <h3>👑 VIP Subscription</h3>
          <div className="vip-card">
            <p>✨ Daily bonus coins</p>
            <p>🚫 No ads</p>
            <p>📈 Better odds</p>
            <button onClick={() => onSubscribe('vip')}>Subscribe $4.99/month</button>
          </div>
        </section>

        <button className="close-btn" onClick={onClose}>Close</button>
      </div>
    </div>
  );
}

export default Shop;
