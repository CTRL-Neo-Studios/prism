<script setup lang="ts">
const features = ref([
	{
		title: 'About Us',
		description: 'We are a group of students who likes to explore the multitude of areas in Computer Science. Our main domain is in Full-stack development and Game Development & Design, but we\'re also involved in IoT, Software Development, DevOps, and UI/UX Design.',
		icon: 'i-lucide-smile',
		to: '/docs/getting-started/integrations/icons'
	},
	{
		title: 'Mode of Operations',
		description: 'The studio runs on curiosity and passion to try new frameworks and use new toolsets to create something that\'s utilitarian and useful to people in their everyday lives. It has been our motto, and it is now how we mostly operate. We\'re not professionals; but, as students, we\'re learning how to be one.',
		icon: 'i-lucide-a-large-small',
		to: '/docs/getting-started/integrations/fonts'
	}
])
</script>

<template>
	<UPageSection
		:ui="{
			container: '!pt-0 lg:grid lg:grid-cols-2 gap-8'
		}"
	>
		<UPageSection
			v-for="(feature, index) in features"
			:key="index"
			:title="feature.title"
			:description="feature.description"
			:ui="{
			  	container: '!p-0',
			  	title: 'text-left text-xl sm:text-xl lg:text-2xl font-medium',
			  	description: 'text-left mt-3 text-sm sm:text-md lg:text-sm text-muted'
			}"
		/>
	</UPageSection>
</template>

<style scoped>

</style>
