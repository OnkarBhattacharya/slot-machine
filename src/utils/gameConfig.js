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
export const buildComboKey = (symbols) => symbols.join('|');

export const BET_LEVELS = [
  { amount: 10, multiplier: 1, label: 'Low' },
  { amount: 25, multiplier: 1.2, label: 'Medium' },
  { amount: 50, multiplier: 1.5, label: 'High' },
  { amount: 100, multiplier: 2, label: 'VIP' }
];

const createMachineConfig = ({
  id,
  name,
  unlockLevel,
  volatility,
  baseRtp,
  multiplierChance,
  multipliers,
  freeSpinsAmount,
  symbolWeights,
  payouts,
  jackpotSymbol = SYMBOLS.SEVEN
}) => {
  const jackpotCombo = comboKey(jackpotSymbol, jackpotSymbol, jackpotSymbol);
  const freeSpinCombo = comboKey(SYMBOLS.SCATTER, SYMBOLS.SCATTER, SYMBOLS.SCATTER);

  return {
    id,
    name,
    unlockLevel,
    volatility,
    baseRtp,
    multiplierChance,
    multipliers,
    freeSpinsAmount,
    symbolWeights,
    payouts: {
      ...payouts,
      [freeSpinCombo]: 0
    },
    jackpotCombo,
    freeSpinCombo
  };
};

export const DEFAULT_MACHINE_ID = 'classic';

