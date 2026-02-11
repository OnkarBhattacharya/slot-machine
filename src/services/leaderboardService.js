import { Storage } from '../utils/storage';

export const LeaderboardService = {
  apiEndpoint: process.env.REACT_APP_API_ENDPOINT || 'https://api.example.com',
  
  submitScore: (coins) => {
    const scores = Storage.load('leaderboard', []);
    const timestamp = Date.now();
    scores.push({ coins, timestamp });
    scores.sort((a, b) => b.coins - a.coins);
    Storage.save('leaderboard', scores.slice(0, 100));
  },

  async submitScoreOnline(userId, coins) {
    try {
      const response = await fetch(`${this.apiEndpoint}/leaderboard/submit`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId, coins, timestamp: Date.now() })
      });
      return response.ok;
    } catch (error) {
      console.error('Failed to submit score online:', error);
      return false;
    }
  },

  async fetchOnlineLeaderboard(period = 'all') {
    try {
      const response = await fetch(`${this.apiEndpoint}/leaderboard/${period}`);
      if (response.ok) {
        return await response.json();
      }
    } catch (error) {
      console.error('Failed to fetch online leaderboard:', error);
    }
    return null;
  },

  getDaily: () => {
    const scores = Storage.load('leaderboard', []);
    const oneDayAgo = Date.now() - 24 * 60 * 60 * 1000;
    return scores.filter(s => s.timestamp >= oneDayAgo).slice(0, 10);
  },

  getWeekly: () => {
    const scores = Storage.load('leaderboard', []);
    const oneWeekAgo = Date.now() - 7 * 24 * 60 * 60 * 1000;
    return scores.filter(s => s.timestamp >= oneWeekAgo).slice(0, 10);
  },

  getAllTime: () => {
    return Storage.load('leaderboard', []).slice(0, 10);
  },

  getCurrentRank: (coins) => {
    const scores = Storage.load('leaderboard', []);
    return scores.findIndex(s => s.coins <= coins) + 1 || scores.length + 1;
  },

  // Friend Leaderboards
  getFriendLeaderboard: () => {
    const friends = Storage.load('friends', []);
    const playerScore = { id: 'player', coins: Storage.load('coins', 0), name: 'You' };
    
    const friendScores = friends.map(friend => ({
      id: friend.id,
      name: friend.name,
      coins: Storage.load(`friend_${friend.id}_coins`, Math.floor(Math.random() * 10000))
    }));
    
    const allScores = [playerScore, ...friendScores];
    return allScores.sort((a, b) => b.coins - a.coins).slice(0, 20);
  },

  // Seasonal Competitions
  getCurrentSeason: () => {
    const seasons = Storage.load('seasons', []);
    const now = Date.now();
    
    let currentSeason = seasons.find(s => s.startTime <= now && s.endTime > now);
    
    if (!currentSeason) {
      currentSeason = LeaderboardService.createNewSeason();
    }
    
    return currentSeason;
  },

  createNewSeason: () => {
    const seasons = Storage.load('seasons', []);
    const seasonNumber = seasons.length + 1;
    const now = Date.now();
    const duration = 30 * 24 * 60 * 60 * 1000; // 30 days
    
    const newSeason = {
      id: `season_${seasonNumber}`,
      number: seasonNumber,
      startTime: now,
      endTime: now + duration,
      leaderboard: [],
      rewards: LeaderboardService.getSeasonRewards(seasonNumber)
    };
    
    seasons.push(newSeason);
    Storage.save('seasons', seasons);
    return newSeason;
  },

  getSeasonRewards: (seasonNumber) => {
    return [
      { rank: 1, coins: 50000, badge: '🥇 Champion', exclusive: 'golden_crown' },
      { rank: 2, coins: 30000, badge: '🥈 Runner-up', exclusive: 'silver_crown' },
      { rank: 3, coins: 20000, badge: '🥉 Third Place', exclusive: 'bronze_crown' },
      { rank: '4-10', coins: 10000, badge: '⭐ Top 10' },
      { rank: '11-50', coins: 5000, badge: '🌟 Top 50' },
      { rank: '51-100', coins: 2000, badge: '✨ Top 100' }
    ];
  },

  submitSeasonScore: (coins) => {
    const season = LeaderboardService.getCurrentSeason();
    const playerId = 'player';
    
    const existingEntry = season.leaderboard.find(e => e.id === playerId);
    
    if (existingEntry) {
      existingEntry.coins = Math.max(existingEntry.coins, coins);
      existingEntry.lastUpdate = Date.now();
    } else {
      season.leaderboard.push({
        id: playerId,
        coins,
        timestamp: Date.now(),
        lastUpdate: Date.now()
      });
    }
    
    season.leaderboard.sort((a, b) => b.coins - a.coins);
    
    const seasons = Storage.load('seasons', []);
    const seasonIndex = seasons.findIndex(s => s.id === season.id);
    seasons[seasonIndex] = season;
    Storage.save('seasons', seasons);
  },

  getSeasonLeaderboard: () => {
    const season = LeaderboardService.getCurrentSeason();
    return season.leaderboard.slice(0, 100);
  },

  getSeasonRank: (coins) => {
    const season = LeaderboardService.getCurrentSeason();
    return season.leaderboard.findIndex(e => e.coins <= coins) + 1 || season.leaderboard.length + 1;
  },

  getSeasonTimeRemaining: () => {
    const season = LeaderboardService.getCurrentSeason();
    return Math.max(0, season.endTime - Date.now());
  },

  claimSeasonReward: () => {
    const seasons = Storage.load('seasons', []);
    const completedSeasons = seasons.filter(s => s.endTime < Date.now() && !s.rewardClaimed);
    
    if (completedSeasons.length === 0) return null;
    
    const lastSeason = completedSeasons[completedSeasons.length - 1];
    const playerEntry = lastSeason.leaderboard.find(e => e.id === 'player');
    
    if (!playerEntry) return null;
    
    const rank = lastSeason.leaderboard.indexOf(playerEntry) + 1;
    let reward = null;
    
    for (const r of lastSeason.rewards) {
      if (typeof r.rank === 'number' && rank === r.rank) {
        reward = r;
        break;
      } else if (typeof r.rank === 'string' && r.rank.includes('-')) {
        const [min, max] = r.rank.split('-').map(n => parseInt(n));
        if (rank >= min && rank <= max) {
          reward = r;
          break;
        }
      }
    }
    
    if (reward) {
      lastSeason.rewardClaimed = true;
      const seasonIndex = seasons.findIndex(s => s.id === lastSeason.id);
      seasons[seasonIndex] = lastSeason;
      Storage.save('seasons', seasons);
    }
    
    return reward;
  },

  // Top Player Rewards
  getDailyRewards: () => {
    return [
      { rank: 1, coins: 5000, badge: '👑 Daily King' },
      { rank: 2, coins: 3000, badge: '🏆 Daily Champion' },
      { rank: 3, coins: 2000, badge: '🥇 Daily Winner' },
      { rank: '4-10', coins: 1000, badge: '⭐ Daily Star' }
    ];
  },

  claimDailyReward: () => {
    const lastClaim = Storage.load('last_daily_reward_claim', 0);
    const now = Date.now();
    const oneDayAgo = now - 24 * 60 * 60 * 1000;
    
    if (lastClaim > oneDayAgo) {
      return { success: false, error: 'Already claimed today' };
    }
    
    const daily = LeaderboardService.getDaily();
    const playerCoins = Storage.load('coins', 0);
    const rank = daily.findIndex(s => s.coins <= playerCoins) + 1;
    
    const rewards = LeaderboardService.getDailyRewards();
    let reward = null;
    
    for (const r of rewards) {
      if (typeof r.rank === 'number' && rank === r.rank) {
        reward = r;
        break;
      } else if (typeof r.rank === 'string' && r.rank.includes('-')) {
        const [min, max] = r.rank.split('-').map(n => parseInt(n));
        if (rank >= min && rank <= max) {
          reward = r;
          break;
        }
      }
    }
    
    if (reward) {
      Storage.save('last_daily_reward_claim', now);
      return { success: true, reward };
    }
    
    return { success: false, error: 'Not in top ranks' };
  }
};
