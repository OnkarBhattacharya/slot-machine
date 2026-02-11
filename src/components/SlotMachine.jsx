import React, { useState, useEffect } from 'react';
import Reel from './Reel';
import WinAnimation from './WinAnimation';
import { getWeightedRandomSymbol, calculateWin, getRandomMultiplier } from '../utils/gameLogic';
import { FREE_SPINS_AMOUNT, SYMBOLS } from '../utils/gameConfig';
import { SoundService } from '../utils/soundService';
import { NearMissService } from '../utils/nearMissService';
import './SlotMachine.css';

function SlotMachine({ isSpinning, onComplete, betMultiplier, jackpot, freeSpins, onFreeSpinsWon }) {
  const [reels, setReels] = useState([SYMBOLS.CHERRY, SYMBOLS.CHERRY, SYMBOLS.CHERRY]);
  const [result, setResult] = useState('');
  const [multiplier, setMultiplier] = useState(1);
  const [showWinAnimation, setShowWinAnimation] = useState(false);
  const [lastWin, setLastWin] = useState({ amount: 0, isJackpot: false });
  const [isWinning, setIsWinning] = useState(false);
  const [nearMissData, setNearMissData] = useState(null);
  const [isShaking, setIsShaking] = useState(false);

  useEffect(() => {
    if (isSpinning) {
      setResult('');
      setShowWinAnimation(false);
      setIsWinning(false);
      setNearMissData(null);
      setIsShaking(false);
      SoundService.playSpin();
      const newMultiplier = getRandomMultiplier(0.15);
      setMultiplier(newMultiplier);
      
      const duration = 2000;
      const interval = setInterval(() => {
        setReels([getWeightedRandomSymbol(), getWeightedRandomSymbol(), getWeightedRandomSymbol()]);
      }, 100);

      setTimeout(() => {
        clearInterval(interval);
        const final = [getWeightedRandomSymbol(), getWeightedRandomSymbol(), getWeightedRandomSymbol()];
        setReels(final);
        
        const winResult = calculateWin(final, betMultiplier, newMultiplier);

        if (winResult.payout === 0 && !winResult.isFreeSpins) {
          const nearMiss = NearMissService.detectNearMiss(final);

          if (nearMiss.isNearMiss) {
            setNearMissData(nearMiss);
            setResult(nearMiss.message);
            NearMissService.trackNearMiss(nearMiss);

            const animConfig = NearMissService.getAnimationConfig(nearMiss);
            if (animConfig?.shake) {
              setIsShaking(true);
              setTimeout(() => setIsShaking(false), animConfig.duration);
            }
            if (animConfig?.vibration) {
              SoundService.vibrate(animConfig.vibration);
            }

            onComplete({ payout: 0, isJackpot: false, jackpotWin: 0 });
            return;
          }
        }
        
        if (winResult.isFreeSpins) {
          setResult(`🎁 ${FREE_SPINS_AMOUNT} FREE SPINS! 🎁`);
          SoundService.playWin();
          SoundService.vibrate([100, 50, 100]);
          onFreeSpinsWon?.(FREE_SPINS_AMOUNT);
          onComplete({ payout: 0, isJackpot: false, jackpotWin: 0 });
        } else if (winResult.isJackpot) {
          const totalWin = winResult.payout + jackpot;
          setResult(`💎 JACKPOT! ${totalWin} COINS! 💎`);
          setLastWin({ amount: totalWin, isJackpot: true });
          setShowWinAnimation(true);
          setIsWinning(true);
          SoundService.playJackpot();
          SoundService.vibrate([200, 100, 200, 100, 200]);
          onComplete({ payout: winResult.payout, isJackpot: true, jackpotWin: jackpot });
        } else if (winResult.payout > 0) {
          const multiplierText = newMultiplier > 1 ? ` (${newMultiplier}x)` : '';
          setResult(`🎉 WIN ${winResult.payout} COINS!${multiplierText} 🎉`);
          setLastWin({ amount: winResult.payout, isJackpot: false });
          setShowWinAnimation(true);
          setIsWinning(true);
          SoundService.playWin();
          SoundService.vibrate([100]);
          onComplete({ payout: winResult.payout, isJackpot: false, jackpotWin: 0 });
        } else {
          setResult('Try Again!');
          onComplete({ payout: 0, isJackpot: false, jackpotWin: 0 });
        }
      }, duration);
    }
  }, [isSpinning, onComplete, betMultiplier, jackpot, onFreeSpinsWon]);

  return (
    <div
      className={`slot-machine ${isShaking ? 'shaking' : ''} ${nearMissData ? 'near-miss-glow' : ''}`}
      style={nearMissData ? { '--glow-color': NearMissService.getAnimationConfig(nearMissData)?.color || '#ffd700' } : undefined}
    >
      {freeSpins > 0 && <div className="free-spins-badge">🎁 {freeSpins} Free Spins</div>}
      {multiplier > 1 && isSpinning && <div className="multiplier-badge">{multiplier}x Multiplier!</div>}
      <div className={`reels ${isWinning ? 'winning' : ''}`}>
        {reels.map((symbol, i) => (
          <Reel key={i} symbol={symbol} isSpinning={isSpinning} isWinning={isWinning} />
        ))}
      </div>
      {result && <div className="result">{result}</div>}
      {showWinAnimation && (
        <WinAnimation 
          amount={lastWin.amount} 
          isJackpot={lastWin.isJackpot}
          onComplete={() => setShowWinAnimation(false)}
        />
      )}
    </div>
  );
}

export default SlotMachine;
