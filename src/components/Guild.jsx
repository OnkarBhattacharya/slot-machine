import React, { useState, useEffect } from 'react';
import { GuildService } from '../services/guildService';
import './Guild.css';

const Guild = ({ onClose }) => {
  const [playerGuild, setPlayerGuild] = useState(null);
  const [guilds, setGuilds] = useState([]);
  const [tab, setTab] = useState('info');
  const [chat, setChat] = useState([]);
  const [message, setMessage] = useState('');
  const [createMode, setCreateMode] = useState(false);
  const [guildName, setGuildName] = useState('');
  const [guildDesc, setGuildDesc] = useState('');

  useEffect(() => {
    loadData();
  }, []);

  const loadData = () => {
    const guild = GuildService.getPlayerGuild();
    setPlayerGuild(guild);
    if (!guild) {
      setGuilds(GuildService.getGuilds());
    } else {
      setChat(GuildService.getChat());
    }
  };

  const handleCreate = () => {
    if (!guildName.trim()) return;
    GuildService.createGuild(guildName, guildDesc);
    loadData();
    setCreateMode(false);
  };

  const handleJoin = (guildId) => {
    const result = GuildService.joinGuild(guildId);
    if (result.success) {
      loadData();
    } else {
      alert(result.error);
    }
  };

  const handleLeave = () => {
    if (window.confirm('Leave guild?')) {
      GuildService.leaveGuild();
      loadData();
    }
  };

  const handleSendMessage = () => {
    if (!message.trim()) return;
    GuildService.sendMessage(message);
    setMessage('');
    setChat(GuildService.getChat());
  };

  if (!playerGuild) {
    return (
      <div className="modal-overlay" onClick={onClose}>
        <div className="modal guild-modal" onClick={e => e.stopPropagation()}>
          <button className="close-btn" onClick={onClose}>✕</button>
          <h2>🛡️ Guilds</h2>
          
          {createMode ? (
            <div className="create-guild">
              <input 
                type="text"
                placeholder="Guild Name"
                value={guildName}
                onChange={e => setGuildName(e.target.value)}
              />
              <textarea
                placeholder="Description"
                value={guildDesc}
                onChange={e => setGuildDesc(e.target.value)}
              />
              <div className="create-actions">
                <button onClick={handleCreate}>Create</button>
                <button onClick={() => setCreateMode(false)}>Cancel</button>
              </div>
            </div>
          ) : (
            <>
              <button className="create-btn" onClick={() => setCreateMode(true)}>
                ➕ Create Guild
              </button>
              <div className="guilds-list">
                {guilds.map(guild => (
                  <div key={guild.id} className="guild-card">
                    <h3>{guild.name}</h3>
                    <p>{guild.description}</p>
                    <div className="guild-stats">
                      <span>Level {guild.level}</span>
                      <span>{guild.members.length}/50 members</span>
                    </div>
                    <button onClick={() => handleJoin(guild.id)}>Join</button>
                  </div>
                ))}
              </div>
            </>
          )}
        </div>
      </div>
    );
  }

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal guild-modal" onClick={e => e.stopPropagation()}>
        <button className="close-btn" onClick={onClose}>✕</button>
        <h2>🛡️ {playerGuild.name}</h2>
        
        <div className="guild-header">
          <div className="guild-level">Level {playerGuild.level}</div>
          <div className="guild-members">{playerGuild.members.length}/50 👥</div>
        </div>

        <div className="tabs">
          <button className={tab === 'info' ? 'active' : ''} onClick={() => setTab('info')}>Info</button>
          <button className={tab === 'chat' ? 'active' : ''} onClick={() => setTab('chat')}>Chat</button>
          <button className={tab === 'members' ? 'active' : ''} onClick={() => setTab('members')}>Members</button>
        </div>

        {tab === 'info' && (
          <div className="tab-content">
            <p>{playerGuild.description}</p>
            <div className="xp-bar">
              <div className="xp-fill" style={{ width: `${(playerGuild.xp / (playerGuild.level * 1000)) * 100}%` }} />
              <span>{playerGuild.xp} / {playerGuild.level * 1000} XP</span>
            </div>
            <button className="leave-btn" onClick={handleLeave}>Leave Guild</button>
          </div>
        )}

        {tab === 'chat' && (
          <div className="tab-content chat-tab">
            <div className="chat-messages">
              {chat.map(msg => (
                <div key={msg.id} className="chat-message">
                  <span className="sender">{msg.sender}:</span>
                  <span className="text">{msg.message}</span>
                </div>
              ))}
            </div>
            <div className="chat-input">
              <input
                type="text"
                value={message}
                onChange={e => setMessage(e.target.value)}
                onKeyPress={e => e.key === 'Enter' && handleSendMessage()}
                placeholder="Type a message..."
              />
              <button onClick={handleSendMessage}>Send</button>
            </div>
          </div>
        )}

        {tab === 'members' && (
          <div className="tab-content">
            <div className="members-list">
              {playerGuild.members.map(member => (
                <div key={member.id} className="member-item">
                  <span>{member.id}</span>
                  <span className="role">{member.role}</span>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Guild;
