import { ACTIONS } from '../socket/actions'

import { io } from './index'

export const getClients = (roomID: string) => Array.from(io.sockets.adapter.rooms.get(roomID) || [])

const getClientRooms = () => {
  const { rooms } = io.sockets.adapter

  return Array.from(rooms.keys())
}

export const shareRoomsInfo = () => {
  io.emit(ACTIONS.SHARE_ROOMS, {
    rooms: getClientRooms(),
  })
}
