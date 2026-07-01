const RoomList = ({ rooms, selectedRoom, onSelectRoom, onlineEmails,currentUserEmail }) => {
  if (!rooms || rooms.length === 0) {
    return (
      <div className="room-list-container">
        <div className="room-list-empty">No rooms yet</div>
      </div>
    )
  }

  const isRoomOnline = (room, currentUserEmail) => {
  if (room.type !== 'PRIVATE') return false
  if (!room.memberEmails || !onlineEmails) return false

  const otherUser = room.memberEmails.find(
    email => email !== currentUserEmail
  )

  return otherUser ? onlineEmails.has(otherUser) : false
}

  return (
    <div className="room-list-container">
      <div className="room-list-title">Chats</div>
      {rooms.map((room) => (
        <div
          key={room.id}
          className={`room-item ${selectedRoom?.id === room.id ? 'active' : ''}`}
          onClick={() => onSelectRoom(room)}
        >
          <div className="room-icon-wrapper">
            <div className={`room-icon ${room.type === 'PRIVATE' ? 'private' : ''}`}>
              {room.type === 'PRIVATE' ? '👤' : '👥'}
            </div>
            {room.type === 'PRIVATE' && (
              <span className={`presence-dot ${isRoomOnline(room, currentUserEmail) ? 'online' : 'offline'}`} />
            )}
          </div>
          <div className="room-info">
            <div className="room-name">{room.name}</div>
            <div className="room-type">
              {room.type === 'PRIVATE'
                ? (isRoomOnline(room, currentUserEmail) ? 'Online' : 'Offline')
                : 'Group'}
            </div>
          </div>
        </div>
      ))}
    </div>
  )
}

export default RoomList