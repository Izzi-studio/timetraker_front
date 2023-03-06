<script setup>
import { computed, defineAsyncComponent } from 'vue'
import { storeToRefs } from 'pinia'
import { useMainStore } from '@/stores/main'
import { useAuthStore } from '@/stores/auth'
import { useRoute } from 'vue-router'
import LayoutLoader from '@/components/LayoutLoader'

const LayoutEmpty = defineAsyncComponent(() => import('@/components/LayoutEmpty'))
const LayoutMain = defineAsyncComponent(() => import('@/components/LayoutMain'))

const route = useRoute()

const mainStore = useMainStore()
const authStore = useAuthStore()
const { width, height } = storeToRefs(mainStore)
const { info } = storeToRefs(authStore)

const layout = computed(() => {
    if (route.meta.auth && !info.value) {
        return LayoutLoader
    } else {
        if (route.meta.layout == 'empty') {
            return LayoutEmpty
        }

        if (route.meta.layout == 'main') {
            return LayoutMain
        }
    }
})

window.addEventListener('resize', () => {
    width.value = window.innerWidth
    height.value = window.innerHeight
})
</script>

<template>
    <Transition mode="out-in">
        <Component :is="layout" />
    </Transition>
    <notifications class="app-notification" position="bottom right" />
</template>

<style lang="scss">
    @import '@/styles/app';
</style>