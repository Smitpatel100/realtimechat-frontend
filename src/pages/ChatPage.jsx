import { useState, useEffect, useRef } from 'react'
import { useNavigate } from 'react-router-dom'
import useAuth from '../context/useAuth'
import authService from '../services/authService'
import chatService from '../services/chatService'
import websocketService from '../services/websocketService'
import presenceService from '../services/presenceService'
import typingService from '../services/typingService'
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
  const [onlineEmails, setOnlineEmails] = useState(new Set())
  const [typingUsers, setTypingUsers] = useState({})

  const selectedRoomRef = useRef(null)
  const currentUserRef = useRef(null)

  useEffect(() => {
    authService.getMe()
      .then((res) => {
        setCurrentUser(res.data)
        currentUserRef.current = res.data
      })
      .catch(() => {})

    chatService.getRooms()
      .then((res) => setRooms(res.data))
      .catch(() => {})

    presenceService.getInitialOnlineUsers()
      .then((res) => setOnlineEmails(new Set(res.data)))
      .catch(() => {})

    presenceService.connect((presence) => {
      setOnlineEmails((prev) => {
        const next = new Set(prev)
        if (presence.online) {
          next.add(presence.email)
        } else {
          next.delete(presence.email)
        }
        return next
      })
    })

    return () => {
      websocketService.disconnect()
      presenceService.disconnect()
      typingService.unsubscribe()
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

  const handleTypingUpdate = (typingMessage) => {
    const currentEmail = currentUserRef.current?.email
    if (typingMessage.senderEmail === currentEmail) return

    setTypingUsers((prev) => {
      const next = { ...prev }
      if (typingMessage.typing) {
        next[typingMessage.senderEmail] = typingMessage.senderUsername
      } else {
        delete next[typingMessage.senderEmail]
      }
      return next
    })
  }

  const handleSelectRoom = (room) => {
    typingService.unsubscribe()
    websocketService.disconnect()

    setSelectedRoom(room)
    selectedRoomRef.current = room
    setMessages([])
    setTypingUsers({})

    setMessagesLoading(true)
    chatService.getMessages(room.id)
      .then((res) => setMessages(res.data))
      .catch(() => setMessages([]))
      .finally(() => setMessagesLoading(false))

    websocketService.connect(room.id, handleIncomingMessage)

    setTimeout(() => {
      typingService.subscribeToRoom(room.id, handleTypingUpdate)
    }, 500)
  }

  const handleSend = (content) => {
    if (!selectedRoom) return
    if (!content.trim()) return
    typingService.stopTyping(selectedRoom.id)
    websocketService.sendMessage(selectedRoom.id, content)
  }

  const handleTyping = () => {
    if (!selectedRoom) return
    typingService.sendTyping(selectedRoom.id)
  }

  const handleLogout = () => {
    typingService.unsubscribe()
    websocketService.disconnect()
    presenceService.disconnect()
    logout()
    navigate('/login')
  }

  const typingText = () => {
    const names = Object.values(typingUsers)
    if (names.length === 0) return null
    if (names.length === 1) return `${names[0]} is typing...`
    if (names.length === 2) return `${names[0]} and ${names[1]} are typing...`
    return 'Several people are typing...'
  }

  return (
    <div className="chat-layout">
      <Sidebar
        user={currentUser}
        rooms={rooms}
        selectedRoom={selectedRoom}
        onSelectRoom={handleSelectRoom}
        onLogout={handleLogout}
        onlineEmails={onlineEmails}
      />

      <div className="chat-main">
        {!selectedRoom ? (
          <div className="chat-empty-state">
            <div className="chat-empty-icon">💬</div>
            <div className="chat-empty-text">Select a chat to start messaging</div>
          </div>
        ) : (
          <>
            <ChatHeader room={selectedRoom} onlineEmails={onlineEmails} />
            <MessageList
              messages={messages}
              currentUserEmail={currentUser?.email}
              loading={messagesLoading}
            />
            {typingText() && (
              <div className="typing-indicator">
                <span className="typing-dots">
                  <span /><span /><span />
                </span>
                {typingText()}
              </div>
            )}
            <MessageInput
              onSend={handleSend}
              onTyping={handleTyping}
              disabled={false}
            />
          </>
        )}
      </div>
    </div>
  )
}

export default ChatPage