import { Storage } from '../utils/storage';

export const TournamentService = {
  getActiveTournaments: () => {
    const tournaments = Storage.load('tournaments', []);
    const now = Date.now();
    return tournaments.filter(t => t.endTime > now);
  },

  createTournament: (type, entryFee, duration) => {
    const tournaments = Storage.load('tournaments', []);
    const tournament = {
      id: Date.now().toString(),
      type,
      entryFee,
      startTime: Date.now(),
      endTime: Date.now() + duration * 60 * 1000,
      participants: [],
      prizePool: 0
    };
    tournaments.push(tournament);
    Storage.save('tournaments', tournaments);
    return tournament;
  },

  joinTournament: (tournamentId, playerId, entryFee) => {
    const tournaments = Storage.load('tournaments', []);
    const tournament = tournaments.find(t => t.id === tournamentId);
    
    if (!tournament) return { success: false, error: 'Tournament not found' };
    if (tournament.participants.find(p => p.id === playerId)) {
      return { success: false, error: 'Already joined' };
    }
    
    tournament.participants.push({ id: playerId, score: 0, spins: 0 });
    tournament.prizePool += entryFee;
    Storage.save('tournaments', tournaments);
    return { success: true };
  },

  updateScore: (tournamentId, playerId, score) => {
    const tournaments = Storage.load('tournaments', []);
    const tournament = tournaments.find(t => t.id === tournamentId);
    
    if (tournament) {
      const participant = tournament.participants.find(p => p.id === playerId);
      if (participant) {
        if (tournament.type === 'highest_win') {
          participant.score = Math.max(participant.score, score);
        } else {
          participant.score += score;
        }
        participant.spins++;
        Storage.save('tournaments', tournaments);
      }
    }
  },

  getLeaderboard: (tournamentId) => {
    const tournaments = Storage.load('tournaments', []);
    const tournament = tournaments.find(t => t.id === tournamentId);
    
    if (!tournament) return [];
    return [...tournament.participants].sort((a, b) => b.score - a.score);
  },

  claimPrize: (tournamentId, playerId) => {
    const tournaments = Storage.load('tournaments', []);
    const tournament = tournaments.find(t => t.id === tournamentId);
    
    if (!tournament || tournament.endTime > Date.now()) return 0;
    
    const leaderboard = [...tournament.participants].sort((a, b) => b.score - a.score);
    const rank = leaderboard.findIndex(p => p.id === playerId);
    
    if (rank === -1) return 0;
    
    const prizeDistribution = [0.5, 0.3, 0.2];
    const prize = Math.floor(tournament.prizePool * (prizeDistribution[rank] || 0));
    
    tournament.participants = tournament.participants.filter(p => p.id !== playerId);
    Storage.save('tournaments', tournaments);
    
    return prize;
  }
};
