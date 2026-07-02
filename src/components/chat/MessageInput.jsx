import { useState } from 'react'

const MessageInput = ({ onSend, onTyping, disabled }) => {
  const [value, setValue] = useState('')

  const handleSend = () => {
    const trimmed = value.trim()
    if (!trimmed || disabled) return
    onSend(trimmed)
    setValue('')
  }

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      handleSend()
    }
  }

  const handleChange = (e) => {
    setValue(e.target.value)
    if (onTyping) {
      onTyping()
    }
  }

  return (
    <div className="message-input-container">
      <input
        className="message-input"
        type="text"
        placeholder="Type a message..."
        value={value}
        onChange={handleChange}
        onKeyDown={handleKeyDown}
        disabled={disabled}
      />
      <button
        className="send-btn"
        onClick={handleSend}
        disabled={!value.trim() || disabled}
      >
        ➤
      </button>
    </div>
  )
}

export default MessageInput