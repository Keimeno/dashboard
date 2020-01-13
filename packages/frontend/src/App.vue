<template>
    <v-app style="background-color: var(--v-background-base)">
        <div v-if="$store.state.isAuthenticated">
            <core-app-bar />
            <core-drawer />
            <core-view />
        </div>
        <div v-else>
            <router-view></router-view>
        </div>
        <build />
    </v-app>
</template>

<script lang="ts">
import Vue from 'vue'
import jwt from 'jsonwebtoken'
import { mapMutations } from 'vuex'
import { getIdToken, saveIdToken } from './common/jwt.service'
import { publicAPIKey } from './common/config'
import { AxiosResponse } from 'axios'

export default Vue.extend({
	name: 'App',
	components: {
		CoreDrawer: () => import('@/components/core/Drawer.vue'),
		CoreAppBar: () => import('@/components/core/AppBar.vue'),
		CoreView: () => import('@/components/core/View.vue'),
	},
	data: () => ({}),
	methods: {
		...mapMutations(['checkAuthenticated', 'checkMode', 'setAuth']),
	},
	created() {
		this.checkAuthenticated()
		this.checkMode()

		if (!this.$store.state.isAuthenticated) {
			this.$router.push('login')
		} else {
			let data: any
			try {
				// @ts-ignore caught if getIdToken returns null
				data = jwt.verify(getIdToken(), publicAPIKey, {
					algorithms: ['RS256'],
				})
			} catch (err) {
				data = err
			} finally {
				if (data['message'] !== undefined) {
					;(this as any).$http
						.get('/auth/retrieveUser')
						.then((response: AxiosResponse) => {
							this.setAuth(response.data['body'])
							saveIdToken(response.data['id_token'])
						})
				} else {
					this.setAuth(data)
				}
			}
		}
	},
})
</script>
