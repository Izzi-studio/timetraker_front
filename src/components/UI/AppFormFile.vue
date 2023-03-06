<script setup>
import { useSlots } from 'vue'

import AppIcon from '@/components/UI/AppIcon'

const slots = useSlots()
const props = defineProps({
    label: String,
    modelValue: [Object, Array],
    classInput: [String, Object, Array],
    inputOptions: Object
})
const emit = defineEmits(['update:modelValue'])

const processFile = (e) => {
    let result

    if (props.inputOptions && props.inputOptions.multiple) {
        result = [...e.target.files]        
    } else {
        if (e.target.files.length) {
            result = e.target.files[0]
        } else {
            result = null
        }
    }

    emit('update:modelValue', result)
} 
</script>

<template>
    <div class="app-field">
        <p v-if="label" class="app-label">{{ label }}</p>
        <label class="app-field__file" :class="classInput">
            <input @change="processFile" type="file" v-bind="inputOptions">
            <AppIcon name="file" class="me-2" />
            <span>
                <template v-if="!modelValue || modelValue.length === 0">
                    {{ $t(inputOptions && inputOptions.multiple ? 'select_files' : 'select_file') }}
                </template>
                <template v-else-if="Array.isArray(modelValue)">
                    {{ $t('selected_count_files', { count: modelValue.length}) }}
                </template>
                <template v-else>
                    {{ modelValue.name }}
                </template>
            </span>
        </label>
        <div v-if="slots['input-bottom']" class="app-field__bottom">
            <slot name="input-bottom"></slot>
        </div>
    </div>
</template>