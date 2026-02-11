import React, { useState } from 'react';
import './Help.css';

const FAQ_ITEMS = [
  {
    q: 'How do I win?',
    a: 'Match 3 identical symbols on the reels. Higher bets increase your potential winnings!'
  },
  {
    q: 'What are free spins?',
    a: 'Match 3 scatter symbols (🎁) to win free spins. Free spins don\'t cost coins!'
  },
  {
    q: 'How do I get more coins?',
    a: 'Claim daily rewards, watch ads, complete achievements, or purchase coin packs in the shop.'
  },
  {
    q: 'What is the jackpot?',
    a: 'Match 3 seven symbols (7️⃣7️⃣7️⃣) to win the progressive jackpot!'
  },
  {
    q: 'How do achievements work?',
    a: 'Complete specific tasks to unlock badges and earn bonus coins. Check the achievements menu to see your progress.'
  },
  {
    q: 'What are tournaments?',
    a: 'Compete against other players for prizes. Pay an entry fee and try to score the highest within the time limit.'
  },
  {
    q: 'How do I change themes?',
    a: 'Open Settings (⚙️) and select your preferred theme from the Theme section.'
  },
  {
    q: 'Can I play offline?',
    a: 'Yes! Your progress is saved locally. Some features like leaderboards require internet connection.'
  }
];

function Help({ onClose }) {
  const [expanded, setExpanded] = useState(null);

  const toggleItem = (index) => {
    setExpanded(expanded === index ? null : index);
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="help-modal" onClick={(e) => e.stopPropagation()}>
        <button className="close-btn" onClick={onClose}>✕</button>
        <h2>❓ Help & FAQ</h2>
        
        <div className="faq-list">
          {FAQ_ITEMS.map((item, index) => (
            <div key={index} className={`faq-item ${expanded === index ? 'expanded' : ''}`}>
              <button className="faq-question" onClick={() => toggleItem(index)}>
                <span>{item.q}</span>
                <span className="faq-icon">{expanded === index ? '−' : '+'}</span>
              </button>
              {expanded === index && (
                <div className="faq-answer">{item.a}</div>
              )}
            </div>
          ))}
        </div>

        <div className="help-section">
          <h3>🎮 Game Controls</h3>
          <ul>
            <li><strong>Spin Button:</strong> Start the slot machine</li>
            <li><strong>Bet Selector:</strong> Choose your bet amount</li>
            <li><strong>Watch Ad:</strong> Get 100 free coins</li>
            <li><strong>Menu Buttons:</strong> Access shop, achievements, and more</li>
          </ul>
        </div>

        <div className="help-section">
          <h3>💡 Tips</h3>
          <ul>
            <li>Log in daily to build your reward streak</li>
            <li>Complete achievements for bonus coins</li>
            <li>Higher bets have better odds and multipliers</li>
            <li>Join a guild to earn group rewards</li>
          </ul>
        </div>
      </div>
    </div>
  );
}

export default Help;
