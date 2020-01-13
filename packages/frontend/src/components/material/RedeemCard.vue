<template>
    <material-card
        class="v-card--material-stats"
        :isDivider="isDivider"
        v-bind="$attrs"
        v-on="$listeners"
    >
        <v-card slot="offset" :class="`elevation-${elevation}`" :color="color" class="pa-4" dark>
            <v-icon size="40">{{ icon }}</v-icon>
        </v-card>

        <div class="text-right">
            <h3 class="headline display-2 grey--text font-weight-light">{{ title }}</h3>
        </div>

        <div slot="redeem" class="text-left redeem-table">
            <v-skeleton-loader :loading="isLoading" height="114" type="sentences@2, text">
                <div>
                    <div
                        class="table--container font-weight-light"
                        v-for="item in data.table"
                        :key="item.name"
                    >
                        <span class="table__name subtitle-1">{{ item.name }}</span>
                        <span class="table__redeem subtitle-2">{{ item.redeem }}</span>
                        <v-btn
                            class="table__btn"
                            small
                            :disabled="item.isDisabled"
                            :color="item.isRedeemed ? 'error' :
									(item.isDisabled ? 'grey lighten-1' :
									'success')"
                            @click="updateData(item)"
                            :loading="item.isLoading"
                        >
                            {{ item.isRedeemed ? $t('home.redeemed') :
                            (item.isDisabled ? $t('home.locked') :
                            $t('home.redeem')) }}
                        </v-btn>
                    </div>
                </div>
            </v-skeleton-loader>
        </div>

        <template slot="actions" class="mt-12">
            <v-icon :color="subIconColor" size="20" class="mx-2">{{ subIcon }}</v-icon>

            <span
                :class="subTextColor"
                class="caption font-weight-light"
                v-text="subText + (data.streak === undefined ? '...' : data.streak)"
            />
        </template>
    </material-card>
</template>

<style lang="scss" scoped>
.redeem-table {
	margin-bottom: 5px;
	.table--container {
		display: grid;
		grid-template-columns: 30% 40% 30%;
		padding: 5px 2px;
		align-items: center;
		border-radius: 5px;

		&:hover {
			background-color: var(--v-background-base);
			box-shadow: 0px 0px 0px 1px var(--v-background-darken1);
		}

		.table__name {
			margin-left: 5px;
		}

		.table__btn {
			margin-right: 3px;
		}
	}
}
</style>

<script lang="ts">
import Card from './Card.vue'

import Vue from 'vue'
import { saveIdTokenUpdateAuth } from '../../common/jwt.service'
import { AxiosResponse } from 'axios'
export default Vue.extend({
	inheritAttrs: false,

	methods: {
		// Redeems the coins from the daily reward.
		async updateData(item: object): Promise<void> {
			if (item['isRedeemed'] || item['isDisabled']) return

			// @ts-ignore data is initialized as prop
			this.data.table = this.data.table.map(cur => {
				if (cur.name === item['name']) {
					cur.isLoading = true
					return cur
				}
				return cur
			})

			await (this as any).$http
				// @ts-ignore data is initialized as prop
				.get(this.data['apiUri'] + '?method=set&update=' + item['name'])
				.then((response: AxiosResponse): void => {
					saveIdTokenUpdateAuth(response.data['auth']['id_token'])
				})
				.catch(err => {})
				.finally(() => {
					// @ts-ignore data is initialized as prop
					this.data.table = this.data.table.map(cur => {
						if (cur.name === item['name']) {
							cur.isRedeemed = true
							cur.isLoading = false
							return cur
						}
						return cur
					})
				})
		},
	},

	props: {
		// @ts-ignore not initialized yet
		...Card.props,
		icon: {
			type: String,
			required: true,
		},
		data: {
			type: Object,
			required: true,
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
		isDivider: {
			type: Boolean,
			default: false,
		},
		isLoading: {
			type: Boolean,
			default: true,
		},
	},
})
</script>
