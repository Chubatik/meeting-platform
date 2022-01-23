import { ACTIONS } from '../socket/actions'

import { io } from './index'

// eslint-disable-next-line @typescript-eslint/no-var-requires
const { version, validate } = require('uuid')

export const getClients = (roomID: string) => Array.from(io.sockets.adapter.rooms.get(roomID) || [])

const getClientRooms = () => {
  const { rooms } = io.sockets.adapter

  return Array.from(rooms.keys()).filter((roomID) => validate(roomID) && version(roomID) === 4)
}

export const shareRoomsInfo = () => {
  io.emit(ACTIONS.SHARE_ROOMS, {
    rooms: getClientRooms(),
  })
}
