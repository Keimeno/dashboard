<template>
    <v-navigation-drawer
        id="app-drawer"
        v-model="inputValue"
        app
        color="grey darken-4"
        dark
        floating
        mobile-break-point="991"
        persistent
        :mini-variant="this.$store.state.app.drawerExpanded"
        width="260"
    >
        <template v-slot:img="attrs">
            <v-img v-bind="attrs" gradient="to top, rgba(0, 0, 0, .7), rgba(0, 0, 0, .7)" />
        </template>

        <v-list-item two-line>
            <v-list-item-avatar color="transparent">
                <v-img src="@/assets/logo.png" height="48" contain />
            </v-list-item-avatar>

            <v-list-item-title class="title">DASHBOARD</v-list-item-title>
        </v-list-item>

        <v-divider class="mx-3 mb-3" />

        <v-list nav>
            <div />

            <div v-for="(link, i) in links" :key="i">
                <v-list-item
                    class="pt-1 pb-1 mb-1 mt-1"
                    v-if="!link.isNested && clientHasLinkViewPermissions(link.requiresStaff, isStaff)"
                    :to="link.to"
                    active-class="primary white--text"
                >
                    <v-list-item-action>
                        <v-icon>{{ link.icon }}</v-icon>
                    </v-list-item-action>

                    <v-list-item-title v-text="$t('nav.' + link.text)" />
                </v-list-item>

                <v-list-group
                    v-else-if="link.isNested && clientHasLinkViewPermissions(link.requiresStaff, isStaff)"
                    :prepend-icon="link.icon"
                    color="white"
                    :to="link.to"
                    active-class="grey darken-3 white--text"
                    :value="currentParent === link.text"
                >
                    <template v-slot:activator>
                        <v-list-item-title>{{ $t('nav.' + link.text + '.entry') }}</v-list-item-title>
                    </template>

                    <v-list-item
                        v-for="(nLink, ni) in link.children"
                        :key="ni"
                        :to="nLink.external ? '' : nLink.to"
                        @click="nLink.external ? openLink(nLink.to) : ''"
                        active-class="primary white--text"
                        style="width:225px; margin-left:auto; margin-right:0;"
                    >
                        <v-list-item-action>
                            <v-icon>{{ nLink.icon }}</v-icon>
                        </v-list-item-action>

                        <v-list-item-title v-text="$t('nav.' + link.text + '.' + nLink.text)" />
                    </v-list-item>
                </v-list-group>
            </div>
        </v-list>

        <template v-slot:append>
            <v-list nav>
                <v-list-item @click="logout" to="/login">
                    <v-list-item-action>
                        <v-icon>mdi-account-minus</v-icon>
                    </v-list-item-action>

                    <v-list-item-title class="font-weight-light">Logout</v-list-item-title>
                </v-list-item>
            </v-list>
        </template>
    </v-navigation-drawer>
</template>

<style lang="scss" scoped>
#app-drawer {
	::-webkit-scrollbar {
		width: 0px;
		background: transparent;
	}
}
</style>

<script lang="ts">
import Vue from 'vue'
import { mapMutations, mapState } from 'vuex'
import { destroyAccessToken, destroyIdToken } from '../../common/jwt.service'
import { drawerLinks } from '../../common/config'
import { AxiosResponse } from 'axios'

export default Vue.extend({
	props: {
		opened: {
			type: Boolean,
			default: false,
		},
	},
	data: () => ({
		isStaff: false,
		links: drawerLinks,
	}),

	computed: {
		...mapState('app', ['image', 'color']),
		inputValue: {
			get() {
				return (this as any).$store.state.app.drawer
			},
			set(val) {
				;(this as any).setDrawer(val)
			},
		},
		currentParent() {
			const paths = this.$route.fullPath.split('/')
			return paths[1]
		},
	},

	mounted() {
		// Will continuously check if a user is authorized, until the response from the API endpoint is recieved.
		const auth = (this as any).$store.state.auth
		if (auth['isAuthorized']) {
			if (auth['isStaff']) {
				;(this as any).isStaff = true
			}
		} else {
			;(this as any).$http
				.get('/auth/retrieveUser')
				.then((response: AxiosResponse) => {
					;(this as any).setAuth(response.data['body'])

					if (response.data['body']['isStaff']) {
						;(this as any).isStaff = true
					}
				})
		}
	},

	methods: {
		...mapMutations('app', ['setDrawer', 'setDrawerExpanded']),
		...mapMutations(['setAuthenticated', 'setAuth']),
		logout() {
			destroyAccessToken()
			destroyIdToken()
			;(this as any).setAuthenticated(false)
			;(this as any).setAuth({ isAuthorized: false })
		},
		openLink(url: string) {
			window.open(url)
		},
		clientHasLinkViewPermissions(requiresStaff: boolean, isStaff: boolean) {
			if (!requiresStaff) return true
			else if (isStaff) return true
			else return false
		},
	},
})
</script>
