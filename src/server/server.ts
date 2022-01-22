import { ACTIONS } from '../socket/actions'

import { getClients, shareRoomsInfo } from './utils'

import { PORT, server, io } from './index'

server.listen(PORT, () => {
  console.log('server started')
})

io.on('connection', (socket) => {
  shareRoomsInfo()

  socket.on(ACTIONS.JOIN, (config) => {
    const { room: roomID } = config
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    const { rooms: joinedRooms } = socket

    if (Array.from(joinedRooms).includes(roomID)) {
      return console.warn(`Already joined to ${roomID}`)
    }

    const clients = getClients(roomID)

    clients.forEach((clientID) => {
      io.to(clientID).emit(ACTIONS.ADD_PEER, {
        peerID: socket.id,
        createOffer: false,
      })
      socket.emit(ACTIONS.ADD_PEER, {
        peerID: clientID,
        createOffer: true,
      })
    })

    socket.join(roomID)
    shareRoomsInfo()
  })

  const leaveRoom = () => {
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    const { rooms } = socket

    Array.from(rooms).forEach((roomID) => {
      const clients = getClients(roomID)

      clients.forEach((clientID) => {
        io.to(clientID).emit(ACTIONS.REMOVE_PEER, {
          peerID: socket.id,
        })
        socket.emit(ACTIONS.REMOVE_PEER, {
          peerID: clientID,
        })
      })

      socket.leave(roomID)
    })

    shareRoomsInfo()
  }

  socket.on(ACTIONS.LEAVE, leaveRoom)
  socket.on('disconnecting', leaveRoom)
})
