import React, { useEffect, useState } from 'react';
import { LeaderboardService } from '../services/leaderboardService';
import './Leaderboard.css';

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

  const rankToShow = tab === 'season'
    ? LeaderboardService.getSeasonRank(coins)
    : tab === 'friends'
      ? friendBoard.findIndex(entry => entry.id === 'player') + 1
      : currentRank;

  return (
    <div className="leaderboard-modal">
      <div className="leaderboard-content">
        <h2>Leaderboard</h2>
        <div className="tabs">
          <button className={tab === 'allTime' ? 'active' : ''} onClick={() => setTab('allTime')}>All Time</button>
          <button className={tab === 'friends' ? 'active' : ''} onClick={() => setTab('friends')}>Friends</button>
          <button className={tab === 'season' ? 'active' : ''} onClick={() => setTab('season')}>Season</button>
        </div>
        {tab === 'season' && seasonInfo && (
          <div className="season-info">
            <div>Season {seasonInfo.number}</div>
            <div>Time Remaining: {formatTime(LeaderboardService.getSeasonTimeRemaining())}</div>
          </div>
        )}
        <div className="rank-list">
          {data.map((entry, i) => (
            <div key={entry.id || i} className="rank-item">
              <span className="rank-pos">{i + 1}</span>
              {entry.name && <span className="rank-name">{entry.name}</span>}
              <span className="rank-coins">{entry.coins}</span>
            </div>
          ))}
          {data.length === 0 && (
            <div className="empty-state">No entries yet.</div>
          )}
        </div>
        <div className="current-rank">Your Rank: #{rankToShow > 0 ? rankToShow : '-'}</div>
        <button onClick={onClose} className="close-btn">Close</button>
      </div>
    </div>
  );
};

export default Leaderboard;