export const MACHINE_GAME_CONFIGS = {
  classic: createMachineConfig({
    id: 'classic',
    name: 'Classic Vegas',
    unlockLevel: 1,
    volatility: 'Medium',
    baseRtp: 95.1,
    multiplierChance: 0.15,
    multipliers: [2, 3, 5],
    freeSpinsAmount: 10,
    symbolWeights: {
      [SYMBOLS.CHERRY]: 25,
      [SYMBOLS.LEMON]: 20,
      [SYMBOLS.ORANGE]: 20,
      [SYMBOLS.GRAPE]: 20,
      [SYMBOLS.SEVEN]: 8,
      [SYMBOLS.DIAMOND]: 5,
      [SYMBOLS.WILD]: 1,
      [SYMBOLS.SCATTER]: 1
    },
    payouts: {
      [comboKey(SYMBOLS.DIAMOND, SYMBOLS.DIAMOND, SYMBOLS.DIAMOND)]: 500,
      [comboKey(SYMBOLS.SEVEN, SYMBOLS.SEVEN, SYMBOLS.SEVEN)]: 1000,
      [comboKey(SYMBOLS.CHERRY, SYMBOLS.CHERRY, SYMBOLS.CHERRY)]: 100,
      [comboKey(SYMBOLS.LEMON, SYMBOLS.LEMON, SYMBOLS.LEMON)]: 80,
      [comboKey(SYMBOLS.ORANGE, SYMBOLS.ORANGE, SYMBOLS.ORANGE)]: 80,
      [comboKey(SYMBOLS.GRAPE, SYMBOLS.GRAPE, SYMBOLS.GRAPE)]: 80
    }
  }),
  egyptian: createMachineConfig({
    id: 'egyptian',
    name: 'Egyptian Treasure',
    unlockLevel: 5,
    volatility: 'High',
    baseRtp: 96.2,
    multiplierChance: 0.12,
    multipliers: [2, 4, 6],
    freeSpinsAmount: 8,
    symbolWeights: {
      [SYMBOLS.CHERRY]: 18,
      [SYMBOLS.LEMON]: 18,
      [SYMBOLS.ORANGE]: 16,
      [SYMBOLS.GRAPE]: 16,
      [SYMBOLS.SEVEN]: 9,
      [SYMBOLS.DIAMOND]: 8,
      [SYMBOLS.WILD]: 2,
      [SYMBOLS.SCATTER]: 1
    },
    payouts: {
      [comboKey(SYMBOLS.DIAMOND, SYMBOLS.DIAMOND, SYMBOLS.DIAMOND)]: 1200,
      [comboKey(SYMBOLS.SEVEN, SYMBOLS.SEVEN, SYMBOLS.SEVEN)]: 900,
      [comboKey(SYMBOLS.WILD, SYMBOLS.WILD, SYMBOLS.WILD)]: 700,
      [comboKey(SYMBOLS.CHERRY, SYMBOLS.CHERRY, SYMBOLS.CHERRY)]: 120,
      [comboKey(SYMBOLS.LEMON, SYMBOLS.LEMON, SYMBOLS.LEMON)]: 100,
      [comboKey(SYMBOLS.ORANGE, SYMBOLS.ORANGE, SYMBOLS.ORANGE)]: 100,
      [comboKey(SYMBOLS.GRAPE, SYMBOLS.GRAPE, SYMBOLS.GRAPE)]: 100
    },
    jackpotSymbol: SYMBOLS.DIAMOND
  }),
  ocean: createMachineConfig({
    id: 'ocean',
    name: 'Ocean Fortune',
    unlockLevel: 10,
    volatility: 'Low',
    baseRtp: 94.6,
    multiplierChance: 0.2,
    multipliers: [2, 3, 4],
    freeSpinsAmount: 12,
    symbolWeights: {
      [SYMBOLS.CHERRY]: 28,
      [SYMBOLS.LEMON]: 24,
      [SYMBOLS.ORANGE]: 20,
      [SYMBOLS.GRAPE]: 18,
      [SYMBOLS.SEVEN]: 5,
      [SYMBOLS.DIAMOND]: 3,
      [SYMBOLS.WILD]: 1,
      [SYMBOLS.SCATTER]: 1
    },
    payouts: {
      [comboKey(SYMBOLS.DIAMOND, SYMBOLS.DIAMOND, SYMBOLS.DIAMOND)]: 450,
      [comboKey(SYMBOLS.SEVEN, SYMBOLS.SEVEN, SYMBOLS.SEVEN)]: 850,
      [comboKey(SYMBOLS.CHERRY, SYMBOLS.CHERRY, SYMBOLS.CHERRY)]: 140,
      [comboKey(SYMBOLS.LEMON, SYMBOLS.LEMON, SYMBOLS.LEMON)]: 110,
      [comboKey(SYMBOLS.ORANGE, SYMBOLS.ORANGE, SYMBOLS.ORANGE)]: 110,
      [comboKey(SYMBOLS.GRAPE, SYMBOLS.GRAPE, SYMBOLS.GRAPE)]: 110
    }
  }),
  space: createMachineConfig({
    id: 'space',
    name: 'Space Adventure',
    unlockLevel: 15,
    volatility: 'Very High',
    baseRtp: 96.8,
    multiplierChance: 0.1,
    multipliers: [3, 5, 8],
    freeSpinsAmount: 6,
    symbolWeights: {
      [SYMBOLS.CHERRY]: 16,
      [SYMBOLS.LEMON]: 16,
      [SYMBOLS.ORANGE]: 16,
      [SYMBOLS.GRAPE]: 15,
      [SYMBOLS.SEVEN]: 10,
      [SYMBOLS.DIAMOND]: 8,
      [SYMBOLS.WILD]: 3,
      [SYMBOLS.SCATTER]: 1
    },
    payouts: {
      [comboKey(SYMBOLS.DIAMOND, SYMBOLS.DIAMOND, SYMBOLS.DIAMOND)]: 1800,
      [comboKey(SYMBOLS.SEVEN, SYMBOLS.SEVEN, SYMBOLS.SEVEN)]: 1600,
      [comboKey(SYMBOLS.WILD, SYMBOLS.WILD, SYMBOLS.WILD)]: 2000,
      [comboKey(SYMBOLS.CHERRY, SYMBOLS.CHERRY, SYMBOLS.CHERRY)]: 140,
      [comboKey(SYMBOLS.LEMON, SYMBOLS.LEMON, SYMBOLS.LEMON)]: 120,
      [comboKey(SYMBOLS.ORANGE, SYMBOLS.ORANGE, SYMBOLS.ORANGE)]: 120,
      [comboKey(SYMBOLS.GRAPE, SYMBOLS.GRAPE, SYMBOLS.GRAPE)]: 120
    },
    jackpotSymbol: SYMBOLS.WILD
  }),
  neon: createMachineConfig({
    id: 'neon',
    name: 'Neon Rush',
    unlockLevel: 20,
    volatility: 'Medium-High',
    baseRtp: 95.9,
    multiplierChance: 0.18,
    multipliers: [2, 3, 5, 7],
    freeSpinsAmount: 9,
    symbolWeights: {
      [SYMBOLS.CHERRY]: 22,
      [SYMBOLS.LEMON]: 18,
      [SYMBOLS.ORANGE]: 18,
      [SYMBOLS.GRAPE]: 18,
      [SYMBOLS.SEVEN]: 9,
      [SYMBOLS.DIAMOND]: 7,
      [SYMBOLS.WILD]: 2,
      [SYMBOLS.SCATTER]: 1
    },
    payouts: {
      [comboKey(SYMBOLS.DIAMOND, SYMBOLS.DIAMOND, SYMBOLS.DIAMOND)]: 1100,
      [comboKey(SYMBOLS.SEVEN, SYMBOLS.SEVEN, SYMBOLS.SEVEN)]: 1200,
      [comboKey(SYMBOLS.WILD, SYMBOLS.WILD, SYMBOLS.WILD)]: 900,
      [comboKey(SYMBOLS.CHERRY, SYMBOLS.CHERRY, SYMBOLS.CHERRY)]: 130,
      [comboKey(SYMBOLS.LEMON, SYMBOLS.LEMON, SYMBOLS.LEMON)]: 110,
      [comboKey(SYMBOLS.ORANGE, SYMBOLS.ORANGE, SYMBOLS.ORANGE)]: 110,
      [comboKey(SYMBOLS.GRAPE, SYMBOLS.GRAPE, SYMBOLS.GRAPE)]: 110
    },
    jackpotSymbol: SYMBOLS.SEVEN
  })
};

export const getMachineGameConfig = (machineId = DEFAULT_MACHINE_ID) =>
  MACHINE_GAME_CONFIGS[machineId] || MACHINE_GAME_CONFIGS[DEFAULT_MACHINE_ID];

export const PAYOUTS = MACHINE_GAME_CONFIGS[DEFAULT_MACHINE_ID].payouts;
export const JACKPOT_COMBO = MACHINE_GAME_CONFIGS[DEFAULT_MACHINE_ID].jackpotCombo;
export const JACKPOT_CONTRIBUTION = 0.01;
export const FREE_SPIN_COMBO = MACHINE_GAME_CONFIGS[DEFAULT_MACHINE_ID].freeSpinCombo;
export const FREE_SPINS_AMOUNT = MACHINE_GAME_CONFIGS[DEFAULT_MACHINE_ID].freeSpinsAmount;

export const MULTIPLIERS = [1, ...MACHINE_GAME_CONFIGS[DEFAULT_MACHINE_ID].multipliers];

export const SYMBOL_WEIGHTS = MACHINE_GAME_CONFIGS[DEFAULT_MACHINE_ID].symbolWeights;

export const getSymbolLabel = (symbol) => SYMBOL_DATA[symbol]?.label || symbol;
export const getSymbolAsset = (symbol) => SYMBOL_DATA[symbol]?.asset;
