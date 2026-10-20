<script setup lang="ts">
defineProps<{ headline?: string, title: string, description?: string, art: string }>()
</script>

<template>
	<section class="relative isolate overflow-hidden border-b border-default bg-black text-white">
		<img :src="art" alt="" class="absolute inset-0 -z-10 size-full object-cover opacity-60">
		<div class="absolute inset-0 -z-10 bg-linear-to-r from-black via-black/70 to-black/10"/>
		<UContainer class="py-20 sm:py-28">
			<p v-if="headline" class="font-mono text-sm text-primary mb-3">{{ headline }}</p>
			<h1 class="font-display text-4xl sm:text-6xl font-medium tracking-tighter">{{ title }}</h1>
			<p v-if="description" class="mt-4 max-w-xl text-lg text-white/70 text-balance">{{ description }}</p>
			<div v-if="$slots.default" class="mt-6">
				<slot/>
			</div>
		</UContainer>
	</section>
</template>
