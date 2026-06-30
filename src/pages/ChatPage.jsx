import { useState, useEffect, useRef } from 'react'
import { useNavigate } from 'react-router-dom'
import useAuth from '../context/useAuth'
import authService from '../services/authService'
import chatService from '../services/chatService'
import websocketService from '../services/websocketService'
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

  const selectedRoomRef = useRef(null)

  useEffect(() => {
    authService.getMe()
      .then((res) => setCurrentUser(res.data))
      .catch(() => {})

    chatService.getRooms()
      .then((res) => setRooms(res.data))
      .catch(() => {})

    return () => {
      websocketService.disconnect()
    }
  }, [])

  const handleIncomingMessage = (message) => {
    if (!selectedRoomRef.current) return
    if (message.roomId !== selectedRoomRef.current.id) return

    setMessages((prev) => {
      if (prev.some((m) => m.id === message.id)) return prev
      return [...prev, message]
    })
  }

  const handleSelectRoom = (room) => {
    websocketService.disconnect()

    setSelectedRoom(room)
    selectedRoomRef.current = room
    setMessages([])

    setMessagesLoading(true)
    chatService.getMessages(room.id)
      .then((res) => setMessages(res.data))
      .catch(() => setMessages([]))
      .finally(() => setMessagesLoading(false))

    websocketService.connect(room.id, handleIncomingMessage)
  }

  const handleSend = (content) => {
    if (!selectedRoom) return
    if (!content.trim()) return
    websocketService.sendMessage(selectedRoom.id, content)
  }

  const handleLogout = () => {
    websocketService.disconnect()
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
            <MessageInput onSend={handleSend} disabled={false} />
          </>
        )}
      </div>
    </div>
  )
}

export default ChatPage