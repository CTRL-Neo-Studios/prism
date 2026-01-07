<script setup lang="ts">
const route = useRoute()

const { data: page } = await useAsyncData('page-' + route.path, () => {
	return queryCollection('projects').path(route.path).first()
})

if (!page.value) {
	throw createError({ statusCode: 404, statusMessage: 'Page not found', fatal: true })
}
</script>

<template>
	<UMain class="pt-20 px-2">
		<ContentRenderer
			v-if="page"
			:value="page"
		/>
	</UMain>
</template>
