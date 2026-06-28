const ChatHeader = ({ room }) => {
  if (!room) return null

  return (
    <div className="chat-header">
      <div className={`chat-header-icon ${room.type === 'PRIVATE' ? 'private' : ''}`}>
        {room.type === 'PRIVATE' ? '👤' : '👥'}
      </div>
      <div className="chat-header-info">
        <div className="chat-header-name">{room.name}</div>
        <div className="chat-header-meta">
          {room.type === 'PRIVATE' ? 'Private Chat' : `Group · ${room.memberEmails?.length || 0} members`}
        </div>
      </div>
    </div>
  )
}

export default ChatHeader