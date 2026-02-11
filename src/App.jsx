import React, { useState, useEffect } from 'react';
import SlotMachine from './components/SlotMachine';
import Controls from './components/Controls';
import BetSelector from './components/BetSelector';
import DailyRewards from './components/DailyRewards';
import Achievements from './components/Achievements';
import Leaderboard from './components/Leaderboard';
import LevelDisplay from './components/LevelDisplay';
import Shop from './components/Shop';
import EventBanner from './components/EventBanner';
import Social from './components/Social';
import Tournament from './components/Tournament';
import Guild from './components/Guild';
import Settings from './components/Settings';
import Tutorial from './components/Tutorial';
import Tooltip from './components/Tooltip';
import Help from './components/Help';
import MachineSelector from './components/MachineSelector';
import MiniGames from './components/MiniGames';
import StoryMode from './components/StoryMode';
import BattlePass from './components/BattlePass';
import { AdService } from './services/adService';
import { SlotMachineService } from './services/slotMachineService';
import { PurchaseService } from './services/purchaseService';
import { DailyRewardsService } from './services/dailyRewardsService';
import { AchievementService } from './services/achievementService';
import { LeaderboardService } from './services/leaderboardService';
import { LevelService } from './services/levelService';
import { SubscriptionService } from './services/subscriptionService';
import { EventService } from './services/eventService';
import { TournamentService } from './services/tournamentService';
import { GuildService } from './services/guildService';
import { ThemeService } from './services/themeService';
import { AccessibilityService } from './services/accessibilityService';
import { OnboardingService } from './services/onboardingService';
import { BattlePassService } from './services/battlePassService';
import { PrestigeService } from './services/prestigeService';
import { HapticsService } from './services/hapticsService';
import { Storage } from './utils/storage';
import { BET_LEVELS, JACKPOT_CONTRIBUTION } from './utils/gameConfig';
import './App.css';

