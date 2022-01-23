import { useParams } from 'react-router'

import useWebRTC, { LOCAL_VIDEO } from '../../hooks/useWebRTC'

import classes from './RoomPage.module.scss'

function layout(clientsNumber = 1) {
  const pairs = Array.from({ length: clientsNumber }).reduce((acc, next, index, arr) => {
    if (index % 2 === 0) {
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-ignore
      acc.push(arr.slice(index, index + 2))
    }

    return acc
  }, [])

  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
  // @ts-ignore
  const rowsNumber = pairs.length
  const height = `${100 / rowsNumber}%`

  return (
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    pairs
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-ignore
      .map((row, index, arr) => {
        if (index === arr.length - 1 && row.length === 1) {
          return [
            {
              width: '100%',
              height,
            },
          ]
        }

        return row.map(() => ({
          width: '50%',
          height,
        }))
      })
      .flat()
  )
}

export function RoomPage() {
  const { id: roomID } = useParams()
  const { clients, provideMediaRef } = useWebRTC(roomID)
  const videoLayout = layout(clients.length)
  const today = new Date()

  const date = today.getFullYear() + '-' + (today.getMonth() + 1) + '-' + today.getDate()

  return (
    // eslint-disable-next-line react/react-in-jsx-scope
    <div className={classes.roomWrapper}>
      {/* eslint-disable-next-line react/react-in-jsx-scope */}
      <div className={classes.headerWrapper}>
        {/* eslint-disable-next-line react/react-in-jsx-scope */}
        <h6>{date}</h6>
        {/* eslint-disable-next-line react/react-in-jsx-scope */}
        <button>
          {/* eslint-disable-next-line react/react-in-jsx-scope */}
          <svg width="32" height="32" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
            {/* eslint-disable-next-line react/react-in-jsx-scope */}
            <path
              d="M20 10.6667V21.3333H6.66667V10.6667H20ZM21.3333 8H5.33333C4.6 8 4 8.6 4 9.33333V22.6667C4 23.4 4.6 24 5.33333 24H21.3333C22.0667 24 22.6667 23.4 22.6667 22.6667V18L28 23.3333V8.66667L22.6667 14V9.33333C22.6667 8.6 22.0667 8 21.3333 8Z"
              fill="#FF7E05"
            />
          </svg>
        </button>
        {/* eslint-disable-next-line react/react-in-jsx-scope */}
        <button>
          {/* eslint-disable-next-line react/react-in-jsx-scope */}
          <svg width="32" height="32" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
            {/* eslint-disable-next-line react/react-in-jsx-scope */}
            <path
              d="M16.0003 18.6665C18.2137 18.6665 20.0003 16.8798 20.0003 14.6665V6.6665C20.0003 4.45317 18.2137 2.6665 16.0003 2.6665C13.787 2.6665 12.0003 4.45317 12.0003 6.6665V14.6665C12.0003 16.8798 13.787 18.6665 16.0003 18.6665ZM14.667 6.6665C14.667 5.93317 15.267 5.33317 16.0003 5.33317C16.7337 5.33317 17.3337 5.93317 17.3337 6.6665V14.6665C17.3337 15.3998 16.7337 15.9998 16.0003 15.9998C15.267 15.9998 14.667 15.3998 14.667 14.6665V6.6665ZM22.667 14.6665C22.667 18.3465 19.6803 21.3332 16.0003 21.3332C12.3203 21.3332 9.33366 18.3465 9.33366 14.6665H6.66699C6.66699 19.3732 10.147 23.2398 14.667 23.8932V27.9998H17.3337V23.8932C21.8537 23.2398 25.3337 19.3732 25.3337 14.6665H22.667Z"
              fill="#FF7E05"
            />
          </svg>
        </button>
        {/* eslint-disable-next-line react/react-in-jsx-scope */}
        <button className={classes.leaveButton}>
          {/* eslint-disable-next-line react/react-in-jsx-scope */}
          Leave
        </button>
      </div>
      {
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        // @ts-ignore
        clients.map((clientID, index) => {
          return (
            // eslint-disable-next-line react/react-in-jsx-scope
            <div key={clientID} style={videoLayout[index]} id={clientID}>
              {/* eslint-disable-next-line react/react-in-jsx-scope */}
              <video
                width="100%"
                height="100%"
                ref={(instance) => {
                  provideMediaRef(clientID, instance)
                }}
                autoPlay
                playsInline
                muted={clientID === LOCAL_VIDEO}
              />
            </div>
          )
        })
      }
    </div>
  )
}
