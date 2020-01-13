<template>
    <div id="build-info">
        <p>project: {{ name }} | version: {{ version }} | date: {{ date }}</p>
    </div>
</template>

<script lang="ts">
import Vue from 'vue'
// @ts-ignore there are no typings for json
import { version, name } from '../../../package.json'

export default Vue.extend({
	data: () => ({
		version,
		name,
	}),
	computed: {
		date: () =>
			new Date().getDate() +
			'.' +
			(new Date().getMonth() + 1) +
			'.' +
			new Date().getFullYear(),
	},
})
</script>

<style lang="scss" scoped>
#build-info {
	position: fixed;
	right: 0px;
	bottom: 0px;
	background: #00014e;
	z-index: 1000;
	color: yellow;
	padding: 0px 5px;
	font-size: 12px;
	font-family: sans-serif;

	* {
		margin: 0;
		padding: 0;
	}
}
</style>
