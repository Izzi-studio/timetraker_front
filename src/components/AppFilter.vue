<script setup>
import AppIcon from '@/components/UI/AppIcon'

const emit = defineEmits(['close', 'search', 'reset'])
const props = defineProps({
    isOpen: Boolean,
    isLoading: Boolean
})
</script>

<template>
    <div class="app-filter" :class="{ 'active': isOpen }">
        <div class="app-filter__top">
            <h4 class="app-filter__title">{{ $t('filter') }}</h4>
            <button @click="emit('close')" class="app-filter__close">
                <AppIcon name="close" />
            </button>
        </div>
        <div class="app-filter__middle">
            <slot />
        </div>
        <div class="app-filter__bottom">
            <button 
                @click="emit('search')" 
                :disabled="isLoading"
                class="btn btn-blue w-100 app-filter__search"
            >
                {{ $t('search') }}
            </button>
            <span class="ms-3"></span>
            <button 
                @click="emit('reset')" 
                class="btn btn-blue w-100 app-filter__search"
            >
                {{ $t('reset') }}
            </button>
        </div>
    </div>
</template>