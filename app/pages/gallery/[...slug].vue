<script setup lang="ts">
import {useGallery} from "~/composables/core/useGallery";

const $route = useRoute()
const $ga = useGallery()

const { data: picture } = useAsyncData('page-' + $route.path, () => $ga.getGalleryImage($route.path))
</script>

<template>
	<UMain>
		<UContainer v-if="picture">
			<div class="w-full">
				<NuxtImg :src="picture.image" class="object-contain w-full h-full select-none"/>
			</div>
		</UContainer>
	</UMain>
</template>

<style scoped>

</style>
