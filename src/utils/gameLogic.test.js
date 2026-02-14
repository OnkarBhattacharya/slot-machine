import { calculateWin, getRandomMultiplier, getWeightedRandomSymbol } from './gameLogic';
import { SYMBOLS, getMachineGameConfig } from './gameConfig';

describe('gameLogic', () => {
  test('calculateWin returns jackpot for default jackpot combo', () => {
    const config = getMachineGameConfig('classic');
    const reels = [SYMBOLS.SEVEN, SYMBOLS.SEVEN, SYMBOLS.SEVEN];

    const result = calculateWin(reels, 1, 1, config);

    expect(result.isJackpot).toBe(true);
    expect(result.payout).toBeGreaterThan(0);
    expect(result.isFreeSpins).toBe(false);
  });

  test('calculateWin applies wild substitution payout', () => {
    const config = getMachineGameConfig('classic');
    const reels = [SYMBOLS.CHERRY, SYMBOLS.CHERRY, SYMBOLS.WILD];

    const result = calculateWin(reels, 2, 1, config);

    expect(result.payout).toBe(200);
    expect(result.isJackpot).toBe(false);
  });

  test('getWeightedRandomSymbol respects deterministic weight map', () => {
    const result = getWeightedRandomSymbol({ lemon: 0, cherry: 10 });
    expect(result).toBe('cherry');
  });

  test('getRandomMultiplier returns boosted multiplier when chance triggers', () => {
    const randomSpy = jest
      .spyOn(Math, 'random')
      .mockReturnValueOnce(0.05)
      .mockReturnValueOnce(0.6);

    const result = getRandomMultiplier(0.1, [2, 3, 5]);

    expect(result).toBe(3);
    randomSpy.mockRestore();
  });
});
