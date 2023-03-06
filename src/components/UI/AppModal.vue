<script setup>
import { useAttrs, useSlots } from 'vue'

import { VueFinalModal } from 'vue-final-modal'

import AppIcon from '@/components/UI/AppIcon'

const attrs = useAttrs()
const slots = useSlots()
</script>

<template>
    <VueFinalModal
        v-slot="{ params, close }"
        v-bind="attrs"
        classes="modal-container"
        content-class="modal-content"
    >
        <div v-if="slots['title']" class="modal__title">
            <slot name="title"></slot>
        </div>
        <div class="modal__content">
            <slot :params="params"></slot>
        </div>
        <button class="modal__close" @click="close">
            <AppIcon name="close" />
        </button>
    </VueFinalModal>
</template>