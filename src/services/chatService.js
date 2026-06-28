import api from '../config/axiosConfig'

const chatService = {
  getRooms: () => api.get('/api/chat-rooms/my-rooms'),
  getMessages: (roomId) => api.get(`/api/messages/rooms/${roomId}`),
  sendMessage: (roomId, content) => api.post(`/api/messages/rooms/${roomId}`, { content }),
}

export default chatService