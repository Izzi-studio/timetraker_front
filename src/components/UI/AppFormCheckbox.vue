<script setup>
import { computed } from 'vue'

const props = defineProps(['label', 'modelValue', 'value', 'onlyLabel'])
const emit = defineEmits(['update:modelValue'])
const model = computed({
    get() {
        return props.modelValue;
    },
    set(val) {
        emit('update:modelValue', val);
    },
})
</script>

<template>
    <label class="app-checkbox" :class="{'app-checkbox_only-label': onlyLabel}">
        <input v-model="model" :value="value" type="checkbox">
        <div class="app-checkbox__checkbox"></div>
        <span class="app-checkbox__label">{{label}}</span>
    </label>
</template>