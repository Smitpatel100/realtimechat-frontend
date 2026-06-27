import { Client } from '@stomp/stompjs'

let stompClient = null
let subscription = null
let messageCallback = null

const websocketService = {

  connect(roomId) {
    const token = localStorage.getItem('token')

    stompClient = new Client({
      brokerURL: 'ws://localhost:8080/ws',

      connectHeaders: {
        Authorization: token ? `Bearer ${token}` : '',
      },

      reconnectDelay: 5000,

      onConnect: () => {
        console.log('WebSocket connected')
        subscription = stompClient.subscribe(
          `/topic/chat/${roomId}`,
          (message) => {
            if (messageCallback) {
              const parsed = JSON.parse(message.body)
              messageCallback(parsed)
            }
          }
        )
      },

      onDisconnect: () => {
        console.log('WebSocket disconnected')
      },

      onStompError: (frame) => {
        console.error('STOMP error', frame)
      },
    })

    stompClient.activate()
  },

  disconnect() {
    if (subscription) {
      subscription.unsubscribe()
      subscription = null
    }
    if (stompClient) {
      stompClient.deactivate()
      stompClient = null
    }
    messageCallback = null
  },

  sendMessage(roomId, content) {
    if (stompClient && stompClient.connected) {
      stompClient.publish({
        destination: `/app/chat.send/${roomId}`,
        body: JSON.stringify({ content }),
      })
    } else {
      console.error('WebSocket is not connected')
    }
  },

  subscribe(callback) {
    messageCallback = callback
  },
}

export default websocketService