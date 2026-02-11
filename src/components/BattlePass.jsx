import React, { useState, useEffect } from 'react';
import { BattlePassService } from '../services/battlePassService';
import './BattlePass.css';

function BattlePass({ onClose, onPurchasePremium, onRewardClaimed }) {
  const [progress, setProgress] = useState(null);
  const [stats, setStats] = useState(null);
  const [tiers, setTiers] = useState([]);

  useEffect(() => {
    loadData();
    const interval = setInterval(loadData, 1000);
    return () => clearInterval(interval);
  }, []);

  const loadData = () => {
    setProgress(BattlePassService.getProgress());
    setStats(BattlePassService.getSeasonStats());
    setTiers(BattlePassService.getTiers());
  };

  const handleClaimReward = (level, isPremium) => {
    const reward = BattlePassService.claimReward(level, isPremium);
    if (reward) {
      onRewardClaimed?.(reward);
      loadData();
    }
  };

  const handlePurchasePremium = () => {
    onPurchasePremium?.();
    loadData();
  };

  const formatTime = (ms) => {
    const days = Math.floor(ms / (24 * 60 * 60 * 1000));
    const hours = Math.floor((ms % (24 * 60 * 60 * 1000)) / (60 * 60 * 1000));
    return `${days}d ${hours}h`;
  };

  if (!stats || !progress) return null;

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal battlepass-modal" onClick={e => e.stopPropagation()}>
        <button className="close-btn" onClick={onClose}>✕</button>
        
        <div className="battlepass-header">
          <h2>🎖️ Battle Pass - Season {stats.seasonNumber}</h2>
          <p className="season-theme">{stats.theme}</p>
          <div className="season-info">
            <span>Level {stats.level}/{stats.totalTiers}</span>
            <span className="time-remaining">⏰ {formatTime(stats.timeRemaining)}</span>
          </div>
        </div>

        <div className="xp-bar-container">
          <div className="xp-bar">
            <div 
              className="xp-fill" 
              style={{ width: `${(stats.xp / stats.nextLevelXP) * 100}%` }}
            />
          </div>
          <span className="xp-text">{stats.xp} / {stats.nextLevelXP} XP</span>
        </div>

        {!progress.isPremium && (
          <div className="premium-banner">
            <h3>🌟 Unlock Premium Pass</h3>
            <p>Get exclusive rewards, boosters, and machines!</p>
            <button className="premium-btn" onClick={handlePurchasePremium}>
              Unlock for ${(BattlePassService.getPremiumPrice() / 100).toFixed(2)}
            </button>
          </div>
        )}

        <div className="tiers-container">
          {tiers.map((tier, index) => {
            const level = index + 1;
            const isUnlocked = stats.level >= level;
            const freeRewardKey = `${level}_free`;
            const premiumRewardKey = `${level}_premium`;
            const freeClaimed = progress.claimedRewards.includes(freeRewardKey);
            const premiumClaimed = progress.claimedRewards.includes(premiumRewardKey);

            return (
              <div 
                key={level} 
                className={`tier ${isUnlocked ? 'unlocked' : 'locked'}`}
              >
                <div className="tier-level">
                  <span className="level-number">{level}</span>
                  {isUnlocked && <span className="unlock-icon">✓</span>}
                </div>

                <div className="tier-rewards">
                  {/* Free Reward */}
                  <div className="reward free-reward">
                    <div className="reward-label">Free</div>
                    <div className="reward-content">
                      {tier.freeReward.coins && (
                        <span className="reward-item">💰 {tier.freeReward.coins}</span>
                      )}
                    </div>
                    {isUnlocked && !freeClaimed && (
                      <button 
                        className="claim-btn"
                        onClick={() => handleClaimReward(level, false)}
                      >
                        Claim
                      </button>
                    )}
                    {freeClaimed && <span className="claimed-badge">✓ Claimed</span>}
                  </div>

                  {/* Premium Reward */}
                  <div className={`reward premium-reward ${!progress.isPremium ? 'locked' : ''}`}>
                    <div className="reward-label">Premium 🌟</div>
                    <div className="reward-content">
                      {tier.premiumReward.coins && (
                        <span className="reward-item">💰 {tier.premiumReward.coins}</span>
                      )}
                      {tier.premiumReward.booster && (
                        <span className="reward-item">⚡ {tier.premiumReward.booster}</span>
                      )}
                      {tier.premiumReward.machine && (
                        <span className="reward-item">🎰 {tier.premiumReward.machine}</span>
                      )}
                      {tier.premiumReward.theme && (
                        <span className="reward-item">🎨 {tier.premiumReward.theme}</span>
                      )}
                      {tier.premiumReward.exclusive && (
                        <span className="reward-item">💎 {tier.premiumReward.exclusive}</span>
                      )}
                    </div>
                    {isUnlocked && progress.isPremium && !premiumClaimed && (
                      <button 
                        className="claim-btn premium"
                        onClick={() => handleClaimReward(level, true)}
                      >
                        Claim
                      </button>
                    )}
                    {premiumClaimed && <span className="claimed-badge">✓ Claimed</span>}
                    {!progress.isPremium && <span className="locked-badge">🔒</span>}
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        <div className="battlepass-footer">
          <p>Earn XP by spinning slots and completing challenges!</p>
        </div>
      </div>
    </div>
  );
}

export default BattlePass;
