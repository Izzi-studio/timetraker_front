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
    <label class="app-radio" :class="{'app-radio_only-label': onlyLabel}">
        <input v-model="model" :value="value" type="radio">
        <div class="app-radio__radio"></div>
        <span class="app-radio__label">{{label}}</span>
    </label>
</template>