function App() {
  const [coins, setCoins] = useState(1000);
  const [isSpinning, setIsSpinning] = useState(false);
  const [selectedBet, setSelectedBet] = useState(0);
  const [jackpot, setJackpot] = useState(5000);
  const [freeSpins, setFreeSpins] = useState(0);
  const [dailyReward, setDailyReward] = useState({ available: false, streak: 0 });
  const [achievements, setAchievements] = useState([]);
  const [showAchievements, setShowAchievements] = useState(false);
  const [showLeaderboard, setShowLeaderboard] = useState(false);
  const [showShop, setShowShop] = useState(false);
  const [showSocial, setShowSocial] = useState(false);
  const [showTournament, setShowTournament] = useState(false);
  const [showGuild, setShowGuild] = useState(false);
  const [showSettings, setShowSettings] = useState(false);
  const [showTutorial, setShowTutorial] = useState(false);
  const [showHelp, setShowHelp] = useState(false);
  const [showMachines, setShowMachines] = useState(false);
  const [showMiniGames, setShowMiniGames] = useState(false);
  const [showStoryMode, setShowStoryMode] = useState(false);
  const [showBattlePass, setShowBattlePass] = useState(false);
  const [currentMachine, setCurrentMachine] = useState('classic');
  const [activeTournament, setActiveTournament] = useState(null);
  const [level, setLevel] = useState(1);
  const [xp, setXP] = useState(0);
  const [prestigeLevel, setPrestigeLevel] = useState(0);
  const [isVIP, setIsVIP] = useState(false);
  const [bannerVisible, setBannerVisible] = useState(false);

  useEffect(() => {
    ThemeService.applyTheme(ThemeService.getCurrentTheme());
    ThemeService.applyDarkMode(ThemeService.isDarkMode());
    const a11ySettings = AccessibilityService.getSettings();
    AccessibilityService.applyScreenReader(a11ySettings.screenReader);
    AccessibilityService.applyColorblindMode(a11ySettings.colorblindMode);
    AccessibilityService.applyAnimationSpeed(a11ySettings.animationSpeed);
    
    AdService.initialize();
    PurchaseService.initialize();
    const savedCoins = Storage.load('coins', 1000);
    const savedJackpot = Storage.load('jackpot', 5000);
    const savedFreeSpins = Storage.load('freeSpins', 0);
    setCoins(savedCoins);
    setJackpot(savedJackpot);
    setFreeSpins(savedFreeSpins);
    setDailyReward(DailyRewardsService.checkDailyReward());
    setAchievements(AchievementService.getUnlocked());
    setLevel(LevelService.getLevel());
    setXP(LevelService.getXP());
    setPrestigeLevel(PrestigeService.getPrestigeLevel());
    setIsVIP(SubscriptionService.isSubscribed());
    setCurrentMachine(SlotMachineService.getCurrentMachine());
    
    if (!SubscriptionService.isSubscribed()) {
      AdService.showBannerAd();
      setBannerVisible(true);
    }
    
    const vipCoins = SubscriptionService.claimDailyCoins();
    if (vipCoins > 0) setCoins(c => c + vipCoins);

    const seasonReward = LeaderboardService.claimSeasonReward();
    if (seasonReward?.coins) {
      setCoins(c => c + seasonReward.coins);
    }
    
    if (!OnboardingService.hasCompletedTutorial()) {
      setShowTutorial(true);
    }
  }, []);

  useEffect(() => {
    Storage.save('coins', coins);
  }, [coins]);

  useEffect(() => {
    Storage.save('jackpot', jackpot);
  }, [jackpot]);

  useEffect(() => {
    Storage.save('freeSpins', freeSpins);
  }, [freeSpins]);

  const submitLeaderboardScores = (totalCoins) => {
    LeaderboardService.submitScore(totalCoins);
    LeaderboardService.submitSeasonScore(totalCoins);
  };

  const handleSpin = () => {
    const betAmount = BET_LEVELS[selectedBet].amount;
    const isFreeSpinActive = freeSpins > 0;
    
    if (!isFreeSpinActive && coins < betAmount) return;
    if (isSpinning) return;
    
    if (isFreeSpinActive) {
      setFreeSpins(freeSpins - 1);
    } else {
      setCoins(coins - betAmount);
      setJackpot(jackpot + Math.floor(betAmount * JACKPOT_CONTRIBUTION));
    }
    
    setIsSpinning(true);
  };

  const handleWin = ({ payout, isJackpot, jackpotWin }) => {
    const betAmount = BET_LEVELS[selectedBet].amount;
    const prestigeCoinMultiplier = PrestigeService.getCoinMultiplier();
    const prestigeXPMultiplier = PrestigeService.getXPMultiplier();
    const adjustedPayout = Math.floor(payout * prestigeCoinMultiplier);
    const progress = AchievementService.getProgress();
    
    if (isJackpot) {
      const totalWin = adjustedPayout + jackpotWin;
      setCoins(c => {
        const newCoins = c + totalWin;
        submitLeaderboardScores(newCoins);
        return newCoins;
      });
      setJackpot(5000);
      const newAchs = AchievementService.updateProgress({ jackpotWins: (progress.jackpotWins || 0) + 1 });
      handleNewAchievements(newAchs);
    } else if (adjustedPayout > 0) {
      setCoins(c => {
        const newCoins = c + adjustedPayout;
        submitLeaderboardScores(newCoins);
        return newCoins;
      });
      const newProgress = {
        wins: progress.wins + 1,
        winStreak: progress.winStreak + 1,
        biggestWin: Math.max(progress.biggestWin || 0, adjustedPayout)
      };
      const newAchs = AchievementService.updateProgress(newProgress);
      handleNewAchievements(newAchs);
    } else {
      AchievementService.updateProgress({ winStreak: 0 });
    }
    
    const progress2 = AchievementService.getProgress();
    const newProgress = {
      totalSpins: progress2.totalSpins + 1,
      highBets: betAmount >= 100 ? (progress2.highBets || 0) + 1 : progress2.highBets
    };
    const newAchs = AchievementService.updateProgress(newProgress);
    handleNewAchievements(newAchs);
    
    const spinXP = Math.max(1, Math.floor(10 * prestigeXPMultiplier));
    const { xp: newXP, level: newLevel, leveledUp } = LevelService.addXP(spinXP);
    setXP(newXP);
    setLevel(newLevel);
    BattlePassService.addXP(spinXP);
    if (leveledUp) {
      const perks = LevelService.getLevelPerks(newLevel);
      setCoins(c => {
        const newCoins = c + perks.bonusCoins;
        submitLeaderboardScores(newCoins);
        return newCoins;
      });
    }
    
    if (activeTournament) {
      TournamentService.updateScore(activeTournament, 'player', adjustedPayout);
    }
    
    GuildService.addXP(Math.floor(adjustedPayout / 10));
    
    if (!isVIP && AdService.shouldShowInterstitial()) {
      AdService.showInterstitialAd();
    }
    
    setIsSpinning(false);
  };

  const handleFreeSpinsWon = (amount) => {
    setFreeSpins(freeSpins + amount);
  };

  const handleWatchAd = async () => {
    const reward = await AdService.showRewardedAd();
    if (reward) {
      setCoins(c => {
        const newCoins = c + 100;
        submitLeaderboardScores(newCoins);
        return newCoins;
      });
    }
  };

  const handlePurchase = async (amount) => {
    const success = await PurchaseService.buyCoins(amount);
    if (success) {
      setCoins(c => {
        const newCoins = c + amount;
        submitLeaderboardScores(newCoins);
        return newCoins;
      });
    }
  };

  const handleClaimDaily = () => {
    const { coins: reward, streak } = DailyRewardsService.claimDailyReward();
    setCoins(c => {
      const newCoins = c + reward;
      submitLeaderboardScores(newCoins);
      return newCoins;
    });
    setDailyReward({ available: false, streak });
  };

  const handleNewAchievements = (newAchs) => {
    newAchs.forEach(ach => {
      if (ach) {
        setCoins(c => {
          const newCoins = c + ach.reward;
          submitLeaderboardScores(newCoins);
          return newCoins;
        });
        setAchievements(prev => [...prev, ach.id]);
      }
    });
  };

  const handleShopPurchase = async (item) => {
    if (item.type === 'coins') {
      const success = await PurchaseService.buyCoins(item.amount);
      if (success) {
        const eventMultiplier = EventService.getEventMultiplier();
        setCoins(c => {
          const newCoins = c + Math.floor(item.amount * eventMultiplier);
          submitLeaderboardScores(newCoins);
          return newCoins;
        });
      }
    } else if (item.type === 'booster') {
      const success = await PurchaseService.buyBundle(item.id);
      if (success) {
        Storage.save('active_booster', {
          multiplier: item.multiplier,
          expiresAt: Date.now() + item.duration * 60 * 1000
        });
      }
    }
  };

  const handlePrestige = () => {
    const result = PrestigeService.prestige(level, coins);
    if (!result.success) return;

    setCoins(c => {
      const newCoins = c + result.bonusCoins;
      submitLeaderboardScores(newCoins);
      return newCoins;
    });
    setLevel(1);
    setXP(0);
    setPrestigeLevel(result.newPrestigeLevel);
  };

  const handleSubscribe = async (type) => {
    const success = await SubscriptionService.subscribe(type);
    if (success) {
      setIsVIP(true);
      if (bannerVisible) {
        AdService.hideBannerAd();
        setBannerVisible(false);
      }
    }
  };

  const betAmount = BET_LEVELS[selectedBet].amount;
  const betMultiplier = BET_LEVELS[selectedBet].multiplier;
  const openPanel = (setter) => {
    HapticsService.menuNavigate();
    setter(true);
  };

  return (
    <div className="App">
      <div id="a11y-announcer" role="status" aria-live="polite" aria-atomic="true" style={{ position: 'absolute', left: '-10000px', width: '1px', height: '1px', overflow: 'hidden' }}></div>
      <header className="app-header">
        <h1>🎰 Slot Machine</h1>
        <div className="title-block">
        <div className="stats">
          <div className="coins">
            💰 {coins} Coins
            {prestigeLevel > 0 && (
              <span className="prestige-badge" style={{ color: PrestigeService.getPrestigeColor() }}>
                {PrestigeService.getPrestigeBadge()}
              </span>
            )}
          </div>
          <div className="jackpot">💎 Jackpot: {jackpot}</div>
        </div>
        </div>
        <nav className="menu-buttons" aria-label="Game panels">
          <Tooltip feature="shop" message="Buy coins and boosters here!" position="bottom">
            <button onClick={() => openPanel(setShowShop)} aria-label="Shop">🛒</button>
          </Tooltip>
          <Tooltip feature="achievements" message="Unlock badges to earn bonus coins!" position="bottom">
            <button onClick={() => openPanel(setShowAchievements)} aria-label="Achievements">🏆</button>
          </Tooltip>
          <button onClick={() => openPanel(setShowLeaderboard)} aria-label="Leaderboard">📊</button>
          <button onClick={() => openPanel(setShowSocial)} aria-label="Social">👥</button>
          <button onClick={() => openPanel(setShowTournament)} aria-label="Tournament">🎯</button>
          <button onClick={() => openPanel(setShowGuild)} aria-label="Guild">🛡️</button>
          <button onClick={() => openPanel(setShowMachines)} aria-label="Machines">🎰</button>
          <button onClick={() => openPanel(setShowMiniGames)} aria-label="Mini Games">🎮</button>
          <button onClick={() => openPanel(setShowStoryMode)} aria-label="Story Mode">📖</button>
          <button onClick={() => openPanel(setShowBattlePass)} aria-label="Battle Pass">🎖️</button>
          {level >= PrestigeService.getMaxLevel() && (
            <button onClick={handlePrestige} aria-label="Prestige" className="prestige-btn">⭐</button>
          )}
          <button onClick={() => openPanel(setShowSettings)} aria-label="Settings">⚙️</button>
        </nav>
      </header>
      <LevelDisplay level={level} xp={xp} xpForNext={LevelService.xpForLevel(level)} />
      <EventBanner />
      <DailyRewards 
        onClaim={handleClaimDaily}
        available={dailyReward.available}
        streak={dailyReward.streak}
      />
      <BetSelector 
        selectedBet={selectedBet}
        onBetChange={setSelectedBet}
        coins={coins}
      />
      <SlotMachine 
        isSpinning={isSpinning} 
        onComplete={handleWin}
        betMultiplier={betMultiplier}
        jackpot={jackpot}
        freeSpins={freeSpins}
        onFreeSpinsWon={handleFreeSpinsWon}
      />
      <Controls 
        coins={coins}
        betAmount={betAmount}
        isSpinning={isSpinning}
        onSpin={handleSpin}
        onWatchAd={handleWatchAd}
        onPurchase={handlePurchase}
        freeSpins={freeSpins}
      />
      {showAchievements && (
        <Achievements 
          unlocked={achievements}
          onClose={() => setShowAchievements(false)}
        />
      )}
      {showLeaderboard && (
        <Leaderboard 
          allTime={LeaderboardService.getAllTime()}
          coins={coins}
          currentRank={LeaderboardService.getCurrentRank(coins)}
          onClose={() => setShowLeaderboard(false)}
        />
      )}
      {showShop && (
        <Shop 
          onClose={() => setShowShop(false)}
          onPurchase={handleShopPurchase}
          onSubscribe={handleSubscribe}
        />
      )}
      {showSocial && (
        <Social 
          onClose={() => setShowSocial(false)}
          onCoinsReceived={(amount) => setCoins(coins + amount)}
        />
      )}
      {showTournament && (
        <Tournament 
          onClose={() => setShowTournament(false)}
          onJoin={(tournamentId, fee) => {
            setCoins(coins - fee);
            setActiveTournament(tournamentId);
          }}
          coins={coins}
        />
      )}
      {showGuild && (
        <Guild 
          onClose={() => setShowGuild(false)}
        />
      )}
      {showSettings && (
        <Settings 
          onClose={() => setShowSettings(false)}
          onOpenHelp={() => { setShowSettings(false); setShowHelp(true); }}
        />
      )}
      {showTutorial && (
        <Tutorial 
          onComplete={() => setShowTutorial(false)}
        />
      )}
      {showHelp && (
        <Help 
          onClose={() => setShowHelp(false)}
        />
      )}
      {showMachines && (
        <MachineSelector 
          onClose={() => setShowMachines(false)}
          currentMachine={currentMachine}
          playerLevel={level}
          coins={coins}
          onSelect={(machineId) => {
            setCurrentMachine(machineId);
            SlotMachineService.setCurrentMachine(machineId);
          }}
          onUpgrade={(machineId, cost) => {
            if (SlotMachineService.upgradeMachine(machineId, cost)) {
              setCoins(coins - cost);
            }
          }}
        />
      )}
      {showMiniGames && (
        <MiniGames 
          onClose={() => setShowMiniGames(false)}
          onWin={(amount) => setCoins(coins + amount)}
        />
      )}
      {showStoryMode && (
        <StoryMode 
          onClose={() => setShowStoryMode(false)}
          onBattleSpin={(handleDamage) => {
            // Trigger a spin and pass damage based on win
            handleSpin();
            // In real implementation, damage would be calculated from spin result
          }}
          coins={coins}
        />
      )}
      {showBattlePass && (
        <BattlePass
          onClose={() => setShowBattlePass(false)}
          onPurchasePremium={async () => {
            const success = await PurchaseService.buyBundle('battle_pass_premium');
            if (success) {
              BattlePassService.purchasePremium();
            }
          }}
          onRewardClaimed={(reward) => {
            if (!reward?.coins) return;
            setCoins(c => {
              const newCoins = c + reward.coins;
              submitLeaderboardScores(newCoins);
              return newCoins;
            });
          }}
        />
      )}
    </div>
  );
}

export default App;
