<script setup lang="ts">
import type {NuxtError} from '#app'

defineProps<{ error: NuxtError }>()
</script>

<template>
	<UApp>
		<NuxtLayout>
			<UError :error="error" :clear="{ label: 'Back home' }"/>
		</NuxtLayout>
	</UApp>
</template>
