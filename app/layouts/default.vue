<script setup lang="ts">
import AppHeader from "~/components/AppHeader.vue";
import type {NavigationMenuItem} from "@nuxt/ui";
import AppFooter from "~/components/AppFooter.vue";
const navLinks = ref<NavigationMenuItem[]>([
	{
		label: 'About Us',
		icon: 'i-lucide-info',
		to: '/'
	},
	{
		label: 'GitHub',
		icon: 'i-lucide-github',
		to: 'https://github.com/CTRL-Neo-Studios'
	},
	{
		label: 'Articles',
		icon: 'i-lucide-article',
		to: '/articles'
	},
	{
		label: 'Projects',
		icon: 'i-lucide-layouts',
		to: '/projects'
	},
	{
		label: 'Photography',
		icon: 'i-lucide-album',
		to: '/gallery'
	}
])
</script>

<template>
	<div>
		<div class="fixed top-0 right-0 left-0 border-b border-default h-16 z-20">
			<div class="border-x border-default px-20 h-full flex items-center justify-center z-20">
				<AppHeader :links="navLinks" class="flex-grow h-full z-20" />
			</div>
		</div>
		<UContainer class="w-full px-20 lg:px-20">
			<div class="w-full h-full min-h-screen border-default border-x">
				<slot />
			</div>
		</UContainer>
		<div class="bottom-0 right-0 left-0 border-t border-default h-16">
			<div class="border-x border-default mx-20 h-full flex items-center justify-center">
				<AppFooter :links="navLinks" />
			</div>
		</div>
	</div>
</template>
