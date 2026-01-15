<script setup lang="ts">
const title = ref('CTRL Neo Studios')

useSeoMeta({
	title: unref(title),
	description: 'A studio of Computer Science fanatics.',
	ogTitle: unref(title),
	ogDescription: 'A studio of Computer Science fanatics.',
})

useHead({
	titleTemplate: (titleChunk) => {
		return titleChunk != unref(title) ? `${titleChunk} - ${unref(title)}` : unref(title)
	}
})
</script>

<template>
	<UApp>
		<NuxtLoadingIndicator/>
		<NuxtLayout>
			<NuxtPage/>
		</NuxtLayout>
	</UApp>
</template>
