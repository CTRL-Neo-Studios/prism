<script setup lang="ts">
import {LazyMotion, Motion} from "motion-v";
import {useGallery} from "~/composables/core/useGallery";

useHead({
	title: 'Gallery'
})

const $ga = useGallery()
const { data: galleryImages, refresh, pending } = useAsyncData('gallery', () => $ga.getAllImages())

</script>

<template>
    <UPage>
        <UPageSection
            title="Photography Gallery"
            description="A rare hobby of mine."
        />
        <UPageSection :ui="{ container: '!pt-0' }">
            <MasonryGrid :gap-size="8">
                <Motion
                    v-for="(picture, index) in galleryImages"
                    :key="index"
                    :initial="{ opacity: 0, transform: 'translateY(10px)' }"
                    :while-in-view="{ opacity: 1, transform: 'translateY(0)' }"
                    :transition="{ delay: 0.2 }"
                    :in-view-options="{ once: true }"
                >
                    <div class="w-full h-auto rounded-lg overflow-hidden transition-all duration-200 hover:scale-[1.02] hover:cursor-pointer hover:drop-shadow-lg active:brightness-[0.8] transform-gpu">
                        <NuxtImg
                            :src="picture.image"
                            alt="gallery image"
                            class="object-cover w-full h-full"
                            format="jpeg"
                            quality="80"
							@click="() => $ga.toGalleryImage(picture.path)"
                        />
                    </div>
                </Motion>
            </MasonryGrid>
        </UPageSection>
    </UPage>
</template>

<style scoped>

</style>
