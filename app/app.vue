<script setup lang="ts">
const siteName = 'CTRL Neo Studios'
const description = 'A student-run open-source studio of Computer Science fanatics.'

useHead({
	titleTemplate: chunk => chunk && chunk !== siteName ? `${chunk} · ${siteName}` : siteName,
	link: [{rel: 'icon', type: 'image/png', href: '/v2-ctrl-neo-dark-bg.png'}]
})

useSeoMeta({
	description,
	ogSiteName: siteName,
	ogDescription: description,
	ogImage: '/wallpapers/[V2] CTRL Neo - Ascii Singularity - Light Text.png',
	twitterCard: 'summary_large_image'
})
</script>

<template>
	<UApp>
		<NuxtLoadingIndicator color="var(--ui-primary)"/>
		<NuxtLayout>
			<NuxtPage/>
		</NuxtLayout>
	</UApp>
</template>
