<script setup lang="ts">
const route = useRoute()

const {data: page, pending} = await useAsyncData(`project-${route.path}`, () =>
	queryCollection('projects').path(route.path).first()
)
if (!page.value && !pending.value) throw createError({statusCode: 404, statusMessage: 'Project not found', fatal: true})

const {data: surround} = await useAsyncData(`project-surround-${route.path}`, () =>
	queryCollectionItemSurroundings('projects', route.path, {fields: ['description']})
)

const title = computed(() => page.value?.seo?.title || page.value?.title)
const description = computed(() => page.value?.seo?.description || page.value?.description)
useSeoMeta({title, ogTitle: title, description, ogDescription: description, ogImage: page.value?.image})

const repo = page.value?.repository
const repoUrl = `https://github.com/${repo?.repoUsername}/${repo?.repoName}`
const status = projectStatus[page.value?.progress ?? "concept"]
const links = [
	{label: 'Repository', to: repoUrl, target: '_blank', icon: 'i-simple-icons-github'},
	...(repo?.showIssues ? [{label: 'Issues', to: `${repoUrl}/issues`, target: '_blank', icon: 'i-lucide-bug'}] : []),
	...(repo?.showWiki ? [{label: 'Wiki', to: repo?.customWikiLink ?? `${repoUrl}/wiki`, target: '_blank', icon: 'i-lucide-book-open'}] : [])
]
</script>

<template>
	<div v-if="page">
		<PageBanner
			:headline="`// ${repo?.repoUsername}/${repo?.repoName}`"
			:title="page.title"
			:description="page.description"
			:art="fallbackArt(page.path)"
		>
			<div class="flex flex-wrap items-center gap-3">
				<UBadge :label="status?.label" :color="status?.color" variant="solid"/>
				<span class="font-mono text-sm text-white/60">{{ formatDate(page.date) }}</span>
				<UButton label="View on GitHub" :to="repoUrl" target="_blank" icon="i-simple-icons-github" size="sm" class="ms-2"/>
			</div>
		</PageBanner>

		<UContainer>
			<UPage>
				<UPageBody>
					<ContentRenderer :value="page"/>
					<USeparator v-if="surround?.filter(Boolean).length"/>
					<UContentSurround :surround="surround ?? []"/>
				</UPageBody>

				<template #right>
					<UContentToc :links="page.body?.toc?.links" highlight>
						<template #bottom>
							<USeparator v-if="page.body?.toc?.links?.length" type="dashed" class="my-6"/>
							<UPageLinks title="Links" :links="links"/>
							<div v-if="page.tags?.length" class="mt-6 flex flex-wrap gap-1.5">
								<UBadge v-for="tag in page.tags" :key="tag" :label="tag" variant="outline" color="neutral" size="sm"/>
							</div>
						</template>
					</UContentToc>
				</template>
			</UPage>
		</UContainer>
	</div>
</template>
