import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';

const defaultState = {
  coins: 1000,
  isSpinning: false,
  selectedBet: 0,
  jackpot: 5000,
  freeSpins: 0,
  level: 1,
  xp: 0,
  prestigeLevel: 0,
  isVIP: false,
  currentMachine: 'classic'
};

export const useGameStore = create(
  persist(
    (set) => ({
      ...defaultState,
      setCoins: (valueOrUpdater) =>
        set((state) => ({
          coins: typeof valueOrUpdater === 'function' ? valueOrUpdater(state.coins) : valueOrUpdater
        })),
      setIsSpinning: (isSpinning) => set({ isSpinning }),
      setSelectedBet: (selectedBet) => set({ selectedBet }),
      setJackpot: (valueOrUpdater) =>
        set((state) => ({
          jackpot: typeof valueOrUpdater === 'function' ? valueOrUpdater(state.jackpot) : valueOrUpdater
        })),
      setFreeSpins: (valueOrUpdater) =>
        set((state) => ({
          freeSpins: typeof valueOrUpdater === 'function' ? valueOrUpdater(state.freeSpins) : valueOrUpdater
        })),
      setLevel: (level) => set({ level }),
      setXP: (xp) => set({ xp }),
      setPrestigeLevel: (prestigeLevel) => set({ prestigeLevel }),
      setIsVIP: (isVIP) => set({ isVIP }),
      setCurrentMachine: (currentMachine) => set({ currentMachine }),
      resetGameStore: () => set(defaultState)
    }),
    {
      name: 'game-store-v1',
      storage: createJSONStorage(() => localStorage),
      partialize: (state) => ({
        coins: state.coins,
        selectedBet: state.selectedBet,
        jackpot: state.jackpot,
        freeSpins: state.freeSpins,
        level: state.level,
        xp: state.xp,
        prestigeLevel: state.prestigeLevel,
        isVIP: state.isVIP,
        currentMachine: state.currentMachine
      })
    }
  )
);
