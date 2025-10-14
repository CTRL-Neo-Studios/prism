<script setup lang="ts">
import type {ButtonProps} from "@nuxt/ui";

const heroLinks = ref<ButtonProps[]>([
	{
		label: 'View Our GitHub',
		icon: 'i-lucide-github',
		to: 'https://github.com/CTRL-Neo-Studios',
		size: 'sm'
	},
	{
		label: 'See Our Projects',
		icon: 'i-lucide-layout',
		to: '/articles',
		variant: 'outline',
		size: 'sm'
	}
])
</script>

<template>
	<UPageHero
		title="CTRL Neo Studios"
		description="We are a small group of Computer Science Fanatics."
		:links="heroLinks"
		:ui="{
			  headline: 'flex items-center justify-center',
			  title: 'text-shadow-md mx-auto',
			  links: 'mt-4 flex justify-center items-center'
			}"
	>
		<template #top>
			<div class="relative h-full w-full bg-white"><div class="absolute bottom-0 left-0 right-0 top-0 bg-[linear-gradient(to_right,#4f4f4f2e_1px,transparent_1px),linear-gradient(to_bottom,#4f4f4f2e_1px,transparent_1px)] bg-[size:14px_24px] [mask-image:radial-gradient(ellipse_80%_50%_at_50%_0%,#000_70%,transparent_110%)]"></div></div>
		</template>
	</UPageHero>
</template>

<style scoped>

</style>
