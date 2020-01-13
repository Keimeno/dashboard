<template>
    <div id="app">
        <div id="test">
            <v-container class="fill-height" style="height: 100vh;" fluid>
                <v-row align="center" justify="center">
                    <v-col cols="12" sm="8" md="4">
                        <v-snackbar
                            v-model="isAlert"
                            class="mb-3"
                            color="error"
                            :timeout="5000"
                            dismissible
                            top
                        >
                            <v-icon color="white" class="mr-3">mdi-alert-circle</v-icon>
                            <div v-if="isAlert">
                                <strong style="text-transform: uppercase;">{{ $t('auth.error') }}</strong>
                                - {{ $t('auth.' + errorMessage) }}
                            </div>
                            <v-btn icon @click="isAlert = false">
                                <v-icon>mdi-close-circle</v-icon>
                            </v-btn>
                        </v-snackbar>
                        <material-card
                            color="primary"
                            :title="$t('auth.login')"
                            :text="$t('auth.mustLoginWithForumAccount')"
                        >
                            <v-text-field
                                v-model="email"
                                @keydown.enter="loginUser"
                                clearable
                                color="inverted"
                                class="pl-2 pr-2 pt-8"
                                :label="$t('auth.username') + ' / ' + $t('auth.email')"
                            ></v-text-field>
                            <v-text-field
                                v-model="password"
                                @keydown.enter="loginUser"
                                clearable
                                type="password"
                                color="inverted"
                                class="pl-2 pr-2"
                                :label="$t('auth.password')"
                            ></v-text-field>
                            <div class="clearfix mt-6" style="position: relative;">
                                <div v-if="width > 959" style="float: left;">
                                    <v-btn
                                        color="blue-grey darken-4"
                                        class="ma-2 white--text"
                                        @click="toggleMode"
                                    >{{ $t('auth.' + ($store.state.mode === 'light' ? 'dark' : 'light') + 'Mode') }}</v-btn>
                                </div>
                                <div style="float: right;">
                                    <v-btn
                                        :disabled="isShowingInfo"
                                        color="tertiary"
                                        class="ma-2 white--text"
                                        @click="showInfo"
                                    >
                                        {{ $t('auth.info') }}
                                        <v-icon right dark>mdi-information-outline</v-icon>
                                    </v-btn>
                                    <v-btn
                                        :loading="isLoading"
                                        :disabled="isLoading"
                                        color="secondary"
                                        class="ma-2 white--text"
                                        @click="loginUser"
                                    >
                                        {{ $t('auth.login') }}
                                        <v-icon right dark>mdi-login-variant</v-icon>
                                    </v-btn>
                                </div>
                            </div>
                            <v-divider class="mt-4 mb-4" />
                            <div class="d-flex flex-row-reverse">
                                <p class="bottom-info">
                                    <a href="//impressum.mykns.net" target="_blank">Impressum</a>
                                </p>
                                <p class="bottom-info">
                                    <a href="//nerux.link/tos" target="_blank">Nutzungsbedingungen</a>&nbsp;|&nbsp;
                                </p>
                            </div>
                        </material-card>
                    </v-col>
                </v-row>
            </v-container>
            <v-bottom-sheet v-model="isShowingInfo" inset>
                <v-sheet class="text-center pb-12">
                    <v-btn
                        class="my-6"
                        depressed
                        color="error"
                        @click="isShowingInfo = false"
                    >{{ $t('auth.close') }}</v-btn>
                    <div class="text-content" style="max-width: 90%; margin: 0 auto;">
                        <div class="title mb-2 mt-4">{{ $t('auth.information.title') }}</div>
                        <div>{{ $t('auth.information.line0') }}</div>
                        <div>{{ $t('auth.information.line1') }}</div>
                    </div>
                </v-sheet>
            </v-bottom-sheet>
        </div>
    </div>
</template>

<style scoped>
.clearfix::after {
	content: '';
	clear: both;
	display: table;
}
</style>

<script lang="ts">
import Vue from 'vue'
import { mapMutations } from 'vuex'
import { saveAccessToken, saveIdToken } from '@/common/jwt.service'
import { getMode } from '@/common/mode.service'
import { AxiosError, AxiosResponse } from 'axios'

export default Vue.extend({
	data: () => ({
		isLoading: false,
		email: '',
		password: '',
		isAlert: false,
		errorMessage: '',
		isShowingInfo: false,
		width: screen['width'],
	}),
	created() {
		if (this.$store.state.isAuthenticated) {
			this.$router.push('/')
		}
	},
	mounted() {
		window.addEventListener('resize', () => {
			this.width = screen['width']
		})
	},
	methods: {
		...mapMutations([
			'checkAuthenticated',
			'setAuthenticated',
			'updateAxiosInstance',
			'setAuth',
		]),
		...mapMutations(['setMode']),
		screen(type: string) {
			return window.screen[type]
		},
		toggleMode() {
			;(this as any).setMode(
				this.$store.state.mode === 'light' ? 'dark' : 'light',
			)
			this.$vuetify.theme.dark = getMode() == 'dark' ? true : false
		},
		showInfo(): void {
			this.isShowingInfo = true
		},
		loginUser(): void {
			this.isAlert = false

			// Sets the loading icon
			this.isLoading = true

			setTimeout(async (): Promise<void> => {
				// check if input fields are filled
				if (this.email.length === 0) {
					this.isAlert = true
					this.errorMessage = 'noUserOrEmailGiven'
					this.isLoading = false
					return
				} else if (this.password.length === 0) {
					this.isAlert = true
					this.errorMessage = 'noPasswordGiven'
					this.isLoading = false
					return
				}
				await (this as any).$http
					.get(`/auth/login?user=${this.email}&pass=${this.password}`)
					.then((response: AxiosResponse) => {
						saveAccessToken(response.data['access_token'])
						saveIdToken(response.data['id_token'])
						;(this as any).setAuthenticated(true)
						;(this as any).updateAxiosInstance()
						;(this as any).setAuth(response.data['body'])
						this.$router.push('/')
					})
					.catch((err: AxiosError | any) => {
						this.isAlert = true
						this.errorMessage = err.response.data['message']
					})
					.finally(() => {
						this.isLoading = false
					})
			}, 5)
		},
	},
})
</script>
