import { Storage } from '../utils/storage';

const TUTORIAL_STEPS = [
  { id: 'welcome', title: 'Welcome!', description: 'Welcome to Slot Machine! Let me show you around.' },
  { id: 'bet', title: 'Select Bet', description: 'Choose your bet amount. Higher bets = bigger wins!' },
  { id: 'spin', title: 'Spin', description: 'Click SPIN to play. Match 3 symbols to win!' },
  { id: 'daily', title: 'Daily Rewards', description: 'Claim free coins every day. Build your streak!' },
  { id: 'achievements', title: 'Achievements', description: 'Unlock badges to earn bonus coins.' },
  { id: 'complete', title: 'Ready!', description: 'You\'re all set. Good luck!' }
];

export class OnboardingService {
  static hasCompletedTutorial() {
    return Storage.load('tutorial_completed', false);
  }

  static getCurrentStep() {
    return Storage.load('tutorial_step', 0);
  }

  static nextStep() {
    const current = this.getCurrentStep();
    if (current < TUTORIAL_STEPS.length - 1) {
      Storage.save('tutorial_step', current + 1);
      return current + 1;
    }
    this.completeTutorial();
    return -1;
  }

  static completeTutorial() {
    Storage.save('tutorial_completed', true);
    Storage.save('tutorial_step', TUTORIAL_STEPS.length);
  }

  static resetTutorial() {
    Storage.save('tutorial_completed', false);
    Storage.save('tutorial_step', 0);
  }

  static getStep(index) {
    return TUTORIAL_STEPS[index] || null;
  }

  static getTotalSteps() {
    return TUTORIAL_STEPS.length;
  }

  static shouldShowTooltip(feature) {
    const shown = Storage.load('tooltips_shown', []);
    return !shown.includes(feature);
  }

  static markTooltipShown(feature) {
    const shown = Storage.load('tooltips_shown', []);
    if (!shown.includes(feature)) {
      shown.push(feature);
      Storage.save('tooltips_shown', shown);
    }
  }
}
