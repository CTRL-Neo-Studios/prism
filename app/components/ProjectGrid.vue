<script setup lang="ts">
import type {ProjectsCollectionItem} from '@nuxt/content'

defineProps<{ projects: Pick<ProjectsCollectionItem, typeof PROJECT_CARD_FIELDS[number]>[] }>()
</script>

<template>
	<UPageGrid>
		<UPageCard
			v-for="project in projects"
			:key="project.path"
			:to="project.path"
			variant="outline"
			spotlight
			class="group"
			:ui="{ container: 'p-0 sm:p-0 gap-y-0', wrapper: 'p-4 sm:p-5', header: 'mb-0 w-full' }"
		>
			<template #header>
				<div class="aspect-[16/9] w-full overflow-hidden border-b border-default bg-black">
					<img
						:src="project.image ?? fallbackArt(project.path)"
						:alt="project.title"
						loading="lazy"
						class="size-full object-cover transition-transform duration-500 group-hover:scale-105"
					>
				</div>
			</template>
			<template #body>
				<div class="flex items-center gap-2 mb-3 pt-4">
					<UBadge
						:label="projectStatus[project.progress]?.label"
						:color="projectStatus[project.progress]?.color"
						variant="subtle"
						size="sm"
					/>
					<span class="text-xs text-muted font-mono">{{ formatDate(project.date) }}</span>
				</div>
				<p class="text-base font-semibold text-highlighted">{{ project.title }}</p>
				<p class="mt-1 text-sm text-muted line-clamp-3">{{ project.description }}</p>
			</template>
			<template #footer>
				<span class="inline-flex items-center gap-1.5 text-xs font-mono text-dimmed">
					<UIcon name="i-simple-icons-github" class="size-3.5"/>
					{{ project.repository.repoUsername }}/{{ project.repository.repoName }}
				</span>
			</template>
		</UPageCard>
	</UPageGrid>
</template>
