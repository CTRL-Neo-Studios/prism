<script setup lang="ts">
import type {NavigationMenuItem} from "@nuxt/ui";

const props = defineProps<{links?: NavigationMenuItem[]}>()
</script>

<template>
	<UFooter
		class="z-10 bg-default"
		:ui="{ left: 'text-muted text-xs' }"
	>
		<template #left>
			<div>Made by CTRL Neo Studios using Nuxt v4 & Nuxt UI v4, All Rights Reserved©</div>
		</template>

		<template #right>
			<template v-if="props?.links">
				<UButton
					v-for="(link, index) of props?.links"
					:key="index"
					size="xs"
					color="neutral"
					variant="ghost"
					:label="link.label"
				/>
			</template>
		</template>
	</UFooter>
</template>
