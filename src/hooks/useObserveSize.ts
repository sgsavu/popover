import { useLayoutEffect } from "react"
import ReactDOM from 'react-dom'

export type UseMeasureSizeRef<E extends Element> = (el: E | null) => void
export type UseMeasureSizeRect = Pick<DOMRectReadOnly, 'width' | 'height'>
export type UseMeasureSizeReturn<E extends Element> = [UseMeasureSizeRef<E>, UseMeasureSizeRect | undefined]

type ResizeCallback = (rect: UseMeasureSizeRect) => void

const targetSetter = new Map<Element, ResizeCallback>()
const targetSizeRef = new Map<Element, UseMeasureSizeRect>()

const onChangeObserved: ResizeObserverCallback = entries => {
    ReactDOM.unstable_batchedUpdates(() => {
        entries.forEach(entry => {
            const { contentRect, target } = entry
            const { width, height } = contentRect

            const setBounds = targetSetter.get(target)
            const prevBounds = targetSizeRef.get(target)

            const hasSizeChange = !prevBounds || width !== prevBounds.width || height !== prevBounds.height

            if (hasSizeChange && setBounds) {
                const nextSize = { width, height }
                targetSizeRef.set(target, nextSize)
                setBounds(nextSize)
            }
        })
    })
}

const globalObserver = new ResizeObserver(onChangeObserved)
const groupObserverMap = new Map<string, ResizeObserver>()

const getObserverForMeasureGroup = (measureGroup: string): ResizeObserver => {
    if (!groupObserverMap.has(measureGroup)) {
        const groupObserver = new ResizeObserver(onChangeObserved)
        groupObserverMap.set(measureGroup, groupObserver)
    }

    // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
    return groupObserverMap.get(measureGroup)!
}

export const useObserveSize = <E extends Element>(target: E | null, onSizeChanged: ResizeCallback, measureGroup?: string): void => useLayoutEffect(() => {
    if (!target) { return undefined }

    targetSetter.set(target, onSizeChanged)

    const targetObserver = measureGroup ? getObserverForMeasureGroup(measureGroup) : globalObserver
    targetObserver.observe(target)

    return () => {
        targetSetter.delete(target)
        targetSizeRef.delete(target)

        targetObserver.unobserve(target)
    }
}, [measureGroup, onSizeChanged, target])