import { io, Socket } from 'socket.io-client'

export const socket: Socket = io('http://localhost:3001', {
  forceNew: true,
  reconnectionAttempts: 1000,
  timeout: 10000,
  transports: ['websocket'],
})
