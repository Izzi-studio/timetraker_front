<template>
    <div class="empty-layout">
        <RouterView v-slot="{ Component, route }">
            <Transition mode="out-in">
                <div :key="route.path">
                    <Component :is="Component" />
                </div>
            </Transition>
        </RouterView>
    </div>
</template>