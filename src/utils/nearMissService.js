import { SYMBOLS, PAYOUTS, JACKPOT_COMBO } from './gameConfig';

export class NearMissService {
  /**
   * Detects if a spin result is a "near miss" - almost winning
   * Near miss creates anticipation and excitement
   */
  static detectNearMiss(reels) {
    const [reel1, reel2, reel3] = reels;
    
    // Check for two matching symbols (one away from win)
    if (reel1 === reel2 && reel1 !== reel3) {
      return {
        isNearMiss: true,
        type: 'two_match',
        symbol: reel1,
        message: `So close! Two ${reel1}!`,
        intensity: this.getNearMissIntensity(reel1)
      };
    }
    
    if (reel1 === reel3 && reel1 !== reel2) {
      return {
        isNearMiss: true,
        type: 'outer_match',
        symbol: reel1,
        message: `Almost! Two ${reel1}!`,
        intensity: this.getNearMissIntensity(reel1)
      };
    }
    
    if (reel2 === reel3 && reel1 !== reel2) {
      return {
        isNearMiss: true,
        type: 'two_match',
        symbol: reel2,
        message: `Close one! Two ${reel2}!`,
        intensity: this.getNearMissIntensity(reel2)
      };
    }
    
    // Check for near-jackpot (two sevens)
    const sevenCount = reels.filter(r => r === SYMBOLS.SEVEN).length;
    if (sevenCount === 2) {
      return {
        isNearMiss: true,
        type: 'near_jackpot',
        symbol: SYMBOLS.SEVEN,
        message: '💥 ALMOST JACKPOT! 💥',
        intensity: 'high'
      };
    }
    
    // Check for near-diamond (two diamonds)
    const diamondCount = reels.filter(r => r === SYMBOLS.DIAMOND).length;
    if (diamondCount === 2) {
      return {
        isNearMiss: true,
        type: 'near_big_win',
        symbol: SYMBOLS.DIAMOND,
        message: '✨ Nearly there! ✨',
        intensity: 'medium'
      };
    }
    
    // Check for scatter near-miss (2 scatters)
    const scatterCount = reels.filter(r => r === SYMBOLS.SCATTER).length;
    if (scatterCount === 2) {
      return {
        isNearMiss: true,
        type: 'near_free_spins',
        symbol: SYMBOLS.SCATTER,
        message: '🎁 One more for FREE SPINS! 🎁',
        intensity: 'medium'
      };
    }
    
    return {
      isNearMiss: false,
      type: null,
      symbol: null,
      message: null,
      intensity: null
    };
  }

  /**
   * Determines the intensity of the near miss based on symbol value
   */
  static getNearMissIntensity(symbol) {
    if (symbol === SYMBOLS.SEVEN) return 'high';
    if (symbol === SYMBOLS.DIAMOND) return 'high';
    if (symbol === SYMBOLS.WILD) return 'high';
    if (symbol === SYMBOLS.SCATTER) return 'medium';
    return 'low';
  }

  /**
   * Gets animation configuration based on near miss type
   */
  static getAnimationConfig(nearMissData) {
    if (!nearMissData.isNearMiss) return null;

    const configs = {
      high: {
        duration: 2000,
        shake: true,
        glow: true,
        sound: 'near_miss_high',
        vibration: [100, 50, 100, 50, 100],
        particles: true,
        color: '#ffd700'
      },
      medium: {
        duration: 1500,
        shake: true,
        glow: true,
        sound: 'near_miss_medium',
        vibration: [100, 50, 100],
        particles: false,
        color: '#ff6b6b'
      },
      low: {
        duration: 1000,
        shake: false,
        glow: true,
        sound: 'near_miss_low',
        vibration: [100],
        particles: false,
        color: '#4ecdc4'
      }
    };

    return configs[nearMissData.intensity] || configs.low;
  }

  /**
   * Calculates if a near miss should be artificially created
   * (for engagement purposes, use sparingly and ethically)
   */
  static shouldCreateNearMiss(consecutiveLosses) {
    // After 5+ losses, 20% chance to create near miss
    if (consecutiveLosses >= 5) {
      return Math.random() < 0.2;
    }
    return false;
  }

  /**
   * Modifies a losing spin to create a near miss
   * Only use this ethically and transparently
   */
  static createNearMiss(reels, targetSymbol = null) {
    const symbol = targetSymbol || this.getRandomHighValueSymbol();
    const position = Math.floor(Math.random() * 3);
    
    const newReels = [...reels];
    
    // Place two matching symbols
    if (position === 0) {
      newReels[0] = symbol;
      newReels[1] = symbol;
    } else if (position === 1) {
      newReels[1] = symbol;
      newReels[2] = symbol;
    } else {
      newReels[0] = symbol;
      newReels[2] = symbol;
    }
    
    return newReels;
  }

  static getRandomHighValueSymbol() {
    const highValueSymbols = [
      SYMBOLS.SEVEN,
      SYMBOLS.DIAMOND,
      SYMBOLS.WILD
    ];
    return highValueSymbols[Math.floor(Math.random() * highValueSymbols.length)];
  }

  /**
   * Tracks near miss statistics for analytics
   */
  static trackNearMiss(nearMissData) {
    const stats = this.getNearMissStats();
    
    stats.total += 1;
    stats.byType[nearMissData.type] = (stats.byType[nearMissData.type] || 0) + 1;
    stats.byIntensity[nearMissData.intensity] = (stats.byIntensity[nearMissData.intensity] || 0) + 1;
    stats.lastOccurrence = Date.now();
    
    // Keep only last 100 near misses
    stats.history.push({
      timestamp: Date.now(),
      type: nearMissData.type,
      symbol: nearMissData.symbol
    });
    
    if (stats.history.length > 100) {
      stats.history.shift();
    }
    
    this.saveNearMissStats(stats);
  }

  static getNearMissStats() {
    const defaultStats = {
      total: 0,
      byType: {},
      byIntensity: {},
      history: [],
      lastOccurrence: null
    };
    
    try {
      const stored = localStorage.getItem('near_miss_stats');
      return stored ? JSON.parse(stored) : defaultStats;
    } catch {
      return defaultStats;
    }
  }

  static saveNearMissStats(stats) {
    try {
      localStorage.setItem('near_miss_stats', JSON.stringify(stats));
    } catch (error) {
      console.error('Failed to save near miss stats:', error);
    }
  }

  /**
   * Gets near miss rate for analytics
   */
  static getNearMissRate(totalSpins) {
    const stats = this.getNearMissStats();
    return totalSpins > 0 ? (stats.total / totalSpins) * 100 : 0;
  }
}
