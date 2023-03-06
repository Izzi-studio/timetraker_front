<script setup>
import VSelect from 'vue-select'
import { useAttrs } from 'vue'

const attrs = useAttrs()
</script>

<template>
    <VSelect 
        :reduce="option => option.id"
        :clearable="false"
        :searchable="false"
        label="name"
        v-bind="attrs"
    >
        <template #no-options>{{ $t('select_not_found') }}</template>
    </VSelect>
</template>
