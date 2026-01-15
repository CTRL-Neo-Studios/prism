<script setup lang="ts">
const route = useRoute()

const { data: page, pending } = await useAsyncData('page-' + route.path, () => {
	return queryCollection('projects').path(route.path).first()
})

const { data: surround } = await useAsyncData('page-surround-' + route.path, () => {
	return queryCollectionItemSurroundings('projects', route.path, {
		fields: ['description']
	})
})

onMounted(async () => {
	await until(pending).toBe(false)
})

const title = unref(page)?.seo?.title || unref(page)?.title
const description = unref(page)?.seo?.description || unref(page)?.description

useSeoMeta({
	title,
	ogTitle: title,
	description,
	ogDescription: description
})
</script>

<template>
	<UMain class="pt-20 px-2">
		<Suspense>
			<UContainer v-if="!pending && page">
				<UPage>
					<UPageHeader
						:title="page.title"
						:description="page.description"
						:links="[
							{
								label: 'View on GitHub',
								to: `https://github.com/${page?.repository.repoUsername}/${page?.repository.repoName}`,
								external: true,
								icon: 'i-lucide-github'
							},
						]"
					/>
					<template #right>
						<UContentToc
							:title="page?.body?.toc?.title"
							:links="page?.body?.toc?.links"
							class="z-0"
						>
							<template #bottom>
								<div
									class="hidden lg:block space-y-6"
									:class="{ '!mt-6': page.body?.toc?.links?.length }"
								>
									<USeparator
										v-if="page.body?.toc?.links?.length"
										type="dashed"
									/>

									<UPageLinks
										title="Other Links"
										:links="[
										...(page.repository.showIssues ? [{
											label: 'Issues',
											to: `https://github.com/${page?.repository.repoUsername}/${page?.repository.repoName}/issues`,
											external: true,
											icon: 'i-lucide-bug'
										}] : []),
										...(page.repository.showWiki ? [{
											label: 'Wiki',
											to: `https://github.com/${page?.repository.repoUsername}/${page?.repository.repoName}/wiki`,
											external: true,
											icon: 'i-lucide-book'
										}] : [])
									]"
									/>
								</div>
							</template>
						</UContentToc>
					</template>
					<UPageBody>
						<ContentRenderer
							v-if="page"
							:value="page"
						/>

						<USeparator v-if="surround?.length"/>

						<UContentSurround :surround="surround"/>
					</UPageBody>
				</UPage>
			</UContainer>
			<UContainer v-else class="w-full h-full flex items-center justify-center">
				<UProgress class="min-x-3xl"/>
			</UContainer>
			<template #fallback>
				<UContainer class="w-full h-full flex items-center justify-center">
					<UProgress class="min-x-3xl"/>
				</UContainer>
			</template>
		</Suspense>
	</UMain>
</template>
