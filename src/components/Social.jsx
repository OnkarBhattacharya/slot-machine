import React, { useState, useEffect } from 'react';
import { SocialService } from '../services/socialService';
import './Social.css';

const Social = ({ onClose, onCoinsReceived }) => {
  const [tab, setTab] = useState('friends');
  const [friends, setFriends] = useState([]);
  const [pendingGifts, setPendingGifts] = useState([]);
  const [inviteCode, setInviteCode] = useState('');
  const [redeemCode, setRedeemCode] = useState('');

  useEffect(() => {
    setFriends(SocialService.getFriends());
    setPendingGifts(SocialService.getPendingGifts());
    setInviteCode(SocialService.getInviteCode());
  }, []);

  const handleSendCoins = (friendId) => {
    const result = SocialService.sendCoins(friendId, 50);
    if (result.success) {
      alert('50 coins sent!');
    } else {
      alert(result.error);
    }
  };

  const handleClaimGift = (index) => {
    const amount = SocialService.claimGift(index);
    if (amount > 0) {
      onCoinsReceived(amount);
      setPendingGifts(SocialService.getPendingGifts());
    }
  };

  const handleShare = (platform) => {
    const reward = SocialService.shareScore(1000, platform);
    onCoinsReceived(reward);
    alert(`Shared! +${reward} coins`);
  };

  const handleRedeem = () => {
    const result = SocialService.redeemInvite(redeemCode);
    if (result.success) {
      onCoinsReceived(result.reward);
      alert(`+${result.reward} coins!`);
      setRedeemCode('');
    } else {
      alert(result.error);
    }
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal social-modal" onClick={e => e.stopPropagation()}>
        <button className="close-btn" onClick={onClose}>✕</button>
        <h2>👥 Social</h2>
        
        <div className="tabs">
          <button className={tab === 'friends' ? 'active' : ''} onClick={() => setTab('friends')}>Friends</button>
          <button className={tab === 'gifts' ? 'active' : ''} onClick={() => setTab('gifts')}>Gifts ({pendingGifts.length})</button>
          <button className={tab === 'share' ? 'active' : ''} onClick={() => setTab('share')}>Share</button>
          <button className={tab === 'invite' ? 'active' : ''} onClick={() => setTab('invite')}>Invite</button>
        </div>

        {tab === 'friends' && (
          <div className="tab-content">
            {friends.length === 0 ? (
              <p className="empty">No friends yet. Invite friends to play!</p>
            ) : (
              <div className="friends-list">
                {friends.map(friend => (
                  <div key={friend.id} className="friend-item">
                    <span>{friend.name}</span>
                    <button onClick={() => handleSendCoins(friend.id)}>Send 50 💰</button>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {tab === 'gifts' && (
          <div className="tab-content">
            {pendingGifts.length === 0 ? (
              <p className="empty">No pending gifts</p>
            ) : (
              <div className="gifts-list">
                {pendingGifts.map((gift, index) => (
                  <div key={index} className="gift-item">
                    <span>💰 {gift.amount} coins</span>
                    <button onClick={() => handleClaimGift(index)}>Claim</button>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {tab === 'share' && (
          <div className="tab-content">
            <p>Share your score and earn 50 coins!</p>
            <div className="share-buttons">
              <button onClick={() => handleShare('twitter')}>🐦 Twitter</button>
              <button onClick={() => handleShare('facebook')}>📘 Facebook</button>
            </div>
          </div>
        )}

        {tab === 'invite' && (
          <div className="tab-content">
            <div className="invite-section">
              <p>Your invite code:</p>
              <div className="code-display">{inviteCode}</div>
              <button onClick={() => navigator.clipboard.writeText(inviteCode)}>📋 Copy</button>
            </div>
            <div className="redeem-section">
              <p>Redeem a friend's code for 500 coins:</p>
              <input 
                type="text" 
                value={redeemCode}
                onChange={e => setRedeemCode(e.target.value.toUpperCase())}
                placeholder="Enter code"
              />
              <button onClick={handleRedeem}>Redeem</button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Social;
