import { getMode } from '@/common/mode.service'

const mode = getMode() === null ? 'light' : getMode()

export default {
    isAuthenticated: false,
    mode,
    auth: {
        isAuthorized: false,
    },
}
