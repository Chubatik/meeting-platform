import React, { useEffect, useState } from 'react'
import { useNavigate } from 'react-router'
import { v4 } from 'uuid'

import { socket } from '../../socket'
import { ACTIONS } from '../../socket/actions'

export const HomePage = () => {
  const navigate = useNavigate()
  const [rooms, setRooms] = useState([])

  useEffect(() => {
    socket.on(ACTIONS.SHARE_ROOMS, ({ rooms = [] } = {}) => {
      setRooms(rooms)
    })
  })

  const clickHandler = () => {
    navigate(`/room/${v4()}`)
  }
  return (
    <>
      <h1>Available rooms</h1>

      <ul>
        {rooms.map((roomID) => (
          <li key={roomID}>
            <span>{roomID}</span>
            <button>Join</button>
          </li>
        ))}
      </ul>
      <button onClick={clickHandler}>Create new room</button>
    </>
  )
}
