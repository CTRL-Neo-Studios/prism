<script setup lang="ts">
import type {TabsItem} from '@nuxt/ui'

useSeoMeta({title: 'Projects', description: 'Every library, app and tool from CTRL Neo Studios.'})

const {data: projects} = await useAsyncData('all-projects', () =>
	queryCollection('projects').select(...PROJECT_CARD_FIELDS).order('date', 'DESC').all()
)

const filter = ref('all')
const tabs = computed<TabsItem[]>(() => [
	{label: `All (${projects.value?.length ?? 0})`, value: 'all'},
	...Object.entries(projectStatus)
		.map(([value, s]) => ({label: s.label, value, count: projects.value?.filter(p => p.progress === value).length ?? 0}))
		.filter(t => t.count)
		.map(t => ({label: `${t.label} (${t.count})`, value: t.value}))
])
const filtered = computed(() =>
	filter.value === 'all' ? projects.value ?? [] : projects.value?.filter(p => p.progress === filter.value) ?? []
)
</script>

<template>
	<div>
		<PageBanner
			headline="// projects"
			title="Things we've built"
			description="Open-source libraries, editors and apps, from early concepts to shipped releases."
			:art="artworks[1]!.src"
		/>
		<UContainer class="py-12">
			<UTabs v-model="filter" :items="tabs" :content="false" variant="link" color="neutral" class="mb-8"/>
			<ProjectGrid :projects="filtered"/>
		</UContainer>
	</div>
</template>
