import React from 'react';
import { fireEvent, render, screen } from '@testing-library/react';
import Controls from './Controls';
import { useGameStore } from '../store/gameStore';
import { resetGameStoreForTest } from '../test/testUtils';

describe('Controls', () => {
  beforeEach(() => {
    resetGameStoreForTest();
  });

  test('shows FREE SPIN label when free spins are available', () => {
    useGameStore.setState({ freeSpins: 2, isSpinning: false, coins: 0, selectedBet: 0 });

    render(<Controls onSpin={jest.fn()} onWatchAd={jest.fn()} onPurchase={jest.fn()} />);

    expect(screen.getByRole('button', { name: /free spin/i })).toBeInTheDocument();
  });

  test('disables spin when coins are below bet and no free spins', () => {
    useGameStore.setState({ freeSpins: 0, isSpinning: false, coins: 1, selectedBet: 0 });

    render(<Controls onSpin={jest.fn()} onWatchAd={jest.fn()} onPurchase={jest.fn()} />);

    expect(screen.getByRole('button', { name: /spin/i })).toBeDisabled();
  });

  test('calls onPurchase when selecting a coin package', () => {
    useGameStore.setState({ freeSpins: 0, isSpinning: false, coins: 1000, selectedBet: 0 });
    const onPurchase = jest.fn();

    render(<Controls onSpin={jest.fn()} onWatchAd={jest.fn()} onPurchase={onPurchase} />);

    fireEvent.click(screen.getByRole('button', { name: /^shop$/i }));
    fireEvent.click(screen.getByRole('button', { name: /500 coins - \$0\.99/i }));

    expect(onPurchase).toHaveBeenCalledWith(500);
  });
});
