export const set = (property: any) => (state: any, payload: any) =>
    (state[property] = payload)
export const toggle = (property: any) => (state: any) =>
    (state[property] = !state[property])
