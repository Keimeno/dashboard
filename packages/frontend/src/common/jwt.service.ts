import Vue from 'vue'

const ACCESS_TOKEN = 'access_token'
const ID_TOKEN = 'id_token'

export const getAccessToken = (): string | null => {
    return window.localStorage.getItem(ACCESS_TOKEN)
}

export const saveAccessToken = (token: string) => {
    window.localStorage.setItem(ACCESS_TOKEN, token)
}

export const destroyAccessToken = () => {
    window.localStorage.removeItem(ACCESS_TOKEN)
}

export const getIdToken = (): string | null => {
    return window.localStorage.getItem(ID_TOKEN)
}

export const saveIdToken = (token: string) => {
    window.localStorage.setItem(ID_TOKEN, token)
}

export const saveIdTokenUpdateAuth = (token: string) => {
	let data: any
	try {
		// @ts-ignore caught if getIdToken returns null
		data = jwt.verify(token, publicAPIKey, {
			algorithms: ['RS256'],
		})
	} catch (err) {
		data = err
	} finally {
		saveIdToken(token);
		(Vue as any).setAuth(data)
	}
}

export const destroyIdToken = () => {
    window.localStorage.removeItem(ID_TOKEN)
}

export default {
    getAccessToken,
    saveAccessToken,
    destroyAccessToken,
    getIdToken,
    saveIdToken,
    destroyIdToken,
}
