const ChatHeader = ({ room, onlineEmails }) => {
  if (!room) return null

  const isOnline = () => {
    if (room.type !== 'PRIVATE') return false
    if (!room.memberEmails || !onlineEmails) return false
    return room.memberEmails.some((email) => onlineEmails.has(email))
  }

  const online = isOnline()

  return (
    <div className="chat-header">
      <div className="room-icon-wrapper">
        <div className={`chat-header-icon ${room.type === 'PRIVATE' ? 'private' : ''}`}>
          {room.type === 'PRIVATE' ? '👤' : '👥'}
        </div>
        {room.type === 'PRIVATE' && (
          <span className={`presence-dot ${online ? 'online' : 'offline'} header-presence-dot`} />
        )}
      </div>
      <div className="chat-header-info">
        <div className="chat-header-name">{room.name}</div>
        <div className="chat-header-meta">
          {room.type === 'PRIVATE'
            ? (online ? '🟢 Online' : '⚪ Offline')
            : `Group · ${room.memberEmails?.length || 0} members`}
        </div>
      </div>
    </div>
  )
}

export default ChatHeader