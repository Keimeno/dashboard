const MODE_KEY = 'mode'

export const getMode = (): string => {
    const mode = window.localStorage.getItem(MODE_KEY)
    return mode === null ? 'light' : mode
}

export const setMode = (mode: string) => {
    window.localStorage.setItem(MODE_KEY, mode)
}
