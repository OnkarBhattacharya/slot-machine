import React, { useEffect, useState } from 'react';
import Reel from './Reel';
import WinAnimation from './WinAnimation';
import { getWeightedRandomSymbol, calculateWin, getRandomMultiplier } from '../utils/gameLogic';
import { FREE_SPINS_AMOUNT, SYMBOLS, getSymbolLabel } from '../utils/gameConfig';
import { SoundService } from '../utils/soundService';
import { NearMissService } from '../utils/nearMissService';
import { HapticsService } from '../services/hapticsService';
import { SlotMachineService } from '../services/slotMachineService';
import './SlotMachine.css';

function SlotMachine({ isSpinning, onComplete, betMultiplier, jackpot, freeSpins, onFreeSpinsWon, currentMachine }) {
  const [reels, setReels] = useState([SYMBOLS.CHERRY, SYMBOLS.CHERRY, SYMBOLS.CHERRY]);
  const [result, setResult] = useState('');
  const [multiplier, setMultiplier] = useState(1);
  const [showWinAnimation, setShowWinAnimation] = useState(false);
  const [lastWin, setLastWin] = useState({ amount: 0, isJackpot: false });
  const [isWinning, setIsWinning] = useState(false);
  const [nearMissData, setNearMissData] = useState(null);
  const [isShaking, setIsShaking] = useState(false);
  const machineMeta = SlotMachineService.getMachine(currentMachine);
  const machineConfig = SlotMachineService.getMachineConfig(currentMachine);
  const machineUpgradeBonus = SlotMachineService.getUpgradeBonus(currentMachine);

  useEffect(() => {
    if (!isSpinning) return;

    setResult('');
    setShowWinAnimation(false);
    setIsWinning(false);
    setNearMissData(null);
    setIsShaking(false);
    SoundService.playSpin();

    const newMultiplier = getRandomMultiplier(machineConfig.multiplierChance, machineConfig.multipliers);
    setMultiplier(newMultiplier);

    const duration = 2000;
    const interval = setInterval(() => {
      setReels([
        getWeightedRandomSymbol(machineConfig.symbolWeights),
        getWeightedRandomSymbol(machineConfig.symbolWeights),
        getWeightedRandomSymbol(machineConfig.symbolWeights)
      ]);
    }, 90);

    const endTimer = setTimeout(async () => {
      clearInterval(interval);
      const final = [
        getWeightedRandomSymbol(machineConfig.symbolWeights),
        getWeightedRandomSymbol(machineConfig.symbolWeights),
        getWeightedRandomSymbol(machineConfig.symbolWeights)
      ];
      setReels(final);
      await HapticsService.reelStop();

      const winResult = calculateWin(
        final,
        betMultiplier * machineUpgradeBonus,
        newMultiplier,
        machineConfig
      );

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
        const freeSpinsAmount = machineConfig.freeSpinsAmount || FREE_SPINS_AMOUNT;
        setResult(`${freeSpinsAmount} FREE SPINS unlocked`);
        SoundService.playWin();
        await HapticsService.impact();
        onFreeSpinsWon?.(freeSpinsAmount);
        onComplete({ payout: 0, isJackpot: false, jackpotWin: 0 });
      } else if (winResult.isJackpot) {
        const totalWin = winResult.payout + jackpot;
        setResult(`JACKPOT ${totalWin} COINS`);
        setLastWin({ amount: totalWin, isJackpot: true });
        setShowWinAnimation(true);
        setIsWinning(true);
        SoundService.playJackpot();
        await HapticsService.bigWin();
        onComplete({ payout: winResult.payout, isJackpot: true, jackpotWin: jackpot });
      } else if (winResult.payout > 0) {
        const multiplierText = newMultiplier > 1 ? ` (${newMultiplier}x)` : '';
        setResult(`WIN ${winResult.payout} COINS${multiplierText}`);
        setLastWin({ amount: winResult.payout, isJackpot: false });
        setShowWinAnimation(true);
        setIsWinning(true);
        SoundService.playWin();
        await HapticsService.impact();
        onComplete({ payout: winResult.payout, isJackpot: false, jackpotWin: 0 });
      } else {
        const labels = final.map((s) => getSymbolLabel(s));
        setResult(`No win (${labels.join(' / ')})`);
        onComplete({ payout: 0, isJackpot: false, jackpotWin: 0 });
      }
    }, duration);

    return () => {
      clearInterval(interval);
      clearTimeout(endTimer);
    };
  }, [
    isSpinning,
    onComplete,
    betMultiplier,
    jackpot,
    onFreeSpinsWon,
    machineConfig,
    machineUpgradeBonus
  ]);

  return (
    <div
      className={`slot-machine ${isShaking ? 'shaking' : ''} ${nearMissData ? 'near-miss-glow' : ''}`}
      style={nearMissData ? { '--glow-color': NearMissService.getAnimationConfig(nearMissData)?.color || '#ffd700' } : undefined}
    >
      <div className="machine-strip">
        <div className="machine-strip-title">{machineMeta.name}</div>
        <div className="machine-strip-meta">
          <span>{machineMeta.volatility} Volatility</span>
          <span>{machineMeta.baseRtp}% RTP</span>
          <span>{Math.round((machineUpgradeBonus - 1) * 100)}% Upgrade Bonus</span>
        </div>
      </div>
      {freeSpins > 0 && <div className="free-spins-badge">{freeSpins} Free Spins</div>}
      {multiplier > 1 && isSpinning && <div className="multiplier-badge">{multiplier}x Multiplier</div>}
      <div className={`reels ${isWinning ? 'winning' : ''}`}>
        {reels.map((symbol, i) => (
          <Reel key={i} symbol={symbol} isSpinning={isSpinning} isWinning={isWinning} />
        ))}
      </div>
      {result && <div className="result">{result}</div>}
      {showWinAnimation && (
        <WinAnimation amount={lastWin.amount} isJackpot={lastWin.isJackpot} onComplete={() => setShowWinAnimation(false)} />
      )}
    </div>
  );
}

export default SlotMachine;
