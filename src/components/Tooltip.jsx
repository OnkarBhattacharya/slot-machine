import React, { useState, useEffect } from 'react';
import { OnboardingService } from '../services/onboardingService';
import './Tooltip.css';

function Tooltip({ feature, children, message, position = 'top' }) {
  const [show, setShow] = useState(false);

  useEffect(() => {
    if (OnboardingService.shouldShowTooltip(feature)) {
      setTimeout(() => setShow(true), 500);
    }
  }, [feature]);

  const handleDismiss = () => {
    setShow(false);
    OnboardingService.markTooltipShown(feature);
  };

  if (!show) return children;

  return (
    <div className="tooltip-wrapper">
      {children}
      <div className={`tooltip-bubble ${position}`}>
        <button className="tooltip-close" onClick={handleDismiss}>✕</button>
        <p>{message}</p>
        <button className="tooltip-got-it" onClick={handleDismiss}>Got it!</button>
      </div>
    </div>
  );
}

export default Tooltip;
