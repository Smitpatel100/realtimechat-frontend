const MessageBubble = ({ message, currentUserEmail }) => {
  const isOwn = message.senderEmail === currentUserEmail

  const formatTime = (timestamp) => {
    if (!timestamp) return ''
    return new Date(timestamp).toLocaleTimeString([], {
      hour: '2-digit',
      minute: '2-digit',
    })
  }

  return (
    <div className={`message-bubble-wrapper ${isOwn ? 'own' : 'other'}`}>
      {!isOwn && (
        <div className="message-sender">{message.senderUsername || message.senderEmail}</div>
      )}
      <div className="message-bubble">{message.content}</div>
      <div className="message-time">{formatTime(message.createdAt)}</div>
    </div>
  )
}

export default MessageBubble