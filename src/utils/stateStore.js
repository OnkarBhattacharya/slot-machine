class StateStore {
  constructor(initialState = {}) {
    this.state = initialState;
    this.listeners = new Set();
    this.history = [];
    this.historyIndex = -1;
    this.maxHistory = 50;
  }

  getState() {
    return { ...this.state };
  }

  setState(updates, recordHistory = true) {
    if (recordHistory) {
      this.history = this.history.slice(0, this.historyIndex + 1);
      this.history.push({ ...this.state });
      if (this.history.length > this.maxHistory) {
        this.history.shift();
      } else {
        this.historyIndex++;
      }
    }

    this.state = { ...this.state, ...updates };
    this.notify();
  }

  subscribe(listener) {
    this.listeners.add(listener);
    return () => this.listeners.delete(listener);
  }

  notify() {
    this.listeners.forEach(listener => listener(this.state));
  }

  undo() {
    if (this.historyIndex > 0) {
      this.historyIndex--;
      this.state = { ...this.history[this.historyIndex] };
      this.notify();
      return true;
    }
    return false;
  }

  redo() {
    if (this.historyIndex < this.history.length - 1) {
      this.historyIndex++;
      this.state = { ...this.history[this.historyIndex] };
      this.notify();
      return true;
    }
    return false;
  }

  canUndo() {
    return this.historyIndex > 0;
  }

  canRedo() {
    return this.historyIndex < this.history.length - 1;
  }

  reset(newState = {}) {
    this.state = newState;
    this.history = [];
    this.historyIndex = -1;
    this.notify();
  }
}

export const gameStore = new StateStore({
  coins: 1000,
  level: 1,
  xp: 0,
  isSpinning: false,
  lastWin: 0,
  jackpot: 10000,
  betAmount: 10
});

export default StateStore;
