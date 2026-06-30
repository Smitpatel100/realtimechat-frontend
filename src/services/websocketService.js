import { Client } from '@stomp/stompjs'
import SockJS from 'sockjs-client'

let stompClient = null
let currentSubscription = null
let onMessageCallback = null

const websocketService = {

  connect(roomId, onMessageReceived) {
    onMessageCallback = onMessageReceived

    if (stompClient) {
      stompClient.deactivate()
      stompClient = null
    }

    const token = localStorage.getItem('token')

    stompClient = new Client({
      webSocketFactory: () => new SockJS('http://localhost:8080/ws'),

      connectHeaders: {
        Authorization: token ? `Bearer ${token}` : '',
      },

      reconnectDelay: 5000,

      onConnect: () => {
        if (currentSubscription) {
          currentSubscription.unsubscribe()
          currentSubscription = null
        }

        currentSubscription = stompClient.subscribe(
          `/topic/chat/${roomId}`,
          (frame) => {
            try {
              const message = JSON.parse(frame.body)
              if (onMessageCallback) {
                onMessageCallback(message)
              }
            } catch (e) {
              console.error('Failed to parse incoming message', e)
            }
          }
        )
      },

      onStompError: (frame) => {
        console.error('STOMP error', frame)
      },

      onWebSocketError: (error) => {
        console.error('WebSocket error', error)
      },
    })

    stompClient.activate()
  },

  disconnect() {
    if (currentSubscription) {
      currentSubscription.unsubscribe()
      currentSubscription = null
    }
    if (stompClient) {
      stompClient.deactivate()
      stompClient = null
    }
    onMessageCallback = null
  },

  sendMessage(roomId, content) {
    if (!stompClient || !stompClient.connected) {
      console.error('WebSocket not connected')
      return
    }

    stompClient.publish({
      destination: `/app/chat.send/${roomId}`,
      body: JSON.stringify({ content }),
    })
  },

  isConnected() {
    return stompClient !== null && stompClient.connected
  },
}

export default websocketService