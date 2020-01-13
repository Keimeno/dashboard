<template>
    <v-container>{{ test1 }}</v-container>
</template>

<script lang="ts">
import Vue from 'vue'
export default Vue.extend({
	data: () => ({
		test1: 'hey',
	}),
})
</script>
