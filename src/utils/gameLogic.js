import { SYMBOLS, PAYOUTS, SYMBOL_WEIGHTS, JACKPOT_COMBO, FREE_SPIN_COMBO, buildComboKey } from './gameConfig';

export const getWeightedRandomSymbol = () => {
  const totalWeight = Object.values(SYMBOL_WEIGHTS).reduce((a, b) => a + b, 0);
  let random = Math.random() * totalWeight;

  for (const [symbol, weight] of Object.entries(SYMBOL_WEIGHTS)) {
    random -= weight;
    if (random <= 0) return symbol;
  }
  return SYMBOLS.CHERRY;
};

export const calculateWin = (reels, betMultiplier, activeMultiplier = 1) => {
  const hasWild = reels.includes(SYMBOLS.WILD);

  const combo = buildComboKey(reels);
  if (Object.prototype.hasOwnProperty.call(PAYOUTS, combo)) {
    return {
      payout: Math.floor(PAYOUTS[combo] * betMultiplier * activeMultiplier),
      isJackpot: combo === JACKPOT_COMBO,
      isFreeSpins: combo === FREE_SPIN_COMBO,
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
      const basePayout = PAYOUTS[wildCombo] || 50;
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

export const getRandomMultiplier = (chance = 0.1) => {
  if (Math.random() < chance) {
    const multipliers = [2, 3, 5];
    return multipliers[Math.floor(Math.random() * multipliers.length)];
  }
  return 1;
};
