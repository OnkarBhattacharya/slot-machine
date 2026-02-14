import { useGameStore } from '../store/gameStore';

export const resetGameStoreForTest = () => {
  const store = useGameStore.getState();
  store.resetGameStore();
};
