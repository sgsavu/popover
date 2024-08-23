import { ANCHOR_OFFSET, CLAMP_OFFSET, DIALOG_DIRECTIONS, DialogOffset, DialogPosition } from "./const"

const getOppositeDirection = (direction?: DIALOG_DIRECTIONS): DIALOG_DIRECTIONS => {
    switch (direction) {
        case DIALOG_DIRECTIONS.BOTTOM_LEFT:
        case DIALOG_DIRECTIONS.BOTTOM_MIDDLE:
        case DIALOG_DIRECTIONS.BOTTOM_RIGHT:
            return DIALOG_DIRECTIONS.TOP_MIDDLE

        case DIALOG_DIRECTIONS.LEFT_TOP:
        case DIALOG_DIRECTIONS.LEFT_MIDDLE:
        case DIALOG_DIRECTIONS.LEFT_BOTTOM:
            return DIALOG_DIRECTIONS.RIGHT_MIDDLE

        case DIALOG_DIRECTIONS.RIGHT_TOP:
        case DIALOG_DIRECTIONS.RIGHT_MIDDLE:
        case DIALOG_DIRECTIONS.RIGHT_BOTTOM:
            return DIALOG_DIRECTIONS.LEFT_MIDDLE

        case DIALOG_DIRECTIONS.TOP_LEFT:
        case DIALOG_DIRECTIONS.TOP_MIDDLE:
        case DIALOG_DIRECTIONS.TOP_RIGHT:
        default: return DIALOG_DIRECTIONS.BOTTOM_MIDDLE
    }
}

const getCrossDirection = (direction?: DIALOG_DIRECTIONS): DIALOG_DIRECTIONS => {
    switch (direction) {
        case DIALOG_DIRECTIONS.BOTTOM_LEFT: return DIALOG_DIRECTIONS.TOP_RIGHT
        case DIALOG_DIRECTIONS.BOTTOM_MIDDLE: return DIALOG_DIRECTIONS.TOP_MIDDLE
        case DIALOG_DIRECTIONS.BOTTOM_RIGHT: return DIALOG_DIRECTIONS.TOP_LEFT

        case DIALOG_DIRECTIONS.RIGHT_TOP: return DIALOG_DIRECTIONS.LEFT_BOTTOM
        case DIALOG_DIRECTIONS.RIGHT_MIDDLE: return DIALOG_DIRECTIONS.LEFT_MIDDLE
        case DIALOG_DIRECTIONS.RIGHT_BOTTOM: return DIALOG_DIRECTIONS.LEFT_TOP

        case DIALOG_DIRECTIONS.TOP_LEFT: return DIALOG_DIRECTIONS.BOTTOM_RIGHT
        case DIALOG_DIRECTIONS.TOP_MIDDLE: return DIALOG_DIRECTIONS.BOTTOM_MIDDLE
        case DIALOG_DIRECTIONS.TOP_RIGHT: return DIALOG_DIRECTIONS.BOTTOM_LEFT

        case DIALOG_DIRECTIONS.LEFT_MIDDLE: return DIALOG_DIRECTIONS.RIGHT_MIDDLE
        case DIALOG_DIRECTIONS.LEFT_BOTTOM: return DIALOG_DIRECTIONS.RIGHT_TOP
        case DIALOG_DIRECTIONS.LEFT_TOP: return DIALOG_DIRECTIONS.RIGHT_BOTTOM

        default: return DIALOG_DIRECTIONS.RIGHT_MIDDLE
    }
}

type GetPosition = (tipWidth: number, tipHeight: number,
    ownerLeft: number, ownerTop: number, ownerWidth: number, ownerHeight: number,
    offsetLeft: number, offsetTop: number) => DialogPosition

const offsetPos = (ownerEdge: number, size: number, offset: number) => ownerEdge + size + offset + ANCHOR_OFFSET
const offsetNeg = (ownerEdge: number, size: number, offset: number) => ownerEdge - size - offset - ANCHOR_OFFSET

