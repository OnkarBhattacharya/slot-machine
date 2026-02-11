import { Storage } from './storage';

export const SoundService = {
  getVolume: () => Storage.load('sound_volume', 0.5),
  getMusicVolume: () => Storage.load('music_volume', 0.3),
  
  setVolume: (vol) => Storage.save('sound_volume', vol),
  setMusicVolume: (vol) => Storage.save('music_volume', vol),

  playWin: () => {
    if (typeof Audio !== 'undefined') {
      const audioContext = new (window.AudioContext || window.webkitAudioContext)();
      const oscillator = audioContext.createOscillator();
      const gainNode = audioContext.createGain();
      
      oscillator.connect(gainNode);
      gainNode.connect(audioContext.destination);
      
      oscillator.frequency.value = 800;
      gainNode.gain.value = 0.3 * SoundService.getVolume();
      
      oscillator.start();
      oscillator.stop(audioContext.currentTime + 0.2);
    }
  },

  playJackpot: () => {
    if (typeof Audio !== 'undefined') {
      const audioContext = new (window.AudioContext || window.webkitAudioContext)();
      [400, 500, 600, 800].forEach((freq, i) => {
        const oscillator = audioContext.createOscillator();
        const gainNode = audioContext.createGain();
        
        oscillator.connect(gainNode);
        gainNode.connect(audioContext.destination);
        
        oscillator.frequency.value = freq;
        gainNode.gain.value = 0.2 * SoundService.getVolume();
        
        const startTime = audioContext.currentTime + (i * 0.1);
        oscillator.start(startTime);
        oscillator.stop(startTime + 0.2);
      });
    }
  },

  playSpin: () => {
    if (typeof Audio !== 'undefined') {
      const audioContext = new (window.AudioContext || window.webkitAudioContext)();
      const oscillator = audioContext.createOscillator();
      const gainNode = audioContext.createGain();
      
      oscillator.connect(gainNode);
      gainNode.connect(audioContext.destination);
      
      oscillator.frequency.value = 200;
      gainNode.gain.value = 0.1 * SoundService.getVolume();
      
      oscillator.start();
      oscillator.stop(audioContext.currentTime + 0.1);
    }
  },

  vibrate: (pattern = [100]) => {
    if ('vibrate' in navigator) {
      navigator.vibrate(pattern);
    }
  }
};
