<script setup>
import { computed, useSlots } from 'vue'

const slots = useSlots()

const props = defineProps({
    modelValue: [String, Number],
    readonly: Boolean,
    label: String,
    placeholder: String,
    name: String,
    classInput: [String, Object, Array],
})

const inputOptions = computed(() => {
    const obj = {}

    if (props.readonly) obj.readonly = props.readonly
    if (props.placeholder) obj.placeholder = props.placeholder
    if (props.name) obj.name = props.name
    if (props.classInput) obj.class = props.classInput

    return obj
})

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
    <div class="app-field">
        <p v-if="label" class="app-label">{{ label }}</p>
        <div class="app-field__inner">
            <textarea v-model="model" v-bind="inputOptions" />
        </div>
        <div v-if="slots['input-bottom']" class="app-field__bottom">
        <slot name="input-bottom"></slot>
    </div>
  </div>
</template>