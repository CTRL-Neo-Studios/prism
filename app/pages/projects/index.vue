<script setup lang="ts">
import {useArticles} from "~/composables/core/useArticles";
import {useProjects} from "~/composables/core/useProjects";

const $route = useRoute()
const $proj = useProjects()

const {data: projects} = await useAsyncData('all_projects', () => $proj.getAllProjects())
</script>

<template>
	<UPage>
		<UPageSection
			title="Projects"
			description="The entire collection of our projects."
		/>
		<UPageSection
			:ui="{
				container: '!pt-0'
			}"
		>
			<UBlogPosts>
				<UBlogPost
					v-for="(project, index) in projects"
					:key="index"
					v-bind="project"
					:image="project?.image ?? 'https://picsum.photos/800/600'"
					:to="project.path"
					:class="`hover:shadow-lg hover:scale-[1.01] hover:-translate-y-0.5 shadow-neutral transition-all cursor-pointer duration-300 ${index % 2 === 0 ? 'hover:-rotate-1' : 'hover:rotate-1'}`"
				/>
			</UBlogPosts>
		</UPageSection>
	</UPage>
</template>

<style scoped>

</style>
