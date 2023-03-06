<script setup>
import Pagination from 'v-pagination-3'
import { useAttrs, computed, ref, watch } from 'vue'

const attrs = useAttrs()

const forceUpdateKey = ref(0)

const lastPage = computed(() => {
    return Math.ceil(attrs.records  / attrs['per-page'])
})

const options = computed(() => {
    return {
        chunk: 4,
        chunksNavigation: 'scroll',
        edgeNavigation: true,
        texts: {
            first: '1',
            last: lastPage.value
        } 
    }
})

watch(() => lastPage.value, () => forceUpdateKey.value = forceUpdateKey.value + 1)
</script>

<template>
    <pagination
        :key="forceUpdateKey"
        :options="options"
        v-bind="attrs"
    />
</template>