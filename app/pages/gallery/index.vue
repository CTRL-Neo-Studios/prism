<script setup lang="ts">
import {Motion} from 'motion-v'

useSeoMeta({title: 'Gallery', description: 'Photography and brand artwork from CTRL Neo Studios.'})

const {data: photos} = await useAsyncData('gallery', () =>
	queryCollection('gallery').select('path', 'title', 'image').order('date', 'DESC').all()
)
</script>

<template>
	<div>
		<PageBanner
			headline="// gallery"
			title="Art & photography"
			description="The V2 brand artwork, plus photos we've taken along the way."
			:art="artworks[3]!.src"
		/>
		<UContainer class="py-12 space-y-16">
			<section>
				<h2 class="font-display text-2xl font-medium mb-6">CTRL Neo V2 artwork</h2>
				<MasonryGrid :gap-size="4">
					<a
						v-for="art in artworks"
						:key="art.src"
						:href="art.src"
						target="_blank"
						class="group relative block overflow-hidden border border-default"
					>
						<img :src="art.src" :alt="art.title" loading="lazy" class="w-full transition-transform duration-500 group-hover:scale-105">
						<span class="absolute inset-x-0 bottom-0 flex items-center justify-between bg-black/60 px-3 py-2 font-mono text-xs text-white opacity-0 transition-opacity group-hover:opacity-100">
							{{ art.title }}
							<UIcon name="i-lucide-download" class="size-4"/>
						</span>
					</a>
				</MasonryGrid>
			</section>

			<section>
				<h2 class="font-display text-2xl font-medium mb-6">Photography</h2>
				<MasonryGrid v-if="photos?.length" :gap-size="4">
					<Motion
						v-for="photo in photos"
						:key="photo.path"
						:initial="{ opacity: 0, y: 10 }"
						:while-in-view="{ opacity: 1, y: 0 }"
						:in-view-options="{ once: true }"
					>
						<NuxtLink :to="photo.path" class="group block overflow-hidden border border-default">
							<NuxtImg :src="photo.image" :alt="photo.title" format="webp" quality="80" class="w-full transition-transform duration-500 group-hover:scale-105"/>
						</NuxtLink>
					</Motion>
				</MasonryGrid>
				<UEmpty v-else icon="i-lucide-camera" title="No photos yet" description="The camera's charging."/>
			</section>
		</UContainer>
	</div>
</template>