// BOTTOM //////////
const getBottomLeft: GetPosition = (tipWidth, tipHeight, ownerLeft, ownerTop, ownerWidth, ownerHeight, offsetLeft, offsetTop) => ({
    left: ownerLeft + offsetLeft,
    top: offsetPos(ownerTop, ownerHeight, offsetTop)
})

const getBottomMiddle: GetPosition = (tipWidth, tipHeight, ownerLeft, ownerTop, ownerWidth, ownerHeight, offsetLeft, offsetTop) => ({
    left: ownerLeft + offsetLeft + (ownerWidth - tipWidth) / 2,
    top: offsetPos(ownerTop, ownerHeight, offsetTop)
})

const getBottomRight: GetPosition = (tipWidth, tipHeight, ownerLeft, ownerTop, ownerWidth, ownerHeight, offsetLeft, offsetTop) => ({
    left: ownerLeft + ownerWidth + offsetLeft,
    top: offsetPos(ownerTop, ownerHeight, offsetTop)
})


// RIGHT //////////
const getRightTop: GetPosition = (tipWidth, tipHeight, ownerLeft, ownerTop, ownerWidth, ownerHeight, offsetLeft, offsetTop) => ({
    left: offsetPos(ownerLeft, ownerWidth, offsetLeft),
    top: ownerTop + offsetTop
})

const getRightMiddle: GetPosition = (tipWidth, tipHeight, ownerLeft, ownerTop, ownerWidth, ownerHeight, offsetLeft) => ({
    left: offsetPos(ownerLeft, ownerWidth, offsetLeft),
    top: ownerTop + (ownerHeight - tipHeight) / 2
})

const getRightBottom: GetPosition = (tipWidth, tipHeight, ownerLeft, ownerTop, ownerWidth, ownerHeight, offsetLeft) => ({
    left: offsetPos(ownerLeft, ownerWidth, offsetLeft),
    top: ownerTop + ownerHeight - tipHeight
})


// TOP //////////
const getTopLeft: GetPosition = (tipWidth, tipHeight, ownerLeft, ownerTop, ownerWidth, ownerHeight, offsetLeft, offsetTop) => ({
    left: ownerLeft + offsetLeft,
    top: offsetNeg(ownerTop, tipHeight, offsetTop)
})

const getTopMiddle: GetPosition = (tipWidth, tipHeight, ownerLeft, ownerTop, ownerWidth, ownerHeight, offsetLeft, offsetTop) => ({
    left: ownerLeft + offsetLeft + (ownerWidth - tipWidth) / 2,
    top: offsetNeg(ownerTop, tipHeight, offsetTop)
})

const getTopRight: GetPosition = (tipWidth, tipHeight, ownerLeft, ownerTop, ownerWidth, ownerHeight, offsetLeft, offsetTop) => ({
    left: ownerLeft + ownerWidth + offsetLeft,
    top: offsetNeg(ownerTop, tipHeight, offsetTop)
})


// LEFT //////////
const getLeftTop: GetPosition = (tipWidth, tipHeight, ownerLeft, ownerTop, ownerWidth, ownerHeight, offsetLeft, offsetTop) => ({
    left: offsetNeg(ownerLeft, tipWidth, offsetLeft),
    top: ownerTop + offsetTop
})

const getLeftMiddle: GetPosition = (tipWidth, tipHeight, ownerLeft, ownerTop, ownerWidth, ownerHeight, offsetLeft) => ({
    left: offsetNeg(ownerLeft, tipWidth, offsetLeft),
    top: ownerTop + (ownerHeight - tipHeight) / 2
})

const getLeftBottom: GetPosition = (tipWidth, tipHeight, ownerLeft, ownerTop, ownerWidth, ownerHeight, offsetLeft) => ({
    left: offsetNeg(ownerLeft, tipWidth, offsetLeft),
    top: ownerTop + ownerHeight - tipHeight
})

