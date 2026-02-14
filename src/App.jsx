import React, { useState, useEffect, useMemo, useCallback, lazy, Suspense } from 'react';
import SlotMachine from './components/SlotMachine';
import Controls from './components/Controls';
import BetSelector from './components/BetSelector';
import DailyRewards from './components/DailyRewards';
import LevelDisplay from './components/LevelDisplay';
import EventBanner from './components/EventBanner';
import Tooltip from './components/Tooltip';
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
import { BackendService } from './services/backendService';
import { SecurityService } from './services/securityService';
import { Storage } from './utils/storage';
import { useGameStore } from './store/gameStore';
import { BET_LEVELS, JACKPOT_CONTRIBUTION } from './utils/gameConfig';
import './App.css';

const SPIN_RATE_LIMIT_PER_MINUTE = parseInt(process.env.REACT_APP_SPIN_RATE_LIMIT_PER_MINUTE || '60', 10);
const MAX_LOCAL_COIN_DELTA = parseInt(process.env.REACT_APP_MAX_LOCAL_COIN_DELTA || '100000', 10);
const Achievements = lazy(() => import('./components/Achievements'));
const Leaderboard = lazy(() => import('./components/Leaderboard'));
const Shop = lazy(() => import('./components/Shop'));
const Social = lazy(() => import('./components/Social'));
const Tournament = lazy(() => import('./components/Tournament'));
const Guild = lazy(() => import('./components/Guild'));
const Settings = lazy(() => import('./components/Settings'));
const Tutorial = lazy(() => import('./components/Tutorial'));
const Help = lazy(() => import('./components/Help'));
const MachineSelector = lazy(() => import('./components/MachineSelector'));
const MiniGames = lazy(() => import('./components/MiniGames'));
const StoryMode = lazy(() => import('./components/StoryMode'));
const BattlePass = lazy(() => import('./components/BattlePass'));

