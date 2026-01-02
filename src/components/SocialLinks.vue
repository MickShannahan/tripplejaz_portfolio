
<script setup>
import { computed } from 'vue';
import { AppState } from '../AppState.js';

const socialLinks = AppState.socialLinks

</script>

<template>
	<div class="links">
		<span class="mb-2" v-for="{text, link, icon} in socialLinks">
			<a :href="link" referrerpolicy="no-referrer" rel="noopener" :title="text">
				<i v-if="icon" class="me-1 mdi" :class="icon"></i>
				<span>{{ text }}</span>
			</a>
		</span>
	</div>
</template>


<style lang="scss" scoped>
	.links{
	display: flex;
	flex-wrap: wrap;
	&>*{
		width: 33%;
	}
	}
	a{
		text-decoration: none;
		color: unset;
	}
</style>