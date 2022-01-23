import React, { useEffect, useState } from 'react'

import { socket } from '../../socket'
import { ACTIONS } from '../../socket/actions'

import { PopUp } from './components/PopUp/PopUp'
import classes from './HomePage.module.scss'

export const HomePage = () => {
  // const navigate = useNavigate()
  const [rooms, setRooms] = useState([])
  const [buttonPopUp, setButtonPopUp] = useState(false)

  useEffect(() => {
    socket.on(ACTIONS.SHARE_ROOMS, ({ rooms = [] } = {}) => {
      setRooms(rooms)
    })
  })
  console.log(buttonPopUp)

  const clickHandler = () => {
    // navigate(`/room/${v4()}`)
    setButtonPopUp(true)
  }

  return (
    <div className={classes.textWrapper}>
      <h1>Anonymous video calls now!</h1>
      <h4>Consectetur sed dignissim id tellus vulputate. Egestas mi tristique ultricies interdum.</h4>
      <ul>
        {rooms.map((roomID) => (
          <li key={roomID}>
            <span>{roomID}</span>
            <button>Join</button>
          </li>
        ))}
      </ul>
      <button onClick={clickHandler}>
        <svg width="24" height="25" viewBox="0 0 24 25" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path
            d="M12 6.5V12.5M12 12.5V18.5M12 12.5H18M12 12.5H6"
            stroke="white"
            strokeWidth="2"
            strokeLinecap="round"
          />
        </svg>
        New meeting
      </button>
      <PopUp trigger={buttonPopUp} setTrigger={setButtonPopUp} />
    </div>
  )
}
