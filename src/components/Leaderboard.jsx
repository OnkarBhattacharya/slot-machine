import React, { useEffect, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { LeaderboardService } from '../services/leaderboardService';
import { HapticsService } from '../services/hapticsService';
import './Leaderboard.css';

const listContainerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.055,
      delayChildren: 0.08
    }
  }
};

const listItemVariants = {
  hidden: { opacity: 0, x: -14 },
  visible: { opacity: 1, x: 0 }
};

const Leaderboard = ({ allTime, coins, currentRank, onClose }) => {
  const [tab, setTab] = useState('allTime');
  const [friendBoard, setFriendBoard] = useState([]);
  const [seasonBoard, setSeasonBoard] = useState([]);
  const [seasonInfo, setSeasonInfo] = useState(null);

  useEffect(() => {
    setFriendBoard(LeaderboardService.getFriendLeaderboard());
    setSeasonBoard(LeaderboardService.getSeasonLeaderboard());
    setSeasonInfo(LeaderboardService.getCurrentSeason());
  }, []);

  const data = tab === 'allTime' ? allTime : tab === 'friends' ? friendBoard : seasonBoard;

  const formatTime = (ms) => {
    const days = Math.floor(ms / (24 * 60 * 60 * 1000));
    const hours = Math.floor((ms % (24 * 60 * 60 * 1000)) / (60 * 60 * 1000));
    return `${days}d ${hours}h`;
  };

  const rankToShow =
    tab === 'season'
      ? LeaderboardService.getSeasonRank(coins)
      : tab === 'friends'
        ? friendBoard.findIndex((entry) => entry.id === 'player') + 1
        : currentRank;

  const switchTab = (nextTab) => {
    setTab(nextTab);
    HapticsService.menuNavigate();
  };

  return (
    <div className="leaderboard-modal">
      <motion.div
        className="leaderboard-content"
        initial={{ opacity: 0, scale: 0.96, y: 14 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        transition={{ duration: 0.22 }}
      >
        <h2>Leaderboard</h2>
        <div className="tabs">
          <motion.button className={tab === 'allTime' ? 'active' : ''} onClick={() => switchTab('allTime')} whileTap={{ scale: 0.98 }}>
            All Time
          </motion.button>
          <motion.button className={tab === 'friends' ? 'active' : ''} onClick={() => switchTab('friends')} whileTap={{ scale: 0.98 }}>
            Friends
          </motion.button>
          <motion.button className={tab === 'season' ? 'active' : ''} onClick={() => switchTab('season')} whileTap={{ scale: 0.98 }}>
            Season
          </motion.button>
        </div>
        {tab === 'season' && seasonInfo && (
          <div className="season-info">
            <div>Season {seasonInfo.number}</div>
            <div>Time Remaining: {formatTime(LeaderboardService.getSeasonTimeRemaining())}</div>
          </div>
        )}
        <div className="rank-list">
          <AnimatePresence mode="wait">
            <motion.div
              key={tab}
              variants={listContainerVariants}
              initial="hidden"
              animate="visible"
              exit={{ opacity: 0 }}
            >
              {data.map((entry, i) => (
                <motion.div key={entry.id || i} className="rank-item" variants={listItemVariants}>
                  <span className="rank-pos">{i + 1}</span>
                  {entry.name && <span className="rank-name">{entry.name}</span>}
                  <span className="rank-coins">{entry.coins}</span>
                </motion.div>
              ))}
              {data.length === 0 && <div className="empty-state">No entries yet.</div>}
            </motion.div>
          </AnimatePresence>
        </div>
        <div className="current-rank">Your Rank: #{rankToShow > 0 ? rankToShow : '-'}</div>
        <motion.button onClick={onClose} className="close-btn" whileTap={{ scale: 0.985 }}>
          Close
        </motion.button>
      </motion.div>
    </div>
  );
};

export default Leaderboard;
