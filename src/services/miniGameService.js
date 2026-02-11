import { Storage } from '../utils/storage';

export class MiniGameService {
  static getScratchCardReward() {
    const rand = Math.random();
    if (rand < 0.4) return 50;
    if (rand < 0.7) return 100;
    if (rand < 0.9) return 250;
    return 500;
  }

  static coinFlip(bet, choice) {
    const result = Math.random() < 0.5 ? 'heads' : 'tails';
    return { result, won: result === choice, payout: result === choice ? bet * 2 : 0 };
  }

  static spinWheel() {
    const prizes = [10, 25, 50, 100, 250, 500, 1000, 0];
    const weights = [30, 25, 20, 15, 7, 2, 0.5, 0.5];
    const total = weights.reduce((a, b) => a + b, 0);
    let rand = Math.random() * total;
    
    for (let i = 0; i < prizes.length; i++) {
      rand -= weights[i];
      if (rand <= 0) return prizes[i];
    }
    return prizes[0];
  }

  static getCardGame() {
    const cards = ['2', '3', '4', '5', '6', '7', '8', '9', '10', 'J', 'Q', 'K', 'A'];
    const dealerCard = cards[Math.floor(Math.random() * cards.length)];
    return { dealerCard, cards };
  }

  static playCardGame(dealerCard, playerGuess) {
    const cards = ['2', '3', '4', '5', '6', '7', '8', '9', '10', 'J', 'Q', 'K', 'A'];
    const playerCard = cards[Math.floor(Math.random() * cards.length)];
    const dealerIdx = cards.indexOf(dealerCard);
    const playerIdx = cards.indexOf(playerCard);
    
    const won = (playerGuess === 'higher' && playerIdx > dealerIdx) || 
                (playerGuess === 'lower' && playerIdx < dealerIdx);
    
    return { playerCard, won, payout: won ? 2 : 0 };
  }

  static getDailyMiniGamePlays() {
    const data = Storage.load('miniGamePlays', { date: new Date().toDateString(), plays: 3 });
    if (data.date !== new Date().toDateString()) {
      return { plays: 3, date: new Date().toDateString() };
    }
    return data;
  }

  static useMiniGamePlay() {
    const data = this.getDailyMiniGamePlays();
    if (data.plays > 0) {
      data.plays--;
      Storage.save('miniGamePlays', data);
      return true;
    }
    return false;
  }
}
