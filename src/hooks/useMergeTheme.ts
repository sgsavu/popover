import classNames from "classnames"
import { useMemo } from "react"

export const useMergeTheme = <T extends Record<string, string>>(base: T, extend?: Partial<T>): T => useMemo<T>(
    () => (extend
        ? Object.keys(base).reduce((acc: Record<keyof T, string>, key: keyof T) => {
            const mergedClass = classNames(base[key], extend?.[key])
            acc[key] = mergedClass
            return acc
        }, {} as Record<keyof T, string>) as T
        : base
    ), [base, extend])