const getPositionFormula = (direction?: DIALOG_DIRECTIONS): GetPosition => {
    switch (direction) {
        case DIALOG_DIRECTIONS.BOTTOM_LEFT: return getBottomLeft
        case DIALOG_DIRECTIONS.BOTTOM_MIDDLE: return getBottomMiddle
        case DIALOG_DIRECTIONS.BOTTOM_RIGHT: return getBottomRight
        case DIALOG_DIRECTIONS.RIGHT_TOP: return getRightTop
        case DIALOG_DIRECTIONS.RIGHT_MIDDLE: return getRightMiddle
        case DIALOG_DIRECTIONS.RIGHT_BOTTOM: return getRightBottom
        case DIALOG_DIRECTIONS.TOP_LEFT: return getTopLeft
        case DIALOG_DIRECTIONS.TOP_MIDDLE: return getTopMiddle
        case DIALOG_DIRECTIONS.TOP_RIGHT: return getTopRight
        case DIALOG_DIRECTIONS.LEFT_MIDDLE: return getLeftMiddle
        case DIALOG_DIRECTIONS.LEFT_BOTTOM: return getLeftBottom
        case DIALOG_DIRECTIONS.LEFT_TOP: return getLeftTop
        default: return getBottomMiddle
    }
}

const isOutOfBounds = (pos: DialogPosition, tipWidth: number, tipHeight: number, direction?: DIALOG_DIRECTIONS): boolean => {
    switch (direction) {
        case DIALOG_DIRECTIONS.LEFT_TOP:
        case DIALOG_DIRECTIONS.LEFT_MIDDLE:
        case DIALOG_DIRECTIONS.LEFT_BOTTOM:
        case DIALOG_DIRECTIONS.RIGHT_TOP:
        case DIALOG_DIRECTIONS.RIGHT_MIDDLE:
        case DIALOG_DIRECTIONS.RIGHT_BOTTOM: {
            const width = window.innerWidth
            return pos.left < CLAMP_OFFSET || (pos.left + tipWidth + CLAMP_OFFSET) > width
        }
        case DIALOG_DIRECTIONS.TOP_LEFT:
        case DIALOG_DIRECTIONS.TOP_MIDDLE:
        case DIALOG_DIRECTIONS.TOP_RIGHT:
        case DIALOG_DIRECTIONS.BOTTOM_LEFT:
        case DIALOG_DIRECTIONS.BOTTOM_MIDDLE:
        case DIALOG_DIRECTIONS.BOTTOM_RIGHT:
        default: {
            const height = window.innerHeight
            return pos.top < CLAMP_OFFSET || (pos.top + tipHeight + CLAMP_OFFSET) > height
        }
    }
}

const clampDependantAxis = (pos: DialogPosition, tipWidth: number, tipHeight: number, direction?: DIALOG_DIRECTIONS): DialogPosition => {
    switch (direction) {
        case DIALOG_DIRECTIONS.LEFT_TOP:
        case DIALOG_DIRECTIONS.LEFT_MIDDLE:
        case DIALOG_DIRECTIONS.LEFT_BOTTOM:
        case DIALOG_DIRECTIONS.RIGHT_TOP:
        case DIALOG_DIRECTIONS.RIGHT_MIDDLE:
        case DIALOG_DIRECTIONS.RIGHT_BOTTOM: {
            const height = window.innerHeight
            const clampedTop = Math.max(CLAMP_OFFSET, Math.min(pos.top, height - tipHeight - CLAMP_OFFSET))
            return clampedTop === pos.top ? pos : { ...pos, top: clampedTop }
        }
        case DIALOG_DIRECTIONS.TOP_LEFT:
        case DIALOG_DIRECTIONS.TOP_MIDDLE:
        case DIALOG_DIRECTIONS.TOP_RIGHT:
        case DIALOG_DIRECTIONS.BOTTOM_LEFT:
        case DIALOG_DIRECTIONS.BOTTOM_MIDDLE:
        case DIALOG_DIRECTIONS.BOTTOM_RIGHT:
        default: {
            const width = window.innerWidth
            const clampedLeft = Math.max(CLAMP_OFFSET, Math.min(pos.left, width - tipWidth - CLAMP_OFFSET))
            return clampedLeft === pos.left ? pos : { ...pos, left: clampedLeft }
        }
    }
}

