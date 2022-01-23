// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
import { freeice } from 'freeice'
import { useEffect, useRef, useCallback } from 'react'

import { socket } from '../socket'
import { ACTIONS } from '../socket/actions'

import { useStateWithCallback } from './useStateWithCallback'

export const LOCAL_VIDEO = 'LOCAL_VIDEO'

// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
export default function useWebRTC(roomID) {
  const [clients, updateClients] = useStateWithCallback([])

  const addNewClient = useCallback(
    (newClient, cb) => {
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-ignore
      updateClients((list) => {
        if (!list.includes(newClient)) {
          return [...list, newClient]
        }

        return list
      }, cb)
    },
    [clients, updateClients],
  )

  const peerConnections = useRef({})
  const localMediaStream = useRef(null)
  const peerMediaElements = useRef({
    [LOCAL_VIDEO]: null,
  })

  useEffect(() => {
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    async function handleNewPeer({ peerID, createOffer }) {
      if (peerID in peerConnections.current) {
        return console.warn(`Already connected to peer ${peerID}`)
      }

      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-ignore
      peerConnections.current[peerID] = new RTCPeerConnection({
        iceServers: freeice(),
      })
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-ignore
      peerConnections.current[peerID].onicecandidate = (event) => {
        if (event.candidate) {
          socket.emit(ACTIONS.RELAY_ICE, {
            peerID,
            iceCandidate: event.candidate,
          })
        }
      }

      let tracksNumber = 0
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-ignore
      peerConnections.current[peerID].ontrack = ({ streams: [remoteStream] }) => {
        tracksNumber++

        if (tracksNumber === 2) {
          // video & audio tracks received
          tracksNumber = 0
          addNewClient(peerID, () => {
            // eslint-disable-next-line @typescript-eslint/ban-ts-comment
            // @ts-ignore
            if (peerMediaElements.current[peerID]) {
              // eslint-disable-next-line @typescript-eslint/ban-ts-comment
              // @ts-ignore
              peerMediaElements.current[peerID].srcObject = remoteStream
            } else {
              // FIX LONG RENDER IN CASE OF MANY CLIENTS
              let settled = false
              const interval = setInterval(() => {
                // eslint-disable-next-line @typescript-eslint/ban-ts-comment
                // @ts-ignore
                if (peerMediaElements.current[peerID]) {
                  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
                  // @ts-ignore
                  peerMediaElements.current[peerID].srcObject = remoteStream
                  settled = true
                }

                if (settled) {
                  clearInterval(interval)
                }
              }, 1000)
            }
          })
        }
      }

      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-ignore
      localMediaStream.current.getTracks().forEach((track) => {
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        // @ts-ignore
        peerConnections.current[peerID].addTrack(track, localMediaStream.current)
      })

      if (createOffer) {
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        // @ts-ignore
        const offer = await peerConnections.current[peerID].createOffer()

        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        // @ts-ignore
        await peerConnections.current[peerID].setLocalDescription(offer)

        socket.emit(ACTIONS.RELAY_SDP, {
          peerID,
          sessionDescription: offer,
        })
      }
    }

    socket.on(ACTIONS.ADD_PEER, handleNewPeer)

    return () => {
      socket.off(ACTIONS.ADD_PEER)
    }
  }, [])

  useEffect(() => {
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    async function setRemoteMedia({ peerID, sessionDescription: remoteDescription }) {
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-ignore
      await peerConnections.current[peerID]?.setRemoteDescription(new RTCSessionDescription(remoteDescription))

      if (remoteDescription.type === 'offer') {
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        // @ts-ignore
        const answer = await peerConnections.current[peerID].createAnswer()

        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        // @ts-ignore
        await peerConnections.current[peerID].setLocalDescription(answer)

        socket.emit(ACTIONS.RELAY_SDP, {
          peerID,
          sessionDescription: answer,
        })
      }
    }

    socket.on(ACTIONS.SESSION_DESCRIPTION, setRemoteMedia)

    return () => {
      socket.off(ACTIONS.SESSION_DESCRIPTION)
    }
  }, [])

  useEffect(() => {
    socket.on(ACTIONS.ICE_CANDIDATE, ({ peerID, iceCandidate }) => {
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-ignore
      peerConnections.current[peerID]?.addIceCandidate(new RTCIceCandidate(iceCandidate))
    })

    return () => {
      socket.off(ACTIONS.ICE_CANDIDATE)
    }
  }, [])

  useEffect(() => {
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    const handleRemovePeer = ({ peerID }) => {
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-ignore
      if (peerConnections.current[peerID]) {
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        // @ts-ignore
        peerConnections.current[peerID].close()
      }

      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-ignore
      delete peerConnections.current[peerID]
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-ignore
      delete peerMediaElements.current[peerID]

      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-ignore
      updateClients((list) => list.filter((c) => c !== peerID))
    }

    socket.on(ACTIONS.REMOVE_PEER, handleRemovePeer)

    return () => {
      socket.off(ACTIONS.REMOVE_PEER)
    }
  }, [])

  useEffect(() => {
    async function startCapture() {
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-ignore
      localMediaStream.current = await navigator.mediaDevices.getUserMedia({
        audio: true,
        video: {
          width: 1280,
          height: 720,
        },
      })

      addNewClient(LOCAL_VIDEO, () => {
        const localVideoElement = peerMediaElements.current[LOCAL_VIDEO]

        if (localVideoElement) {
          // eslint-disable-next-line @typescript-eslint/ban-ts-comment
          // @ts-ignore
          localVideoElement.volume = 0
          // eslint-disable-next-line @typescript-eslint/ban-ts-comment
          // @ts-ignore
          localVideoElement.srcObject = localMediaStream.current
        }
      })
    }

    startCapture()
      .then(() => socket.emit(ACTIONS.JOIN, { room: roomID }))
      .catch((e) => console.error('Error getting userMedia:', e))

    return () => {
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-ignore
      localMediaStream.current.getTracks().forEach((track) => track.stop())

      socket.emit(ACTIONS.LEAVE)
    }
  }, [roomID])

  const provideMediaRef = useCallback((id, node) => {
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    peerMediaElements.current[id] = node
  }, [])

  return {
    clients,
    provideMediaRef,
  }
}
