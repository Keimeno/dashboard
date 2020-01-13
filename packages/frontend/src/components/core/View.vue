<template>
    <v-content>
        <div id="core-view">
            <v-scroll-y-transition mode="out-in">
                <router-view transition="slide-x-transition" />
            </v-scroll-y-transition>
        </div>
    </v-content>
</template>

<script lang="ts">
export default {
	name: 'CoreView',

	metaInfo() {
		return {
			title: 'dashboard | Dashboard',
		}
	},
}
</script>
