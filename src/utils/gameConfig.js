export const SYMBOLS = {
  CHERRY: '🍒',
  LEMON: '🍋',
  ORANGE: '🍊',
  GRAPE: '🍇',
  SEVEN: '7️⃣',
  DIAMOND: '💎',
  WILD: '⭐',
  SCATTER: '🎁'
};

export const BET_LEVELS = [
  { amount: 10, multiplier: 1, label: 'Low' },
  { amount: 25, multiplier: 1.2, label: 'Medium' },
  { amount: 50, multiplier: 1.5, label: 'High' },
  { amount: 100, multiplier: 2, label: 'VIP' }
];

export const PAYOUTS = {
  [`${SYMBOLS.DIAMOND}${SYMBOLS.DIAMOND}${SYMBOLS.DIAMOND}`]: 500,
  [`${SYMBOLS.SEVEN}${SYMBOLS.SEVEN}${SYMBOLS.SEVEN}`]: 1000,
  [`${SYMBOLS.CHERRY}${SYMBOLS.CHERRY}${SYMBOLS.CHERRY}`]: 100,
  [`${SYMBOLS.LEMON}${SYMBOLS.LEMON}${SYMBOLS.LEMON}`]: 80,
  [`${SYMBOLS.ORANGE}${SYMBOLS.ORANGE}${SYMBOLS.ORANGE}`]: 80,
  [`${SYMBOLS.GRAPE}${SYMBOLS.GRAPE}${SYMBOLS.GRAPE}`]: 80,
  [`${SYMBOLS.SCATTER}${SYMBOLS.SCATTER}${SYMBOLS.SCATTER}`]: 0 // Triggers free spins
};

export const JACKPOT_COMBO = `${SYMBOLS.SEVEN}${SYMBOLS.SEVEN}${SYMBOLS.SEVEN}`;
export const JACKPOT_CONTRIBUTION = 0.01; // 1% of each bet
export const FREE_SPIN_COMBO = `${SYMBOLS.SCATTER}${SYMBOLS.SCATTER}${SYMBOLS.SCATTER}`;
export const FREE_SPINS_AMOUNT = 10;

export const MULTIPLIERS = [1, 2, 3, 5];

export const SYMBOL_WEIGHTS = {
  [SYMBOLS.CHERRY]: 25,
  [SYMBOLS.LEMON]: 20,
  [SYMBOLS.ORANGE]: 20,
  [SYMBOLS.GRAPE]: 20,
  [SYMBOLS.SEVEN]: 8,
  [SYMBOLS.DIAMOND]: 5,
  [SYMBOLS.WILD]: 1,
  [SYMBOLS.SCATTER]: 1
};
