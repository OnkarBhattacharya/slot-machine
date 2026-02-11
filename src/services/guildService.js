import { Storage } from '../utils/storage';

export const GuildService = {
  createGuild: (name, description) => {
    const guilds = Storage.load('guilds', []);
    const guild = {
      id: Date.now().toString(),
      name,
      description,
      createdAt: Date.now(),
      members: [{ id: 'player', role: 'leader', joinedAt: Date.now() }],
      level: 1,
      xp: 0,
      chat: []
    };
    guilds.push(guild);
    Storage.save('guilds', guilds);
    Storage.save('player_guild', guild.id);
    return guild;
  },

  getGuilds: () => {
    return Storage.load('guilds', []);
  },

  getPlayerGuild: () => {
    const guildId = Storage.load('player_guild');
    if (!guildId) return null;
    const guilds = Storage.load('guilds', []);
    return guilds.find(g => g.id === guildId);
  },

  joinGuild: (guildId) => {
    const guilds = Storage.load('guilds', []);
    const guild = guilds.find(g => g.id === guildId);
    
    if (!guild) return { success: false, error: 'Guild not found' };
    if (guild.members.length >= 50) return { success: false, error: 'Guild full' };
    
    guild.members.push({ id: 'player', role: 'member', joinedAt: Date.now() });
    Storage.save('guilds', guilds);
    Storage.save('player_guild', guildId);
    return { success: true };
  },

  leaveGuild: () => {
    const guildId = Storage.load('player_guild');
    if (!guildId) return false;
    
    const guilds = Storage.load('guilds', []);
    const guild = guilds.find(g => g.id === guildId);
    
    if (guild) {
      guild.members = guild.members.filter(m => m.id !== 'player');
      Storage.save('guilds', guilds);
    }
    
    Storage.save('player_guild', null);
    return true;
  },

  addXP: (amount) => {
    const guild = GuildService.getPlayerGuild();
    if (!guild) return;
    
    const guilds = Storage.load('guilds', []);
    const guildIndex = guilds.findIndex(g => g.id === guild.id);
    
    guilds[guildIndex].xp += amount;
    const xpForNext = guilds[guildIndex].level * 1000;
    
    if (guilds[guildIndex].xp >= xpForNext) {
      guilds[guildIndex].level++;
      guilds[guildIndex].xp -= xpForNext;
    }
    
    Storage.save('guilds', guilds);
  },

  sendMessage: (message) => {
    const guild = GuildService.getPlayerGuild();
    if (!guild) return false;
    
    const guilds = Storage.load('guilds', []);
    const guildIndex = guilds.findIndex(g => g.id === guild.id);
    
    guilds[guildIndex].chat.push({
      id: Date.now().toString(),
      sender: 'player',
      message,
      timestamp: Date.now()
    });
    
    if (guilds[guildIndex].chat.length > 100) {
      guilds[guildIndex].chat = guilds[guildIndex].chat.slice(-100);
    }
    
    Storage.save('guilds', guilds);
    return true;
  },

  getChat: () => {
    const guild = GuildService.getPlayerGuild();
    return guild ? guild.chat : [];
  }
};
