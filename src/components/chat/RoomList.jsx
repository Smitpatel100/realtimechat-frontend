const RoomList = ({ rooms, selectedRoom, onSelectRoom }) => {
  if (!rooms || rooms.length === 0) {
    return (
      <div className="room-list-container">
        <div className="room-list-empty">No rooms yet</div>
      </div>
    )
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
          <div className={`room-icon ${room.type === 'PRIVATE' ? 'private' : ''}`}>
            {room.type === 'PRIVATE' ? '👤' : '👥'}
          </div>
          <div className="room-info">
            <div className="room-name">{room.name}</div>
            <div className="room-type">{room.type === 'PRIVATE' ? 'Private' : 'Group'}</div>
          </div>
        </div>
      ))}
    </div>
  )
}

export default RoomList