<script setup lang="ts">
import type {NavigationMenuItem} from '@nuxt/ui'

const route = useRoute()

const links = computed<NavigationMenuItem[]>(() => [
	{label: 'Projects', icon: 'i-lucide-boxes', to: '/projects', active: route.path.startsWith('/projects')},
	{label: 'Articles', icon: 'i-lucide-newspaper', to: '/articles', active: route.path.startsWith('/articles') && route.path !== '/articles/about-us'},
	{label: 'Gallery', icon: 'i-lucide-camera', to: '/gallery', active: route.path.startsWith('/gallery')},
	{label: 'About', icon: 'i-lucide-info', to: '/articles/about-us'}
])
</script>

<template>
	<div>
		<UHeader :ui="{ root: 'bg-default/70 backdrop-blur-md' }">
			<template #title>
				<AppLogo/>
			</template>

			<UNavigationMenu :items="links" variant="link" color="neutral" :ui="{ linkLeadingIcon: 'hidden' }"/>

			<template #right>
				<ColorModeButton/>
				<UButton
					icon="i-simple-icons-github"
					:to="GITHUB_ORG"
					target="_blank"
					color="neutral"
					variant="ghost"
					aria-label="GitHub"
				/>
			</template>

			<template #body>
				<UNavigationMenu :items="links" orientation="vertical" class="-mx-2.5"/>
			</template>
		</UHeader>

		<UMain>
			<slot/>
		</UMain>

		<USeparator/>

		<UFooter>
			<template #left>
				<p class="text-muted text-sm">
					© {{ new Date().getFullYear() }} CTRL Neo Studios. Built with Nuxt & Nuxt UI.
				</p>
			</template>

			<UNavigationMenu :items="links" variant="link" color="neutral" :ui="{ linkLeadingIcon: 'hidden' }"/>

			<template #right>
				<UButton
					icon="i-simple-icons-github"
					:to="GITHUB_ORG"
					target="_blank"
					color="neutral"
					variant="ghost"
					aria-label="GitHub"
				/>
			</template>
		</UFooter>
	</div>
</template>
