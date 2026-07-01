import RoomList from './RoomList'
import '../../components/chat/Chat.css'

const Sidebar = ({ user, rooms, selectedRoom, onSelectRoom, onLogout, onlineEmails }) => {
  const initials = user?.username
    ? user.username.slice(0, 2).toUpperCase()
    : user?.email?.slice(0, 2).toUpperCase() || '??'

  return (
    <div className="sidebar">
      <div className="sidebar-header">
        <div className="sidebar-logo">💬 RealTimeChat</div>
        <div className="sidebar-user">
          <div className="sidebar-avatar-wrapper">
            <div className="sidebar-avatar">{initials}</div>
            <span className="presence-dot online sidebar-presence-dot" />
          </div>
          <div className="sidebar-user-info">
            <div className="sidebar-username">{user?.username || 'User'}</div>
            <div className="sidebar-email">{user?.email || ''}</div>
          </div>
        </div>
        <button className="logout-btn" onClick={onLogout}>Sign Out</button>
      </div>
      <RoomList
        rooms={rooms}
        selectedRoom={selectedRoom}
        onSelectRoom={onSelectRoom}
        onlineEmails={onlineEmails}
        currentUserEmail={user?.email}
      />
    </div>
  )
}

export default Sidebar