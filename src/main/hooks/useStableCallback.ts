import React from 'react'

export const useStableCallback = <P extends Array<unknown>, R>(handler: (...params: P) => R): (...params: P) => R => {
    const handlerRef = React.useRef<(...params: P) => R>(handler)
    handlerRef.current = handler
    return React.useCallback((...params: P) => handlerRef.current(...params), [])
}
