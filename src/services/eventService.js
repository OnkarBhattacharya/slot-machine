export class EventService {
  static getActiveEvent() {
    const now = new Date();
    const day = now.getDay();
    const hour = now.getHours();
    
    // Weekend bonus
    if (day === 0 || day === 6) {
      return { type: 'weekend', multiplier: 2, message: 'Weekend Bonus Active!' };
    }
    
    // Happy hour (6 PM - 9 PM)
    if (hour >= 18 && hour < 21) {
      return { type: 'happyhour', multiplier: 1.5, message: 'Happy Hour Active!' };
    }
    
    return null;
  }

  static getEventMultiplier() {
    const event = this.getActiveEvent();
    return event ? event.multiplier : 1;
  }

  static isEventActive() {
    return this.getActiveEvent() !== null;
  }
}
