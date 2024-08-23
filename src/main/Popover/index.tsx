import type { PropsWithChildren } from 'react'
import React from 'react'
import classNames from 'classnames'
import ReactDOM from 'react-dom'
import { EMPTY_ARRAY, NOOP } from '../const'
import { useTooltipActive, useTooltipPosition } from './hooks'
import { DialogRef, DIALOG_DIRECTIONS, DIALOG_MODE, DialogOffset } from './utils'
import { useUpdateEffect } from '../hooks/useUpdateEffect'
import { useMergeTheme } from '../hooks/useMergeTheme'
import './index.css'

const defaultTheme = {
    tooltip: 'sgsavu-popover',
    tooltipContent: 'sgsavu-popover__content',
    tooltipSignpost: 'sgsavu-popover__signpost'
}

export type DialogProps = PropsWithChildren<{
    afterHide?: () => void
    afterShow?: () => void
    allowClick?: string | Array<string>
    anchorEdge?: DIALOG_DIRECTIONS
    anchorRef: React.RefObject<Element> | React.ForwardedRef<Element>
    closeOnWindowBlur?: boolean
    closeOnWindowResize?: boolean
    delay?: number
    disabled?: boolean
    mode?: DIALOG_MODE
    offset?: DialogOffset
    signpost?: boolean
    testId?: string
    theme?: Partial<typeof defaultTheme>
}>

export const Dialog = React.forwardRef<DialogRef, DialogProps>(({
    afterHide = NOOP,
    afterShow = NOOP,
    allowClick = EMPTY_ARRAY,
    anchorEdge = DIALOG_DIRECTIONS.TOP_MIDDLE,
    anchorRef,
    children,
    closeOnWindowBlur = true,
    closeOnWindowResize = true,
    delay = 0,
    disabled = false,
    mode = DIALOG_MODE.HOVER,
    offset,
    signpost = false,
    testId,
    theme
}, ref) => {
    const mergedTheme = useMergeTheme(defaultTheme, theme)
    
    const tooltipClass = classNames(
        mergedTheme.tooltip,
        {
            [mergedTheme.tooltipSignpost]: signpost
        }
    )

    const contentRef = React.useRef<HTMLDivElement>(null)
    const isActive = useTooltipActive(contentRef, anchorRef as React.RefObject<Element>, allowClick, closeOnWindowBlur, closeOnWindowResize, delay, disabled, mode, ref)
    const positionSet = useTooltipPosition(contentRef, anchorRef as React.RefObject<Element>, isActive, anchorEdge, offset)
    const [position] = positionSet ?? [undefined]

    useUpdateEffect(() => (isActive ? afterShow : afterHide)(), [afterHide, afterShow, isActive])

    return !isActive
        ? null
        : ReactDOM.createPortal(
            <div
                className={tooltipClass}
                ref={contentRef}
                style={position}
                data-testid={testId}
            >
                <div className={mergedTheme.tooltipContent}>
                    {children}
                </div>
            </div>,
            document.body)
})
