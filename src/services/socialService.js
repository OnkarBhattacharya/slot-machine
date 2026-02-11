import { Storage } from '../utils/storage';

export const SocialService = {
  sendCoins: (friendId, amount) => {
    const sent = Storage.load('coins_sent', []);
    const today = new Date().toDateString();
    const todaySent = sent.filter(s => s.date === today);
    
    if (todaySent.length >= 3) return { success: false, error: 'Daily limit reached' };
    
    sent.push({ friendId, amount, date: today, timestamp: Date.now() });
    Storage.save('coins_sent', sent);
    return { success: true };
  },

  receiveCoins: (friendId, amount) => {
    const received = Storage.load('coins_received', []);
    received.push({ friendId, amount, timestamp: Date.now(), claimed: false });
    Storage.save('coins_received', received);
  },

  getPendingGifts: () => {
    return Storage.load('coins_received', []).filter(g => !g.claimed);
  },

  claimGift: (index) => {
    const received = Storage.load('coins_received', []);
    if (received[index] && !received[index].claimed) {
      received[index].claimed = true;
      Storage.save('coins_received', received);
      return received[index].amount;
    }
    return 0;
  },

  getFriends: () => {
    return Storage.load('friends', []);
  },

  addFriend: (friendId, name) => {
    const friends = Storage.load('friends', []);
    if (!friends.find(f => f.id === friendId)) {
      friends.push({ id: friendId, name, addedAt: Date.now() });
      Storage.save('friends', friends);
      return true;
    }
    return false;
  },

  shareScore: (score, platform) => {
    const shareText = `🎰 I just scored ${score} coins in Slot Machine! Can you beat my score?`;
    const shareUrl = window.location.href;
    
    if (platform === 'twitter') {
      window.open(`https://twitter.com/intent/tweet?text=${encodeURIComponent(shareText)}&url=${encodeURIComponent(shareUrl)}`);
    } else if (platform === 'facebook') {
      window.open(`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(shareUrl)}`);
    }
    
    const shares = Storage.load('shares', 0);
    Storage.save('shares', shares + 1);
    return 50;
  },

  getInviteCode: () => {
    let code = Storage.load('invite_code');
    if (!code) {
      code = Math.random().toString(36).substring(2, 8).toUpperCase();
      Storage.save('invite_code', code);
    }
    return code;
  },

  redeemInvite: (code) => {
    const redeemed = Storage.load('redeemed_invites', []);
    if (redeemed.includes(code)) return { success: false, error: 'Already redeemed' };
    
    redeemed.push(code);
    Storage.save('redeemed_invites', redeemed);
    return { success: true, reward: 500 };
  }
};
