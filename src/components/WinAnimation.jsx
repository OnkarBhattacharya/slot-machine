import React, { useEffect, useState } from 'react';
import './WinAnimation.css';

function WinAnimation({ amount, isJackpot, onComplete }) {
  const [particles, setParticles] = useState([]);

  useEffect(() => {
    if (amount > 0) {
      const particleCount = isJackpot ? 50 : Math.min(amount / 10, 30);
      const newParticles = Array.from({ length: particleCount }, (_, i) => ({
        id: i,
        left: Math.random() * 100,
        delay: Math.random() * 0.5
      }));
      setParticles(newParticles);

      const timer = setTimeout(() => {
        onComplete?.();
      }, 2000);

      return () => clearTimeout(timer);
    }
  }, [amount, isJackpot, onComplete]);

  if (amount === 0) return null;

  return (
    <div className={`win-animation ${isJackpot ? 'jackpot' : ''}`}>
      {particles.map(p => (
        <div
          key={p.id}
          className="particle"
          style={{ left: `${p.left}%`, animationDelay: `${p.delay}s` }}
        >
          {isJackpot ? '💎' : '✨'}
        </div>
      ))}
    </div>
  );
}

export default WinAnimation;
