import React, { useEffect, useState } from 'react';
import ConfettiExplosion from 'react-confetti-explosion';
import './WinAnimation.css';

function WinAnimation({ amount, isJackpot, onComplete }) {
  const [isExploding, setIsExploding] = useState(false);

  useEffect(() => {
    if (amount <= 0) return undefined;

    setIsExploding(true);
    const timer = setTimeout(() => {
      setIsExploding(false);
      onComplete?.();
    }, isJackpot ? 2300 : 1800);

    return () => clearTimeout(timer);
  }, [amount, isJackpot, onComplete]);

  if (amount === 0 || !isExploding) return null;

  return (
    <div className={`win-animation ${isJackpot ? 'jackpot' : ''}`}>
      <div className="confetti-burst center">
        <ConfettiExplosion
          force={isJackpot ? 0.95 : 0.62}
          duration={isJackpot ? 2200 : 1500}
          particleCount={isJackpot ? 220 : 140}
          width={1700}
          zIndex={1000}
        />
      </div>
      {isJackpot && (
        <div className="confetti-burst side">
          <ConfettiExplosion force={0.68} duration={2100} particleCount={120} width={1200} zIndex={1000} />
        </div>
      )}
      <div className="win-pill">+{amount}</div>
    </div>
  );
}

export default WinAnimation;
