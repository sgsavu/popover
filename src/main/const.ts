export const EMPTY_ARRAY = Object.freeze([]) as Array<never>
export const EMPTY_OBJECT = Object.freeze({}) as Record<string | number | symbol, never> 
export const NOOP = Object.freeze(() => {})
