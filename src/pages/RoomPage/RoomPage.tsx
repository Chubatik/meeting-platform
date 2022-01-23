import { useParams } from 'react-router'

import useWebRTC, { LOCAL_VIDEO } from '../../hooks/useWebRTC'

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

  return (
    // eslint-disable-next-line react/react-in-jsx-scope
    <div
      style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        flexWrap: 'wrap',
        height: '100vh',
      }}
    >
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
