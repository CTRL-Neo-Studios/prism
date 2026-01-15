<script setup lang="ts">
import {useArticles} from "~/composables/core/useArticles";

useHead({
	title: 'Articles'
})

const $route = useRoute()
const $art = useArticles()

const {data: articles} = await useAsyncData('all_articles', () => $art.getAllArticles())
</script>

<template>
	<UPage>
		<UPageSection
			title="Articles"
			description="The entire collection of our articles."
		/>
		<UPageSection
			:ui="{
				container: '!pt-0'
			}"
		>
			<UBlogPosts>
				<UBlogPost
					v-for="(article, index) in articles"
					:key="index"
					v-bind="article"
					:image="article?.image ?? 'https://picsum.photos/800/600'"
					:to="article.path"
					:class="`hover:shadow-lg hover:scale-[1.01] hover:-translate-y-0.5 shadow-neutral transition-all cursor-pointer duration-300 ${index % 2 === 0 ? 'hover:-rotate-1' : 'hover:rotate-1'}`"
				/>
			</UBlogPosts>
		</UPageSection>
	</UPage>
</template>

<style scoped>

</style>
