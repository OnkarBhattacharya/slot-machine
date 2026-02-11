import React, { useState, useEffect } from 'react';
import { ThemeService } from '../services/themeService';
import { AccessibilityService } from '../services/accessibilityService';
import { SoundService } from '../utils/soundService';
import { OnboardingService } from '../services/onboardingService';
import './Settings.css';

function Settings({ onClose, onOpenHelp }) {
  const [theme, setTheme] = useState(ThemeService.getCurrentTheme());
  const [darkMode, setDarkMode] = useState(ThemeService.isDarkMode());
  const [soundVolume, setSoundVolume] = useState(SoundService.getVolume());
  const [musicVolume, setMusicVolume] = useState(SoundService.getMusicVolume());
  const [a11y, setA11y] = useState(AccessibilityService.getSettings());

  const handleThemeChange = (themeName) => {
    ThemeService.setTheme(themeName);
    setTheme(themeName);
  };

  const handleDarkModeToggle = () => {
    const newMode = ThemeService.toggleDarkMode();
    setDarkMode(newMode);
  };

  const handleSoundVolumeChange = (e) => {
    const vol = parseFloat(e.target.value);
    SoundService.setVolume(vol);
    setSoundVolume(vol);
  };

  const handleMusicVolumeChange = (e) => {
    const vol = parseFloat(e.target.value);
    SoundService.setMusicVolume(vol);
    setMusicVolume(vol);
  };

  const handleScreenReaderToggle = () => {
    const newVal = !a11y.screenReader;
    AccessibilityService.setScreenReader(newVal);
    setA11y({ ...a11y, screenReader: newVal });
  };

  const handleColorblindMode = (mode) => {
    AccessibilityService.setColorblindMode(mode);
    setA11y({ ...a11y, colorblindMode: mode });
  };

  const handleAnimationSpeed = (e) => {
    const speed = parseFloat(e.target.value);
    AccessibilityService.setAnimationSpeed(speed);
    setA11y({ ...a11y, animationSpeed: speed });
  };

  const handleResetTutorial = () => {
    OnboardingService.resetTutorial();
    alert('Tutorial reset! Reload the page to start over.');
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="settings-modal" onClick={(e) => e.stopPropagation()}>
        <button className="close-btn" onClick={onClose}>✕</button>
        <h2>⚙️ Settings</h2>
        
        <div className="settings-section">
          <h3>🎨 Theme</h3>
          <div className="theme-grid">
            {ThemeService.getThemes().map(t => (
              <button
                key={t.id}
                className={`theme-btn ${theme === t.id ? 'active' : ''}`}
                onClick={() => handleThemeChange(t.id)}
              >
                {t.name}
              </button>
            ))}
          </div>
          <label className="toggle-label">
            <input type="checkbox" checked={darkMode} onChange={handleDarkModeToggle} />
            <span>Dark Mode</span>
          </label>
        </div>

        <div className="settings-section">
          <h3>🔊 Audio</h3>
          <label>
            Sound Effects: {Math.round(soundVolume * 100)}%
            <input type="range" min="0" max="1" step="0.1" value={soundVolume} onChange={handleSoundVolumeChange} />
          </label>
          <label>
            Music: {Math.round(musicVolume * 100)}%
            <input type="range" min="0" max="1" step="0.1" value={musicVolume} onChange={handleMusicVolumeChange} />
          </label>
        </div>

        <div className="settings-section">
          <h3>♿ Accessibility</h3>
          <label className="toggle-label">
            <input type="checkbox" checked={a11y.screenReader} onChange={handleScreenReaderToggle} />
            <span>Screen Reader Support</span>
          </label>
          <label>
            Colorblind Mode:
            <select value={a11y.colorblindMode} onChange={(e) => handleColorblindMode(e.target.value)}>
              <option value="none">None</option>
              <option value="protanopia">Protanopia (Red-Blind)</option>
              <option value="deuteranopia">Deuteranopia (Green-Blind)</option>
              <option value="tritanopia">Tritanopia (Blue-Blind)</option>
            </select>
          </label>
          <label>
            Animation Speed: {a11y.animationSpeed}x
            <input type="range" min="0.5" max="2" step="0.1" value={a11y.animationSpeed} onChange={handleAnimationSpeed} />
          </label>
        </div>

        <div className="settings-section">
          <h3>📚 Help</h3>
          <button className="action-btn" onClick={handleResetTutorial}>Reset Tutorial</button>
          <button className="action-btn" onClick={onOpenHelp} style={{ marginLeft: '10px' }}>View Help & FAQ</button>
        </div>
      </div>
    </div>
  );
}

export default Settings;
