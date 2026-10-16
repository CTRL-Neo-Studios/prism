<script setup lang="ts">
const route = useRoute()

const {data: photo} = await useAsyncData(`photo-${route.path}`, () =>
	queryCollection('gallery').path(route.path).first()
)
if (!photo.value) throw createError({statusCode: 404, statusMessage: 'Photo not found', fatal: true})

useSeoMeta({title: photo.value.title, description: photo.value.description, ogImage: photo.value.image})

const p = photo.value.parameters
const specs = [
	{icon: 'i-lucide-camera', label: p.camera},
	{icon: 'i-lucide-focus', label: p.lens},
	{icon: 'i-lucide-aperture', label: `f/${p.aperture}`},
	{icon: 'i-lucide-timer', label: p.shutterSpeed},
	{icon: 'i-lucide-map-pin', label: photo.value.location},
	{icon: 'i-lucide-calendar', label: formatDate(photo.value.date)}
]
</script>

<template>
	<UContainer v-if="photo" class="py-10">
		<UButton label="Gallery" to="/gallery" icon="i-lucide-chevron-left" color="neutral" variant="link" class="mb-6 px-0"/>
		<div class="grid gap-8 lg:grid-cols-[1fr_20rem]">
			<NuxtImg :src="photo.image" :alt="photo.title" class="w-full border border-default object-contain select-none"/>
			<aside class="space-y-6">
				<div>
					<UBadge :label="photo.category" variant="subtle" class="mb-3"/>
					<h1 class="font-display text-3xl font-medium tracking-tight">{{ photo.title }}</h1>
					<p class="mt-2 text-muted">{{ photo.description }}</p>
				</div>
				<USeparator type="dashed"/>
				<ul class="space-y-3 font-mono text-sm">
					<li v-for="s in specs" :key="s.icon" class="flex items-center gap-3">
						<UIcon :name="s.icon" class="size-4 text-primary"/>
						{{ s.label }}
					</li>
				</ul>
				<ContentRenderer v-if="photo.body" :value="photo"/>
			</aside>
		</div>
	</UContainer>
</template>
