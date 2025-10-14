<script setup lang="ts">
import type { NavigationMenuItem } from '@nuxt/ui'
import ColorModeButton from "~/components/ColorModeButton.vue";

defineProps<{
	links: NavigationMenuItem[]
}>()
</script>

<template>
	<div class="sticky top-0 left-0 right-0 z-20">
		<UNavigationMenu
			:items="links"
			variant="link"
			color="neutral"
			class="backdrop-blur-sm px-2 sm:px-4 border-none flex items-center justify-center"
			:ui="{
				link: 'px-2 py-1',
				linkLeadingIcon: 'hidden',
				root: 'h-full'
		    }"
		>
			<template #list-trailing>
				<ColorModeButton />
			</template>
		</UNavigationMenu>
	</div>
</template>
