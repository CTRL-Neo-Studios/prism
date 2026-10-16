<script setup lang="ts">
useSeoMeta({title: 'Articles', description: 'Notes, write-ups and news from CTRL Neo Studios.'})

const {data: articles} = await useAsyncData('all-articles', () =>
	queryCollection('articles').select('path', 'title', 'description', 'date', 'image', 'author', 'tags').order('date', 'DESC').all()
)
</script>

<template>
	<div>
		<PageBanner
			headline="// articles"
			title="From the studio"
			description="Write-ups, devlogs and the story behind CTRL Neo."
			:art="artworks[2]!.src"
		/>
		<UContainer class="py-12">
			<UBlogPosts v-if="articles?.length">
				<UBlogPost
					v-for="(article, index) in articles"
					:key="article.path"
					:title="article.title"
					:description="article.description"
					:date="formatDate(article.date)"
					:badge="article.tags?.[0]"
					:image="article.image ?? fallbackArt(article.path)"
					:authors="[{ name: article.author, avatar: { src: `https://github.com/${article.author}.png` } }]"
					:to="article.path"
					:orientation="index === 0 ? 'horizontal' : 'vertical'"
					:class="index === 0 ? 'col-span-full' : ''"
					variant="outline"
				/>
			</UBlogPosts>
			<UEmpty v-else icon="i-lucide-newspaper" title="No articles yet" description="Check back soon."/>
		</UContainer>
	</div>
</template>
