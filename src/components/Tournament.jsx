import React, { useState, useEffect } from 'react';
import { TournamentService } from '../services/tournamentService';
import './Tournament.css';

const Tournament = ({ onClose, onJoin, coins }) => {
  const [tournaments, setTournaments] = useState([]);
  const [selectedTournament, setSelectedTournament] = useState(null);
  const [leaderboard, setLeaderboard] = useState([]);

  useEffect(() => {
    loadTournaments();
    const interval = setInterval(loadTournaments, 5000);
    return () => clearInterval(interval);
  }, []);

  const loadTournaments = () => {
    const active = TournamentService.getActiveTournaments();
    setTournaments(active);
  };

  const handleJoin = (tournament) => {
    if (coins < tournament.entryFee) {
      alert('Not enough coins!');
      return;
    }
    
    const result = TournamentService.joinTournament(tournament.id, 'player', tournament.entryFee);
    if (result.success) {
      onJoin(tournament.id, tournament.entryFee);
      alert('Joined tournament!');
      loadTournaments();
    } else {
      alert(result.error);
    }
  };

  const handleViewLeaderboard = (tournament) => {
    setSelectedTournament(tournament);
    setLeaderboard(TournamentService.getLeaderboard(tournament.id));
  };

  const formatTime = (ms) => {
    const minutes = Math.floor(ms / 60000);
    const seconds = Math.floor((ms % 60000) / 1000);
    return `${minutes}m ${seconds}s`;
  };

  if (selectedTournament) {
    return (
      <div className="modal-overlay" onClick={onClose}>
        <div className="modal tournament-modal" onClick={e => e.stopPropagation()}>
          <button className="close-btn" onClick={() => setSelectedTournament(null)}>←</button>
          <h2>🏆 {selectedTournament.type === 'highest_win' ? 'Highest Win' : 'Most Wins'}</h2>
          <div className="tournament-info">
            <p>Prize Pool: 💰 {selectedTournament.prizePool}</p>
            <p>Time Left: ⏱️ {formatTime(selectedTournament.endTime - Date.now())}</p>
          </div>
          <div className="leaderboard-list">
            {leaderboard.map((player, index) => (
              <div key={player.id} className={`leaderboard-item rank-${index + 1}`}>
                <span className="rank">{index + 1}</span>
                <span className="player">Player {player.id}</span>
                <span className="score">{player.score} 💰</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal tournament-modal" onClick={e => e.stopPropagation()}>
        <button className="close-btn" onClick={onClose}>✕</button>
        <h2>🏆 Tournaments</h2>
        
        {tournaments.length === 0 ? (
          <div className="empty">
            <p>No active tournaments</p>
            <p className="hint">Check back later!</p>
          </div>
        ) : (
          <div className="tournaments-list">
            {tournaments.map(tournament => (
              <div key={tournament.id} className="tournament-card">
                <div className="tournament-header">
                  <h3>{tournament.type === 'highest_win' ? '🎯 Highest Win' : '🔥 Most Wins'}</h3>
                  <span className="entry-fee">💰 {tournament.entryFee}</span>
                </div>
                <div className="tournament-details">
                  <p>Prize Pool: 💰 {tournament.prizePool}</p>
                  <p>Players: {tournament.participants.length}</p>
                  <p>Time Left: ⏱️ {formatTime(tournament.endTime - Date.now())}</p>
                </div>
                <div className="tournament-actions">
                  <button onClick={() => handleJoin(tournament)}>Join</button>
                  <button onClick={() => handleViewLeaderboard(tournament)}>View</button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Tournament;
