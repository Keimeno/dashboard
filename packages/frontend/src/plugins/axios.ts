import axios from 'axios'
import Vue from 'vue'

import { getAccessToken, getIdToken } from '@/common/jwt.service'
import { baseURL } from '@/common/config'

const axiosInstance = axios.create({
	baseURL,
	headers: {
		'Access-Token': getAccessToken(),
		'Id-Token': getIdToken(),
	},
})

// @ts-ignore
Vue.prototype.$http = axiosInstance
