import { useState, useCallback, useRef, useEffect } from 'react'

// eslint-disable-next-line @typescript-eslint/ban-ts-comment
//@ts-ignore
export const useStateWithCallback = (initialState) => {
  const [state, setState] = useState(initialState)
  const cbRef = useRef(null)

  const updateState = useCallback((newState, cb) => {
    cbRef.current = cb

    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    //@ts-ignore
    setState((prev) => (typeof newState === 'function' ? newState(prev) : newState))
  }, [])

  useEffect(() => {
    if (cbRef.current) {
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-ignore
      cbRef.current(state)
      cbRef.current = null
    }
  }, [state])

  return [state, updateState]
}
