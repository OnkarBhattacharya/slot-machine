import { Storage } from '../utils/storage';

const EXPERIMENTS_KEY = 'abTests';

export const ABTestService = {
  experiments: {
    betMultiplier: { variants: ['1x', '1.2x', '1.5x'], weights: [0.33, 0.33, 0.34] },
    dailyBonus: { variants: [100, 150, 200], weights: [0.33, 0.33, 0.34] },
    adFrequency: { variants: ['low', 'medium', 'high'], weights: [0.33, 0.33, 0.34] }
  },

  getVariant(experimentName) {
    const userTests = Storage.load(EXPERIMENTS_KEY, {});
    
    if (userTests[experimentName]) {
      return userTests[experimentName];
    }

    const experiment = this.experiments[experimentName];
    if (!experiment) return null;

    const random = Math.random();
    let cumulative = 0;
    
    for (let i = 0; i < experiment.variants.length; i++) {
      cumulative += experiment.weights[i];
      if (random <= cumulative) {
        const variant = experiment.variants[i];
        userTests[experimentName] = variant;
        Storage.save(EXPERIMENTS_KEY, userTests);
        return variant;
      }
    }
    
    return experiment.variants[0];
  },

  trackConversion(experimentName, metric, value) {
    const variant = this.getVariant(experimentName);
    console.log(`Conversion: ${experimentName} - ${variant} - ${metric}: ${value}`);
  }
};
