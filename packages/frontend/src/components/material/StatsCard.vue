<template>
    <material-card
        class="v-card--material-stats"
        v-bind="$attrs"
        :isDivider="isDivider"
        v-on="$listeners"
    >
        <v-card
            slot="offset"
            :class="`elevation-${elevation} ` + (icon !== undefined ? 'pa-4' : '')"
            :color="color"
            dark
        >
            <v-icon v-if="icon" size="40">{{ icon }}</v-icon>
            <v-img
                v-else-if="img"
                width="72"
                height="72"
                :src="`https://crafatar.com/avatars/${img}?overlay=true&size=72`"
            >
                <template v-slot:placeholder>
                    <v-row class="fill-height ma-0" align="center" justify="center">
                        <v-progress-circular indeterminate color="grey darken-2"></v-progress-circular>
                    </v-row>
                </template>
            </v-img>
        </v-card>

        <div class="text-right">
            <p class="body-2 grey--text font-weight-light mb-0" v-text="title" />
            <h3 class="headline font-weight-light text--primary">
                <a
                    :href="`https://forum.dashboard.net/members/${linkValue}/`"
                    target="_blank"
                >{{ linkValueName }}</a>
                {{ value }}
                <small>{{ smallValue }}</small>
            </h3>
        </div>

        <v-divider />

        <template slot="actions">
            <v-icon :color="subIconColor" size="20" class="mx-2">{{ subIcon }}</v-icon>

            <span :class="subTextColor" class="caption font-weight-light" v-text="subText" />
        </template>
    </material-card>
</template>

<script>
import Card from './Card'

export default {
	name: 'MaterialStatsCard',

	inheritAttrs: false,

	props: {
		...Card.props,
		icon: {
			type: String,
			default: undefined,
		},
		img: {
			type: String,
			default: undefined,
		},
		subIcon: {
			type: String,
			default: undefined,
		},
		subIconColor: {
			type: String,
			default: undefined,
		},
		subTextColor: {
			type: String,
			default: undefined,
		},
		subText: {
			type: String,
			default: undefined,
		},
		title: {
			type: String,
			default: undefined,
		},
		value: {
			type: String,
			default: undefined,
		},
		smallValue: {
			type: String,
			default: undefined,
		},
		linkValue: {
			type: String,
			default: undefined,
		},
		linkValueName: {
			type: String,
			default: undefined,
		},
		isDivider: {
			type: Boolean,
			default: false,
		},
	},
}
</script>

<style lang="scss">
.v-card--material-stats {
	display: flex;
	flex-wrap: wrap;
	position: relative;

	.v-offset {
		display: inline-block;
		flex: 0 1;
		margin-top: 0;
		margin-left: 0;
		margin-right: auto;
		margin-bottom: 0 !important;
		max-width: auto;
		padding: 0 16px 0;
	}

	.v-card {
		border-radius: 4px;
		flex: 0 1 auto;
	}

	.v-card__text {
		display: inline-block;
		flex: 1 0 calc(100% - 120px);
		position: absolute;
		top: 0;
		right: 0;
		width: 100%;
	}

	.v-card__actions {
		flex: 1 0 100%;
	}
}
</style>
