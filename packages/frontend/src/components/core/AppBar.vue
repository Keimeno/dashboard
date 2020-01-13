<template>
    <v-app-bar
        id="core-app-bar"
        fixed
        app
        flat
        hide-on-scroll
        :elevation="1"
        style="background: var(--v-background-base) !important;"
    >
        <v-toolbar-title class="d-flex align-center inverted--text font-weight-light">
            <v-btn v-if="responsive" icon @click.stop="onClick">
                <v-icon>mdi-view-list</v-icon>
            </v-btn>
            <v-btn v-else icon @click.stop="onResizeClick">
                <v-icon>mdi-view-list</v-icon>
            </v-btn>
            <span>{{ title }}</span>
        </v-toolbar-title>

        <v-spacer />

        <v-toolbar-items>
            <v-row align="center" class="mx-0">
                <v-btn icon to="/">
                    <v-icon color="inverted">mdi-view-dashboard</v-icon>
                </v-btn>

                <v-btn icon @click="toggleMode">
                    <v-icon color="inverted">mdi-theme-light-dark</v-icon>
                </v-btn>

                <v-menu bottom left offset-y transition="slide-y-transition">
                    <template v-slot:activator="{ attrs, on }">
                        <v-btn
                            class="toolbar-items"
                            icon
                            to="/notifications"
                            v-bind="attrs"
                            v-on="on"
                        >
                            <v-badge color="error" overlap>
                                <template slot="badge">{{ notifications.length }}</template>
                                <v-icon color="inverted">mdi-bell</v-icon>
                            </v-badge>
                        </v-btn>
                    </template>

                    <v-card>
                        <v-list dense>
                            <v-list-item
                                v-for="notification in notifications"
                                :key="notification"
                                @click="onClick"
                            >
                                <v-list-item-title v-text="notification" />
                            </v-list-item>
                        </v-list>
                    </v-card>
                </v-menu>

                <v-btn to="/user-profile" icon>
                    <v-icon color="inverted">mdi-account</v-icon>
                </v-btn>
            </v-row>
        </v-toolbar-items>
    </v-app-bar>
</template>

<script>
// Utilities
import Vue from 'vue'
import { mapMutations } from 'vuex'
import { getMode } from '@/common/mode.service'

export default {
	data: () => ({
		notifications: [
			'Mike, John responded to your email',
			'You have 5 new tasks',
			"You're now a friend with Andrew",
			'Another Notification',
			'Another One',
		],
		title: 'Home',
		responsive: false,
	}),

	watch: {
		$route(val) {
			this.title = val.name
		},
	},

	mounted() {
		this.onResponsiveInverted()
		window.addEventListener('resize', this.onResponsiveInverted)
	},
	beforeDestroy() {
		window.removeEventListener('resize', this.onResponsiveInverted)
	},

	methods: {
		...mapMutations('app', [
			'setDrawer',
			'setDrawerExpanded',
			'toggleDrawer',
		]),
		...mapMutations(['setMode']),
		toggleMode() {
			this.setMode(this.$store.state.mode === 'light' ? 'dark' : 'light')
			this.$vuetify.theme.dark = getMode() === 'dark' ? true : false
		},
		onClick() {
			this.setDrawer(!this.$store.state.app.drawer)
		},
		onResizeClick() {
			this.setDrawerExpanded(!this.$store.state.app.drawerExpanded)
		},
		onResponsiveInverted() {
			if (window.innerWidth < 991) {
				this.responsive = true
			} else {
				this.responsive = false
			}
		},
	},
}
</script>

<style>
#core-app-bar {
	width: auto;
	transition: none;
	background-color: #303030 !important;
}

#core-app-bar a {
	text-decoration: none;
}
</style>
