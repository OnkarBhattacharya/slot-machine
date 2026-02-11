import React, { useState, useEffect } from 'react';
import './EventBanner.css';

function EventBanner() {
  const [event, setEvent] = useState(null);

  useEffect(() => {
    // Check for active events
    const checkEvent = () => {
      const now = new Date();
      const day = now.getDay();
      const hour = now.getHours();
      
      // Weekend bonus
      if (day === 0 || day === 6) {
        setEvent({ type: 'weekend', message: '🎉 Weekend Bonus: 2x Coins!' });
      }
      // Happy hour
      else if (hour >= 18 && hour < 21) {
        setEvent({ type: 'happyhour', message: '⏰ Happy Hour: Extra rewards!' });
      }
      else {
        setEvent(null);
      }
    };

    checkEvent();
    const interval = setInterval(checkEvent, 60000); // Check every minute
    return () => clearInterval(interval);
  }, []);

  if (!event) return null;

  return (
    <div className="event-banner">
      {event.message}
    </div>
  );
}

export default EventBanner;
