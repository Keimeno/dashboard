<template>
    <v-container>
        <v-row>
            <v-col cols="12" lg="3" md="4" sm="6" xs="12">
                <material-stats-card
                    color="white"
                    :img="userinfo['uuid']"
                    title="Name"
                    :value="userinfo['name']"
                    sub-icon="mdi-account-details"
                    :sub-text="userinfo['group']"
                />
            </v-col>
        </v-row>
        <v-row>
            <v-col cols="12" lg="3" md="4" sm="6" xs="12">
                <material-stats-card
                    color="info"
                    icon="mdi-access-point-network"
                    title="Status"
                    :value="userinfo['status']"
                    sub-icon="mdi-crosshairs-gps"
                    :sub-text="userinfo['currentServer']"
                />
            </v-col>
            <v-col cols="12" lg="3" md="4" sm="6" xs="12">
                <material-stats-card
                    color="tertiary"
                    icon="mdi-forum-outline"
                    title="Forumlink"
                    :linkValue="userinfo['userId']"
                    :linkValueName="userinfo['name']"
                    sub-icon="mdi-cancel"
                    :sub-text="userinfo['isForumBanned'] ? $t('moderation.isBanned') : $t('moderation.isNotBanned')"
                />
            </v-col>
        </v-row>
    </v-container>
</template>

<script lang="ts">
import Vue from 'vue'
export default Vue.extend({
	data: () => ({
		userinfo: {
			name: '1',
			uuid: '1',
			group: '1',
			status: '1',
			currentServer: '1',
			userId: '1',
			isForumBanned: false,
		},
	}),
	mounted() {
		console.log(this.$route.params['name'])
	},
})
</script>