const clampBothAxes = (position: DialogPosition, tipWidth: number, tipHeight: number): DialogPosition => {
    const { left: prevLeft, top: prevTop } = position
    const { clientHeight, clientWidth } = document.documentElement

    const left = Math.trunc(Math.max(CLAMP_OFFSET, Math.min(clientWidth - tipWidth - CLAMP_OFFSET, prevLeft)))
    const top = Math.trunc(Math.max(CLAMP_OFFSET, Math.min(clientHeight - tipHeight - CLAMP_OFFSET, prevTop)))
    const maxWidth = Math.trunc(clientWidth - CLAMP_OFFSET * 2)

    return { ...position, left, maxWidth, top }
}

export const getPosition = (
    ownerNode: Element | null,
    contentNode: Element | null,
    direction: DIALOG_DIRECTIONS,
    offset?: DialogOffset): [DialogPosition, DIALOG_DIRECTIONS] | undefined => {
    if (!ownerNode || !contentNode) { return undefined }

    const { width: tipWidth, height: tipHeight } = contentNode.getBoundingClientRect()
    const { width: ownerWidth, height: ownerHeight, left: ownerLeft, top: ownerTop } = ownerNode.getBoundingClientRect()

    const getDesiredPosition = getPositionFormula(direction)
    const desiredPosition = getDesiredPosition(
        tipWidth,
        tipHeight,
        ownerLeft,
        ownerTop,
        ownerWidth,
        ownerHeight,
        offset?.left ?? 0,
        offset?.top ?? 0)
    const clampedPosition = clampDependantAxis(desiredPosition, tipWidth, tipHeight, direction)

    if (isOutOfBounds(desiredPosition, tipWidth, tipHeight, direction)) {
        const oppositeDirection = getOppositeDirection(direction)
        const getOppositePosition = getPositionFormula(oppositeDirection)
        const oppositePosition = getOppositePosition(
            tipWidth,
            tipHeight,
            ownerLeft,
            ownerTop,
            ownerWidth,
            ownerHeight,
            0,
            0)
        const clampedOppositePosition = clampDependantAxis(oppositePosition, tipWidth, tipHeight, oppositeDirection)

        if (!isOutOfBounds(oppositePosition, tipWidth, tipHeight, oppositeDirection)) {
            return [clampBothAxes(clampedOppositePosition, tipWidth, tipHeight), oppositeDirection]
        }

        // NOTE At this point we have exhausted reasonable positions based on the desired direction
        // As such, we now abandon alignment and offsets in order to find a fitting position for the tooltip

        const crossDirection = getCrossDirection(direction)
        const getCrossPosition = getPositionFormula(crossDirection)
        const crossPosition = getCrossPosition(
            tipWidth,
            tipHeight,
            ownerLeft,
            ownerTop,
            ownerWidth,
            ownerHeight,
            0,
            0)
        const clampedCrossPosition = clampDependantAxis(crossPosition, tipWidth, tipHeight, crossDirection)

        if (!isOutOfBounds(crossPosition, tipWidth, tipHeight, crossDirection)) {
            return [clampBothAxes(clampedCrossPosition, tipWidth, tipHeight), crossDirection]
        }

        const crossOppositeDirection = getOppositeDirection(crossDirection)
        const getCrossOppositePosition = getPositionFormula(crossOppositeDirection)
        const crossOppositePosition = getCrossOppositePosition(
            tipWidth,
            tipHeight,
            ownerLeft,
            ownerTop,
            ownerWidth,
            ownerHeight,
            0,
            0)
        const clampedCrossOppositePosition = clampDependantAxis(crossOppositePosition, tipWidth, tipHeight, crossOppositeDirection)

        if (!isOutOfBounds(clampedCrossOppositePosition, tipWidth, tipHeight, crossOppositeDirection)) {
            return [clampBothAxes(clampedCrossOppositePosition, tipWidth, tipHeight), crossOppositeDirection]
        }
    }

    return [clampBothAxes(clampedPosition, tipWidth, tipHeight), direction]
}
