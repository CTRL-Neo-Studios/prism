<script setup lang="ts">
import { computed } from 'vue'

const props = withDefaults(defineProps<{ gapSize?: number }>(), {
    gapSize: 6,
})

const gapRem = computed(() => `${props.gapSize * 0.25}rem`)
</script>

<template>
    <div
        class="columns-1 sm:columns-2 lg:columns-3 xl:columns-4 gap-[var(--gap)] [&>*]:break-inside-avoid [&>*]:mb-[var(--gap)]"
        :style="{ '--gap': gapRem }"
    >
        <slot />
    </div>
</template>

<style scoped>
@reference "~/assets/css/main.css";
</style>
