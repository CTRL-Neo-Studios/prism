<script setup lang="ts">
import {useArticles} from "~/composables/core/useArticles";

const $route = useRoute()
const $art = useArticles()

const {data: page} = await useAsyncData('page-' + $route.path, () => $art.getArticle($route.path))
const {data: surround} = await useAsyncData(() => $art.getArticleSurround($route.path))

const title = unref(page)?.seo?.title || unref(page)?.title
const description = unref(page)?.seo?.description || unref(page)?.description

useSeoMeta({
	title,
	description,
	ogDescription: description,
	ogTitle: title
})

const articleLink = computed(() => `${window?.location}`)

const formatDate = (dateString: string) => {
	return new Date(dateString).toLocaleDateString('en-US', {
		year: 'numeric',
		month: 'short',
		day: 'numeric'
	})
}
</script>

<template>
	<UMain class="pt-20 px-2">
		<UContainer>
			<UPage v-if="page">
				<ULink
					to="/articles"
					class="text-sm flex items-center gap-1"
				>
					<UIcon name="i-lucide-chevron-left" />
					Articles
				</ULink>
				<div class="flex flex-col gap-3 mt-8">
					<div class="flex text-xs text-muted items-center justify-center gap-2">
						<span v-if="page.date">{{ formatDate(page.date) }}</span>
					</div>
					<NuxtImg
						:src="page.image ?? 'https://picsum.photos/1600/900'"
						:alt="page.title"
						class="rounded-lg w-full h-[300px] object-cover object-center"
					/>
					<h1 class="text-4xl text-center font-medium max-w-3xl mx-auto mt-4">
						{{ page.title }}
					</h1>
					<p class="text-muted text-center max-w-2xl mx-auto">
						{{ page.description }}
					</p>
					<div class="flex items-center justify-center gap-2 mt-2">
						<UUser
							orientation="vertical"
							color="neutral"
							variant="outline"
							class="justify-center items-center text-center"
							v-bind="page.author"
						/>
					</div>
				</div>
				<UPageBody class="max-w-3xl mx-auto">
					<ContentRenderer
						v-if="page.body"
						:value="page"
					/>
					<UContentSurround :surround />
				</UPageBody>
			</UPage>
		</UContainer>
	</UMain>
</template>

<style scoped>

</style>
