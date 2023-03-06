<script setup>
import TheHeader from '@/components/TheHeader'
import TheFooter from '@/components/TheFooter'
</script>

<template>
    <div class="main-layout">
        <TheHeader />
        <div>
            <RouterView v-slot="{ Component, route }">
                <Transition mode="out-in">
                    <div :key="route.path">
                        <Component :is="Component" />
                    </div>
                </Transition>
            </RouterView>
        </div>
        <TheFooter />
    </div>
</template>