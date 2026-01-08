<script setup lang="ts">
const route = useRoute()

const { data: page } = await useAsyncData('page-' + route.path, () => {
	return queryCollection('projects').path(route.path).first()
})

const { data: surround } = await useAsyncData('page-surround-' + route.path, () => {
	return queryCollectionItemSurroundings('projects', route.path, {
		fields: ['description']
	})
})

if (!page.value) {
	throw createError({ statusCode: 404, statusMessage: 'Page not found', fatal: true })
}

const title = page.value.seo?.title || page.value.title
const description = page.value.seo?.description || page.value.description

useSeoMeta({
	title,
	ogTitle: title,
	description,
	ogDescription: description
})
</script>

<template>
	<UMain class="pt-20 px-2">
		<UContainer>
			<UPage v-if="page">
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
	</UMain>
</template>
