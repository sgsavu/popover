export const ANCHOR_OFFSET = 10
export const CLAMP_OFFSET = 10

export interface DialogPosition {
    top: number
    left: number
    maxWidth?: number
}

export interface DialogOffset {
    top?: number
    left?: number
}

export interface DialogRef {
    show: () => void
    hide: () => void
}

export enum DIALOG_DIRECTIONS {
    BOTTOM_LEFT = 'bottomLeft',
    BOTTOM_MIDDLE = 'bottomMiddle',
    BOTTOM_RIGHT = 'bottomRight',
    RIGHT_TOP = 'rightTop',
    RIGHT_MIDDLE = 'rightMiddle',
    RIGHT_BOTTOM = 'rightBottom',
    TOP_LEFT = 'topLeft',
    TOP_MIDDLE = 'topMiddle',
    TOP_RIGHT = 'topRight',
    LEFT_MIDDLE = 'leftMiddle',
    LEFT_BOTTOM = 'leftBottom',
    LEFT_TOP = 'leftTop'
}

export enum DIALOG_MODE {
    CLICK = 'click',
    CLICK_OUTSIDE = 'none + clickOut',
    DOUBLE_CLICK = 'dblclick',
    HOVER = 'mouseenter',
    REF_ONLY = 'none'
}