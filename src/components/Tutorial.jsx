import React, { useState, useEffect } from 'react';
import { OnboardingService } from '../services/onboardingService';
import './Tutorial.css';

function Tutorial({ onComplete }) {
  const [step, setStep] = useState(OnboardingService.getCurrentStep());
  const [currentStep, setCurrentStep] = useState(OnboardingService.getStep(step));

  const handleNext = () => {
    const nextStep = OnboardingService.nextStep();
    if (nextStep === -1) {
      onComplete?.();
    } else {
      setStep(nextStep);
      setCurrentStep(OnboardingService.getStep(nextStep));
    }
  };

  const handleSkip = () => {
    OnboardingService.completeTutorial();
    onComplete?.();
  };

  if (!currentStep) return null;

  return (
    <div className="tutorial-overlay">
      <div className="tutorial-box">
        <div className="tutorial-progress">
          {step + 1} / {OnboardingService.getTotalSteps()}
        </div>
        <h2>{currentStep.title}</h2>
        <p>{currentStep.description}</p>
        <div className="tutorial-actions">
          <button className="skip-btn" onClick={handleSkip}>Skip</button>
          <button className="next-btn" onClick={handleNext}>
            {step === OnboardingService.getTotalSteps() - 1 ? 'Finish' : 'Next'}
          </button>
        </div>
      </div>
    </div>
  );
}

export default Tutorial;