function App() {
  const coins = useGameStore((state) => state.coins);
  const setCoins = useGameStore((state) => state.setCoins);
  const isSpinning = useGameStore((state) => state.isSpinning);
  const setIsSpinning = useGameStore((state) => state.setIsSpinning);
  const selectedBet = useGameStore((state) => state.selectedBet);
  const setSelectedBet = useGameStore((state) => state.setSelectedBet);
  const jackpot = useGameStore((state) => state.jackpot);
  const setJackpot = useGameStore((state) => state.setJackpot);
  const freeSpins = useGameStore((state) => state.freeSpins);
  const setFreeSpins = useGameStore((state) => state.setFreeSpins);
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
  const currentMachine = useGameStore((state) => state.currentMachine);
  const setCurrentMachine = useGameStore((state) => state.setCurrentMachine);
  const [activeTournament, setActiveTournament] = useState(null);
  const level = useGameStore((state) => state.level);
  const setLevel = useGameStore((state) => state.setLevel);
  const xp = useGameStore((state) => state.xp);
  const setXP = useGameStore((state) => state.setXP);
  const prestigeLevel = useGameStore((state) => state.prestigeLevel);
  const setPrestigeLevel = useGameStore((state) => state.setPrestigeLevel);
  const isVIP = useGameStore((state) => state.isVIP);
  const setIsVIP = useGameStore((state) => state.setIsVIP);
  const [bannerVisible, setBannerVisible] = useState(false);
  const [serviceError, setServiceError] = useState(null);

  useEffect(() => {
    const onServiceError = (event) => {
      const detail = event?.detail;
      if (!detail?.message) return;
      setServiceError(detail.message);
    };

    window.addEventListener('app:error', onServiceError);
    return () => window.removeEventListener('app:error', onServiceError);
  }, []);

  useEffect(() => {
    ThemeService.applyTheme(ThemeService.getCurrentTheme());
    ThemeService.applyDarkMode(ThemeService.isDarkMode());
    const a11ySettings = AccessibilityService.getSettings();
    AccessibilityService.applyScreenReader(a11ySettings.screenReader);
    AccessibilityService.applyColorblindMode(a11ySettings.colorblindMode);
    AccessibilityService.applyAnimationSpeed(a11ySettings.animationSpeed);
    
    AdService.initialize();
    PurchaseService.initialize();
    BackendService.initialize();
    const savedCoins = SecurityService.loadSecure('coins_secure', Storage.load('coins', 1000));
    const savedJackpot = SecurityService.loadSecure('jackpot_secure', Storage.load('jackpot', 5000));
    const savedFreeSpins = SecurityService.loadSecure('freeSpins_secure', Storage.load('freeSpins', 0));
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
    SecurityService.saveSecure('coins_secure', coins);
  }, [coins]);

  useEffect(() => {
    Storage.save('jackpot', jackpot);
    SecurityService.saveSecure('jackpot_secure', jackpot);
  }, [jackpot]);

  useEffect(() => {
    Storage.save('freeSpins', freeSpins);
    SecurityService.saveSecure('freeSpins_secure', freeSpins);
  }, [freeSpins]);

  const submitLeaderboardScores = useCallback((totalCoins) => {
    LeaderboardService.submitScore(totalCoins);
    LeaderboardService.submitSeasonScore(totalCoins);
    LeaderboardService.submitScoreOnline(null, totalCoins);
  }, []);

  const safeAddCoins = useCallback((delta, reason = 'coins_update', maxGain = MAX_LOCAL_COIN_DELTA) => {
    setCoins((currentCoins) => {
      const newCoins = currentCoins + delta;
      if (SecurityService.detectCheat(newCoins, currentCoins, maxGain)) {
        SecurityService.trackAnomaly('blocked_coin_update', {
          reason,
          delta,
          currentCoins,
          attemptedCoins: newCoins
        });
        return currentCoins;
      }
      submitLeaderboardScores(newCoins);
      return newCoins;
    });
  }, [setCoins, submitLeaderboardScores]);

  const handleSpin = useCallback(() => {
    const betAmount = BET_LEVELS[selectedBet].amount;
    const isFreeSpinActive = freeSpins > 0;
    
    if (!isFreeSpinActive && coins < betAmount) return;
    if (isSpinning) return;
    if (!SecurityService.checkRateLimit('spin', SPIN_RATE_LIMIT_PER_MINUTE, 60 * 1000)) {
      SecurityService.trackAnomaly('spin_rate_limit_block', {
        at: Date.now(),
        limit: SPIN_RATE_LIMIT_PER_MINUTE
      });
      return;
    }
    
    if (isFreeSpinActive) {
      setFreeSpins(freeSpins - 1);
    } else {
      setCoins(coins - betAmount);
      setJackpot(jackpot + Math.floor(betAmount * JACKPOT_CONTRIBUTION));
    }
    
    setIsSpinning(true);
  }, [selectedBet, freeSpins, coins, isSpinning, setFreeSpins, setCoins, setJackpot, jackpot, setIsSpinning]);

  const betMultiplier = useMemo(() => BET_LEVELS[selectedBet].multiplier, [selectedBet]);

  const handleWin = useCallback(async ({ payout, isJackpot, jackpotWin, reels, multiplier: spinMultiplier, machineId }) => {
    const betAmount = BET_LEVELS[selectedBet].amount;
    const prestigeCoinMultiplier = PrestigeService.getCoinMultiplier();
    const prestigeXPMultiplier = PrestigeService.getXPMultiplier();
    const validation = await BackendService.validateSpin({
      machineId: machineId || currentMachine,
      reels,
      payout,
      isJackpot,
      jackpotWin,
      betAmount,
      betMultiplier,
      spinMultiplier,
      timestamp: Date.now()
    });

    if (validation?.valid === false) {
      console.warn('Spin rejected by backend validation');
      setIsSpinning(false);
      return;
    }

    const validatedPayout = Number.isFinite(validation?.payout) ? validation.payout : payout;
    const validatedJackpotWin = Number.isFinite(validation?.jackpotWin) ? validation.jackpotWin : jackpotWin;
    const adjustedPayout = Math.floor(validatedPayout * prestigeCoinMultiplier);
    const progress = AchievementService.getProgress();
    
    if (isJackpot) {
      const totalWin = adjustedPayout + validatedJackpotWin;
      safeAddCoins(totalWin, 'jackpot_win', Math.max(MAX_LOCAL_COIN_DELTA, betAmount * 5000));
      setJackpot(5000);
      const newAchs = AchievementService.updateProgress({ jackpotWins: (progress.jackpotWins || 0) + 1 });
      handleNewAchievements(newAchs);
    } else if (adjustedPayout > 0) {
      safeAddCoins(adjustedPayout, 'spin_win', Math.max(MAX_LOCAL_COIN_DELTA, betAmount * 3000));
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
      safeAddCoins(perks.bonusCoins, 'level_up_bonus', Math.max(MAX_LOCAL_COIN_DELTA, perks.bonusCoins + 1000));
    }
    
    if (activeTournament) {
      TournamentService.updateScore(activeTournament, 'player', adjustedPayout);
    }
    
    GuildService.addXP(Math.floor(adjustedPayout / 10));
    
    if (!isVIP && AdService.shouldShowInterstitial()) {
      AdService.showInterstitialAd();
    }
    
    setIsSpinning(false);
  }, [selectedBet, currentMachine, betMultiplier, safeAddCoins, activeTournament, isVIP, setXP, setLevel, setJackpot, setIsSpinning]);

  const handleFreeSpinsWon = useCallback((amount) => {
    setFreeSpins((current) => current + amount);
  }, [setFreeSpins]);

  const handleWatchAd = useCallback(async () => {
    const reward = await AdService.showRewardedAd();
    if (reward) {
      safeAddCoins(100, 'ad_reward');
    }
  }, [safeAddCoins]);

  const handlePurchase = useCallback(async (amount) => {
    const success = await PurchaseService.buyCoins(amount);
    if (success) {
      safeAddCoins(amount, 'direct_purchase', Math.max(MAX_LOCAL_COIN_DELTA, amount + 5000));
    }
  }, [safeAddCoins]);

  const handleClaimDaily = useCallback(() => {
    const { coins: reward, streak } = DailyRewardsService.claimDailyReward();
    safeAddCoins(reward, 'daily_reward');
    setDailyReward({ available: false, streak });
  }, [safeAddCoins]);

  const handleNewAchievements = useCallback((newAchs) => {
    newAchs.forEach(ach => {
      if (ach) {
        safeAddCoins(ach.reward, 'achievement_reward');
        setAchievements(prev => [...prev, ach.id]);
      }
    });
  }, [safeAddCoins]);

  const handleShopPurchase = useCallback(async (item) => {
    if (item.type === 'coins') {
      const success = await PurchaseService.buyCoins(item.amount);
      if (success) {
        const eventMultiplier = EventService.getEventMultiplier();
        safeAddCoins(Math.floor(item.amount * eventMultiplier), 'shop_purchase_reward', Math.max(MAX_LOCAL_COIN_DELTA, item.amount * 3));
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
  }, [safeAddCoins]);

  const handlePrestige = useCallback(() => {
    const result = PrestigeService.prestige(level, coins);
    if (!result.success) return;

    setCoins(c => {
      const newCoins = c + result.bonusCoins;
      if (SecurityService.detectCheat(newCoins, c, Math.max(MAX_LOCAL_COIN_DELTA, result.bonusCoins + 10000))) {
        SecurityService.trackAnomaly('blocked_prestige_reward', { currentCoins: c, attemptedCoins: newCoins });
        return c;
      }
      submitLeaderboardScores(newCoins);
      return newCoins;
    });
    setLevel(1);
    setXP(0);
    setPrestigeLevel(result.newPrestigeLevel);
  }, [coins, level, setCoins, setLevel, setXP, setPrestigeLevel, submitLeaderboardScores]);

  const handleSubscribe = useCallback(async (type) => {
    const success = await SubscriptionService.subscribe(type);
    if (success) {
      setIsVIP(true);
      if (bannerVisible) {
        AdService.hideBannerAd();
        setBannerVisible(false);
      }
    }
  }, [bannerVisible, setIsVIP]);

  const openPanel = useCallback((setter) => {
    HapticsService.menuNavigate();
    setter(true);
  }, []);

  const panelFallback = <div className="panel-loading">Loading...</div>;

  return (
    <div className="App">
      {serviceError && (
        <div className="service-error-banner" role="alert">
          <span>{serviceError}</span>
          <button onClick={() => setServiceError(null)} aria-label="Dismiss error">Dismiss</button>
        </div>
      )}
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
      <LevelDisplay />
      <EventBanner />
      <DailyRewards 
        onClaim={handleClaimDaily}
        available={dailyReward.available}
        streak={dailyReward.streak}
      />
      <BetSelector />
      <SlotMachine 
        isSpinning={isSpinning} 
        onComplete={handleWin}
        betMultiplier={betMultiplier}
        jackpot={jackpot}
        freeSpins={freeSpins}
        onFreeSpinsWon={handleFreeSpinsWon}
        currentMachine={currentMachine}
      />
      <Controls 
        onSpin={handleSpin}
        onWatchAd={handleWatchAd}
        onPurchase={handlePurchase}
      />
      <Suspense fallback={panelFallback}>
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
            onCoinsReceived={(amount) => setCoins((current) => current + amount)}
          />
        )}
        {showTournament && (
          <Tournament 
            onClose={() => setShowTournament(false)}
            onJoin={(tournamentId, fee) => {
              setCoins((current) => current - fee);
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
            onSelect={(machineId) => {
              setCurrentMachine(machineId);
              SlotMachineService.setCurrentMachine(machineId);
            }}
            onUpgrade={(machineId, cost) => {
              if (SlotMachineService.upgradeMachine(machineId, cost)) {
                setCoins((current) => current - cost);
              }
            }}
          />
        )}
        {showMiniGames && (
          <MiniGames 
            onClose={() => setShowMiniGames(false)}
            onWin={(amount) => setCoins((current) => current + amount)}
          />
        )}
        {showStoryMode && (
          <StoryMode 
            onClose={() => setShowStoryMode(false)}
            onBattleSpin={(handleDamage) => {
              // Trigger a spin and pass damage based on win
              handleSpin();
              // In real implementation, damage would be calculated from spin result.
              if (typeof handleDamage === 'function') {
                handleDamage(0);
              }
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
              safeAddCoins(reward.coins, 'battle_pass_reward');
            }}
          />
        )}
      </Suspense>
    </div>
  );
}

export default App;
