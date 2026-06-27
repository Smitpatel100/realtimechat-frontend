import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import useAuth from '../context/useAuth'
import authService from '../services/authService'
import './ChatPage.css'

const ChatPage = () => {
  const navigate = useNavigate()
  const { logout } = useAuth()
  const [email, setEmail] = useState('')

  useEffect(() => {
    authService.getMe()
      .then((res) => setEmail(res.data.email))
      .catch(() => {})
  }, [])

  const handleLogout = () => {
    logout()
    navigate('/login')
  }

  return (
    <div className="chat-wrapper">
      <div className="chat-dashboard">
        <div className="chat-icon">💬</div>
        <h1 className="chat-welcome">Welcome to RealTimeChat</h1>
        {email && (
          <p className="chat-user-email">{email}</p>
        )}
        <div className="chat-status">
          <span className="status-dot" />
          You are connected
        </div>
        <button className="logout-button" onClick={handleLogout}>
          Sign Out
        </button>
      </div>
    </div>
  )
}

export default ChatPage