import {
  SYMBOLS,
  PAYOUTS,
  SYMBOL_WEIGHTS,
  JACKPOT_COMBO,
  FREE_SPIN_COMBO,
  buildComboKey,
  getMachineGameConfig
} from './gameConfig';

export const getWeightedRandomSymbol = (weights = SYMBOL_WEIGHTS) => {
  const totalWeight = Object.values(weights).reduce((a, b) => a + b, 0);
  let random = Math.random() * totalWeight;

  for (const [symbol, weight] of Object.entries(weights)) {
    random -= weight;
    if (random <= 0) return symbol;
  }
  return SYMBOLS.CHERRY;
};

export const calculateWin = (reels, betMultiplier, activeMultiplier = 1, machineConfig = null) => {
  const resolvedConfig =
    machineConfig || getMachineGameConfig();
  const payouts = resolvedConfig.payouts || PAYOUTS;
  const jackpotCombo = resolvedConfig.jackpotCombo || JACKPOT_COMBO;
  const freeSpinCombo = resolvedConfig.freeSpinCombo || FREE_SPIN_COMBO;
  const hasWild = reels.includes(SYMBOLS.WILD);

  const combo = buildComboKey(reels);
  if (Object.prototype.hasOwnProperty.call(payouts, combo)) {
    return {
      payout: Math.floor(payouts[combo] * betMultiplier * activeMultiplier),
      isJackpot: combo === jackpotCombo,
      isFreeSpins: combo === freeSpinCombo,
      combo
    };
  }

  if (hasWild) {
    const nonWildSymbols = reels.filter((s) => s !== SYMBOLS.WILD);
    if (nonWildSymbols.length === 0) {
      return { payout: Math.floor(1000 * betMultiplier * activeMultiplier), isJackpot: false, isFreeSpins: false };
    }

    const firstSymbol = nonWildSymbols[0];
    const allMatch = nonWildSymbols.every((s) => s === firstSymbol);

    if (allMatch) {
      const wildCombo = buildComboKey([firstSymbol, firstSymbol, firstSymbol]);
      const basePayout = payouts[wildCombo] || 50;
      return {
        payout: Math.floor(basePayout * betMultiplier * activeMultiplier),
        isJackpot: false,
        isFreeSpins: false,
        combo: wildCombo
      };
    }
  }

  return { payout: 0, isJackpot: false, isFreeSpins: false };
};

export const getRandomMultiplier = (chance = 0.1, multipliers = [2, 3, 5]) => {
  if (Math.random() < chance) {
    return multipliers[Math.floor(Math.random() * multipliers.length)];
  }
  return 1;
};
