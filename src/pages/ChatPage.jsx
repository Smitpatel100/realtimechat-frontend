import { useState, useEffect, useCallback } from 'react'
import { useNavigate } from 'react-router-dom'
import useAuth from '../context/useAuth'
import authService from '../services/authService'
import chatService from '../services/chatService'
import Sidebar from '../components/chat/Sidebar'
import ChatHeader from '../components/chat/ChatHeader'
import MessageList from '../components/chat/MessageList'
import MessageInput from '../components/chat/MessageInput'
import '../components/chat/Chat.css'

const ChatPage = () => {
  const navigate = useNavigate()
  const { logout } = useAuth()

  const [currentUser, setCurrentUser] = useState(null)
  const [rooms, setRooms] = useState([])
  const [selectedRoom, setSelectedRoom] = useState(null)
  const [messages, setMessages] = useState([])
  const [messagesLoading, setMessagesLoading] = useState(false)
  const [sending, setSending] = useState(false)

  useEffect(() => {
    authService.getMe()
      .then((res) => setCurrentUser(res.data))
      .catch(() => {})

    chatService.getRooms()
      .then((res) => setRooms(res.data))
      .catch(() => {})
  }, [])

  const loadMessages = useCallback((room) => {
    setMessagesLoading(true)
    chatService.getMessages(room.id)
      .then((res) => setMessages(res.data))
      .catch(() => setMessages([]))
      .finally(() => setMessagesLoading(false))
  }, [])

  const handleSelectRoom = (room) => {
    setSelectedRoom(room)
    setMessages([])
    loadMessages(room)
  }

  const handleSend = async (content) => {
    if (!selectedRoom || sending) return
    setSending(true)
    try {
      await chatService.sendMessage(selectedRoom.id, content)
      const res = await chatService.getMessages(selectedRoom.id)
      setMessages(res.data)
    } catch (err) {
      console.error('Failed to send message', err)
    } finally {
      setSending(false)
    }
  }

  const handleLogout = () => {
    logout()
    navigate('/login')
  }

  return (
    <div className="chat-layout">
      <Sidebar
        user={currentUser}
        rooms={rooms}
        selectedRoom={selectedRoom}
        onSelectRoom={handleSelectRoom}
        onLogout={handleLogout}
      />

      <div className="chat-main">
        {!selectedRoom ? (
          <div className="chat-empty-state">
            <div className="chat-empty-icon">💬</div>
            <div className="chat-empty-text">Select a chat to start messaging</div>
          </div>
        ) : (
          <>
            <ChatHeader room={selectedRoom} />
            <MessageList
              messages={messages}
              currentUserEmail={currentUser?.email}
              loading={messagesLoading}
            />
            <MessageInput onSend={handleSend} disabled={sending} />
          </>
        )}
      </div>
    </div>
  )
}

export default ChatPage