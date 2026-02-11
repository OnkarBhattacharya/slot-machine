export const SYMBOLS = {
  CHERRY: 'cherry',
  LEMON: 'lemon',
  ORANGE: 'orange',
  GRAPE: 'grape',
  SEVEN: 'seven',
  DIAMOND: 'diamond',
  WILD: 'wild',
  SCATTER: 'scatter'
};

export const SYMBOL_DATA = {
  [SYMBOLS.CHERRY]: {
    label: 'Cherry',
    asset: '/assets/symbols/cherry.svg'
  },
  [SYMBOLS.LEMON]: {
    label: 'Lemon',
    asset: '/assets/symbols/lemon.svg'
  },
  [SYMBOLS.ORANGE]: {
    label: 'Orange',
    asset: '/assets/symbols/orange.svg'
  },
  [SYMBOLS.GRAPE]: {
    label: 'Grape',
    asset: '/assets/symbols/grape.svg'
  },
  [SYMBOLS.SEVEN]: {
    label: 'Lucky Seven',
    asset: '/assets/symbols/seven.svg'
  },
  [SYMBOLS.DIAMOND]: {
    label: 'Diamond',
    asset: '/assets/symbols/diamond.svg'
  },
  [SYMBOLS.WILD]: {
    label: 'Wild Star',
    asset: '/assets/symbols/wild.svg'
  },
  [SYMBOLS.SCATTER]: {
    label: 'Gift Scatter',
    asset: '/assets/symbols/scatter.svg'
  }
};

const comboKey = (...symbols) => symbols.join('|');

export const BET_LEVELS = [
  { amount: 10, multiplier: 1, label: 'Low' },
  { amount: 25, multiplier: 1.2, label: 'Medium' },
  { amount: 50, multiplier: 1.5, label: 'High' },
  { amount: 100, multiplier: 2, label: 'VIP' }
];

export const PAYOUTS = {
  [comboKey(SYMBOLS.DIAMOND, SYMBOLS.DIAMOND, SYMBOLS.DIAMOND)]: 500,
  [comboKey(SYMBOLS.SEVEN, SYMBOLS.SEVEN, SYMBOLS.SEVEN)]: 1000,
  [comboKey(SYMBOLS.CHERRY, SYMBOLS.CHERRY, SYMBOLS.CHERRY)]: 100,
  [comboKey(SYMBOLS.LEMON, SYMBOLS.LEMON, SYMBOLS.LEMON)]: 80,
  [comboKey(SYMBOLS.ORANGE, SYMBOLS.ORANGE, SYMBOLS.ORANGE)]: 80,
  [comboKey(SYMBOLS.GRAPE, SYMBOLS.GRAPE, SYMBOLS.GRAPE)]: 80,
  [comboKey(SYMBOLS.SCATTER, SYMBOLS.SCATTER, SYMBOLS.SCATTER)]: 0
};

export const JACKPOT_COMBO = comboKey(SYMBOLS.SEVEN, SYMBOLS.SEVEN, SYMBOLS.SEVEN);
export const JACKPOT_CONTRIBUTION = 0.01;
export const FREE_SPIN_COMBO = comboKey(SYMBOLS.SCATTER, SYMBOLS.SCATTER, SYMBOLS.SCATTER);
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

export const getSymbolLabel = (symbol) => SYMBOL_DATA[symbol]?.label || symbol;
export const getSymbolAsset = (symbol) => SYMBOL_DATA[symbol]?.asset;
export const buildComboKey = (symbols) => symbols.join('|');
