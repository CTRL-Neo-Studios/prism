<script setup lang="ts">
const route = useRoute()

const {data: page} = await useAsyncData(`article-${route.path}`, () =>
	queryCollection('articles').path(route.path).first()
)
if (!page.value) throw createError({statusCode: 404, statusMessage: 'Article not found', fatal: true})

const {data: surround} = await useAsyncData(`article-surround-${route.path}`, () =>
	queryCollectionItemSurroundings('articles', route.path, {fields: ['description']})
)

const title = page.value.seo?.title || page.value.title
const description = page.value.seo?.description || page.value.description
useSeoMeta({title, ogTitle: title, description, ogDescription: description, ogImage: page.value.image})
</script>

<template>
	<div v-if="page">
		<PageBanner
			:headline="`// ${formatDate(page.date)}`"
			:title="page.title"
			:description="page.description"
			:art="fallbackArt(page.path)"
		>
			<UUser
				:name="page.author"
				:description="`@${page.author}`"
				:avatar="{ src: `https://github.com/${page.author}.png`, alt: page.author }"
				:to="`https://github.com/${page.author}`"
				target="_blank"
				:ui="{ name: 'text-white', description: 'text-white/60' }"
			/>
		</PageBanner>

		<UContainer>
			<UPage>
				<UPageBody>
					<ContentRenderer :value="page"/>
					<USeparator v-if="surround?.filter(Boolean).length"/>
					<UContentSurround :surround="surround ?? []"/>
				</UPageBody>
				<template v-if="page.body?.toc?.links?.length" #right>
					<UContentToc :links="page.body.toc.links" highlight/>
				</template>
			</UPage>
		</UContainer>
	</div>
</template>
