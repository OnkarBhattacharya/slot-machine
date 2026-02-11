import React, { useState } from 'react';
import { MiniGameService } from '../services/miniGameService';
import './MiniGames.css';

function MiniGames({ onClose, onWin }) {
  const [activeGame, setActiveGame] = useState(null);
  const [scratched, setScratched] = useState([]);
  const [coinFlipChoice, setCoinFlipChoice] = useState(null);
  const [coinFlipResult, setCoinFlipResult] = useState(null);
  const [wheelSpinning, setWheelSpinning] = useState(false);
  const [wheelResult, setWheelResult] = useState(null);
  const [cardGame, setCardGame] = useState(null);
  const playsLeft = MiniGameService.getDailyMiniGamePlays().plays;

  const handleScratch = (index) => {
    if (!scratched.includes(index)) {
      setScratched([...scratched, index]);
      if (scratched.length === 8) {
        const reward = MiniGameService.getScratchCardReward();
        setTimeout(() => {
          onWin(reward);
          alert(`You won ${reward} coins!`);
          setActiveGame(null);
          setScratched([]);
        }, 500);
      }
    }
  };

  const handleCoinFlip = (choice) => {
    if (!MiniGameService.useMiniGamePlay()) {
      alert('No plays left today!');
      return;
    }
    setCoinFlipChoice(choice);
    const result = MiniGameService.coinFlip(50, choice);
    setTimeout(() => {
      setCoinFlipResult(result);
      if (result.won) onWin(result.payout);
    }, 1000);
  };

  const handleWheelSpin = () => {
    if (!MiniGameService.useMiniGamePlay()) {
      alert('No plays left today!');
      return;
    }
    setWheelSpinning(true);
    setTimeout(() => {
      const reward = MiniGameService.spinWheel();
      setWheelResult(reward);
      setWheelSpinning(false);
      if (reward > 0) onWin(reward);
    }, 3000);
  };

  const startCardGame = () => {
    if (!MiniGameService.useMiniGamePlay()) {
      alert('No plays left today!');
      return;
    }
    setCardGame(MiniGameService.getCardGame());
  };

  const playCard = (guess) => {
    const result = MiniGameService.playCardGame(cardGame.dealerCard, guess);
    alert(`Dealer: ${cardGame.dealerCard}, You: ${result.playerCard}. ${result.won ? 'You win!' : 'You lose!'}`);
    if (result.won) onWin(100);
    setCardGame(null);
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content mini-games" onClick={e => e.stopPropagation()}>
        <h2>🎮 Mini Games</h2>
        <div className="plays-left">Daily Plays: {playsLeft}/3</div>
        
        {!activeGame && (
          <div className="games-menu">
            <button onClick={() => setActiveGame('scratch')}>🎫 Scratch Card</button>
            <button onClick={() => setActiveGame('coinflip')}>🪙 Coin Flip</button>
            <button onClick={() => setActiveGame('wheel')}>🎡 Wheel of Fortune</button>
            <button onClick={() => { setActiveGame('cards'); startCardGame(); }}>🃏 Card Game</button>
          </div>
        )}

        {activeGame === 'scratch' && (
          <div className="scratch-game">
            <h3>Scratch all panels to reveal your prize!</h3>
            <div className="scratch-grid">
              {[...Array(9)].map((_, i) => (
                <div key={i} className={`scratch-panel ${scratched.includes(i) ? 'scratched' : ''}`} onClick={() => handleScratch(i)}>
                  {scratched.includes(i) ? '💰' : '?'}
                </div>
              ))}
            </div>
            <button onClick={() => { setActiveGame(null); setScratched([]); }}>Back</button>
          </div>
        )}

        {activeGame === 'coinflip' && (
          <div className="coinflip-game">
            <h3>Choose Heads or Tails (50 coins bet)</h3>
            {!coinFlipResult ? (
              <div className="coin-choices">
                <button onClick={() => handleCoinFlip('heads')}>👑 Heads</button>
                <button onClick={() => handleCoinFlip('tails')}>🦅 Tails</button>
              </div>
            ) : (
              <div className="coin-result">
                <div className="coin-animation">{coinFlipResult.result === 'heads' ? '👑' : '🦅'}</div>
                <p>{coinFlipResult.won ? `You won ${coinFlipResult.payout} coins!` : 'You lost!'}</p>
                <button onClick={() => { setCoinFlipResult(null); setActiveGame(null); }}>Play Again</button>
              </div>
            )}
            <button onClick={() => { setActiveGame(null); setCoinFlipResult(null); }}>Back</button>
          </div>
        )}

        {activeGame === 'wheel' && (
          <div className="wheel-game">
            <h3>Spin the Wheel!</h3>
            <div className={`wheel ${wheelSpinning ? 'spinning' : ''}`}>🎡</div>
            {wheelResult !== null && <p className="wheel-result">You won {wheelResult} coins!</p>}
            <button onClick={handleWheelSpin} disabled={wheelSpinning}>
              {wheelSpinning ? 'Spinning...' : 'Spin'}
            </button>
            <button onClick={() => { setActiveGame(null); setWheelResult(null); }}>Back</button>
          </div>
        )}

        {activeGame === 'cards' && cardGame && (
          <div className="card-game">
            <h3>Higher or Lower?</h3>
            <div className="dealer-card">Dealer's Card: {cardGame.dealerCard}</div>
            <div className="card-choices">
              <button onClick={() => playCard('higher')}>⬆️ Higher</button>
              <button onClick={() => playCard('lower')}>⬇️ Lower</button>
            </div>
            <button onClick={() => { setActiveGame(null); setCardGame(null); }}>Back</button>
          </div>
        )}

        <button className="close-btn" onClick={onClose}>Close</button>
      </div>
    </div>
  );
}

export default MiniGames;
