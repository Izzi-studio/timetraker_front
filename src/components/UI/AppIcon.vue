<script setup>
import { computed } from 'vue'

const props = defineProps({
    prefix: {
        type: String,
        default: 'icon',
    },
    name: {
        type: String,
        required: true,
    },
    size: [String, Number]
})

const symbolId = computed(() => `#${props.prefix}-${props.name}`)
</script>

<template>
    <svg class="app-icon" aria-hidden="true" :style="size ? `width: ${size}px; height: ${size}px;` : ''">
        <use :href="symbolId" />
    </svg>
</template>