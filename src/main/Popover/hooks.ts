import React from 'react'
import { DialogRef, DIALOG_DIRECTIONS, DIALOG_MODE, DialogOffset, DialogPosition } from './const'
import { getPosition } from './utils'
import { useObserveSize } from '../hooks/useObserveSize'
import { useStableCallback } from '../hooks/useStableCallback'

const noHandlerModes = [DIALOG_MODE.REF_ONLY, DIALOG_MODE.CLICK_OUTSIDE]

export const useTooltipActive = (
    contentRef: React.RefObject<Element>,
    ownerRef: React.RefObject<Element>,
    allowClick: string | Array<string>,
    closeOnWindowBlur: boolean,
    closeOnWindowResize: boolean,
    delay: number,
    disabled: boolean,
    mode: DIALOG_MODE,
    ref?: React.ForwardedRef<DialogRef>
): boolean => {
    const isClickMode = mode === DIALOG_MODE.CLICK || mode === DIALOG_MODE.DOUBLE_CLICK

    const [isActive, setActive] = React.useState(false)
    const activeRef = React.useRef<boolean>(false)
    activeRef.current = isActive

    const timerRef = React.useRef<number | undefined>()

    // These two refs solve the problem of inter-dependency between the two actions
    const setHiddenRef = React.useRef<(evt?: Event) => void>()
    const setShownRef = React.useRef<(evt?: Event) => void>()

    const setHidden = useStableCallback((evt?: Event) => {
        const classTargets = Array.isArray(allowClick) ? allowClick : [allowClick]
        const tooltipClick = evt?.composedPath().some(elEntry =>
            elEntry === contentRef.current ||
            classTargets.some(className => (elEntry as Element).classList?.contains(className)))

        if (tooltipClick) { return }

        // This timeout resolves an issue wherein React renders the component (due to setState) somewhere between setHidden is triggered in capture
        // and setShown is triggered in bubbling phase. Due to how some apps behave we cannot use stopPropagation after a successful setHidden
        setTimeout(() => { setActive(false) }, 0)

        window.clearTimeout(timerRef.current)
        timerRef.current = undefined

        // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
        const setHiddenCallback = setHiddenRef.current!
        window.removeEventListener('click', setHiddenCallback, { capture: true })
        window.removeEventListener('resize', setHiddenCallback)
        window.removeEventListener('blur', setHiddenCallback)
    })

    const setShown = useStableCallback(() => {
        // Avoids clicks in the same capture/bubble cycle as a setHidden
        if (activeRef.current) { return }

        // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
        const setHiddenCallback = setHiddenRef.current!

        if (isClickMode || mode === DIALOG_MODE.CLICK_OUTSIDE) {
            window.addEventListener('click', setHiddenCallback, { capture: true })
        }
        if (closeOnWindowResize) {
            window.addEventListener('resize', setHiddenCallback)
        }
        if (closeOnWindowBlur) {
            window.addEventListener('blur', setHiddenCallback)
        }

        if (!timerRef.current) {
            if (delay) {
                timerRef.current = window.setTimeout(
                    () => {
                        window.clearTimeout(timerRef.current)
                        timerRef.current = undefined

                        setActive(true)
                    }, delay)
            } else {
                setActive(true)
            }
        }
    })

    setHiddenRef.current = setHidden
    setShownRef.current = setShown

    React.useImperativeHandle(ref, () => ({
        show: () => setShown(),
        hide: () => setHidden()
    }), [setHidden, setShown])

    React.useEffect(() => {
        const tgElement = ownerRef.current

        if (tgElement && !disabled) {
            /* eslint-disable @typescript-eslint/no-non-null-assertion */
            const setShownCallback = setShownRef.current!
            const setHiddenCallback = setHiddenRef.current!
            /* eslint-enable @typescript-eslint/no-non-null-assertion */

            if (!noHandlerModes.includes(mode)) {
                tgElement.addEventListener(mode, setShownCallback)
                if (!isClickMode) {
                    tgElement.addEventListener('mouseleave', setHiddenCallback)
                }
            }

            return () => {
                setHiddenCallback()

                if (mode !== DIALOG_MODE.REF_ONLY) {
                    if (mode !== DIALOG_MODE.CLICK_OUTSIDE) {
                        tgElement.removeEventListener(mode, setShownCallback)
                        tgElement.removeEventListener('mouseleave', setHiddenCallback)
                    }
                    window.removeEventListener('click', setHiddenCallback)
                }
            }
        }

        return undefined
    }, [disabled, isClickMode, mode, ownerRef])

    return isActive
}

export const useTooltipPosition = (
    contentRef: React.RefObject<Element>,
    anchorRef: React.RefObject<Element>,
    isActive: boolean,
    anchorEdge: DIALOG_DIRECTIONS,
    offset?: DialogOffset
): [DialogPosition, DIALOG_DIRECTIONS] | undefined => {
    const [position, setPosition] = React.useState<[DialogPosition, DIALOG_DIRECTIONS] | undefined>()

    const updatePosition = useStableCallback(() => {
        setPosition(getPosition(anchorRef.current, contentRef.current, anchorEdge, offset))
    })

    // When configuration changes on the fly
    React.useEffect(
        () => { if (isActive) { updatePosition() } },
        [isActive, offset, anchorRef, contentRef, anchorEdge, updatePosition])

    // When content size changes
    useObserveSize(isActive ? contentRef.current : null, updatePosition)
    // When window size changes
    useObserveSize(isActive ? document.body : null, updatePosition)

    return position
}
