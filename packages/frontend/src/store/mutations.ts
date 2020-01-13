import axios from 'axios'
import Vue from 'vue'
import { getAccessToken, getIdToken } from '@/common/jwt.service'
import { baseURL } from '@/common/config'
import { setMode as setModeService, getMode } from '@/common/mode.service'

export default {
	checkAuthenticated(store: any) {
		if (getAccessToken()) {
			store.isAuthenticated = true
		}
	},
	setAuthenticated(store: any, isAuthenticated: boolean) {
		store.isAuthenticated = isAuthenticated
	},
	setAuth(store: any, auth: Object) {
		store.auth = auth
	},
	setMode(store: any, mode: string) {
		store.mode = mode
		setModeService(mode)
	},
	checkMode(store: any) {
		store.mode = getMode()
	},
	updateAxiosInstance(store: any) {
		const axiosInstance = axios.create({
			baseURL,
			headers: {
				'Access-Token': getAccessToken(),
				'Id-Token': getIdToken(),
			},
		})

		// @ts-ignore
		Vue.prototype.$http = axiosInstance
	},
}
