<template>
    <v-container>
        <material-card
            color="primary"
            :title="$t('moderation.searchPlayer')"
            :text="$t('moderation.searchPlayerByName')"
        >
            <v-text-field
                v-model="message"
                append-outer-icon="mdi-send"
                filled
                autofocus
                counter="36"
                clear-icon="mdi-close"
                clearable
                label="Name / UUID"
                type="text"
                color="inverted"
                @click:append-outer="searchPlayer"
                @keydown.enter="searchPlayer"
            ></v-text-field>
        </material-card>
    </v-container>
</template>

<script lang="ts">
import Vue from 'vue'
export default Vue.extend({
	data: () => ({
		message: '',
	}),
	methods: {
		searchPlayer() {
			this.$router.push({
				name: 'UserinfoByName',
				params: { name: this.message },
			})
		},
	},
})
</script>
