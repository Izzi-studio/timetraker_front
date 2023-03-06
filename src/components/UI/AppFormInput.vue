<script setup>
import { computed, useSlots, ref } from 'vue'

import AppIcon from '@/components/UI/AppIcon'

const slots = useSlots()

const props = defineProps({
    modelValue: [String, Number],
    modelModifiers: { default: () => ({}) },
    readonly: Boolean,
    label: String,
    placeholder: String,
    autocomplete: String,
    name: String,
    inputId: String,
    classInput: [String, Object, Array],
    type: {
        type: String,
        default: 'text'
    }
})

const inputOptions = computed(() => {
    const obj = {}

    if (props.type === 'number') { 
        obj.type = 'number'
        obj.step = 0.01
    } else if (props.type === 'password') {
        obj.type = passwordType.value
    } else {
        obj.type = props.type
    }

    if(props.readonly) obj.readonly = props.readonly
    if(props.inputId) obj.id = props.inputId
    if(props.placeholder) obj.placeholder = props.placeholder
    if(props.name) obj.name = props.name
    if(props.classInput) obj.class = props.classInput
    if(props.autocomplete) obj.autocomplete = props.autocomplete

    return obj
})

const emit = defineEmits(['update:modelValue'])

const setVal = (event) => {
    if (props.modelModifiers['only-numbers'] && props.type === 'text') {
        const val = event.target.value.replace(/\D/g, "")
        
        event.target.value = val
        emit('update:modelValue', val)
    } else {
        emit('update:modelValue', event.target.value)
    }
}

const passwordType = ref('password')
const togglerPassword = () => {
    if (passwordType.value === 'password') {
        passwordType.value = 'text'
    } else {
        passwordType.value = 'password'
    }
}
</script>

<template>
    <div class="app-field">
        <p v-if="label" class="app-label">{{ label }}</p>
        <div class="app-field__inner">
            <input
                :value="modelValue"
                @input="setVal($event)"
                v-bind="inputOptions"
            >
            <button
                v-if="type == 'password'"
                @click="togglerPassword"
                class="app-field__password-toggler" 
                type="button" 
            >
                <AppIcon :name="passwordType === 'password' ? 'eye' : 'eye-slash' "/>
            </button>
        </div>
        <div v-if="slots['input-bottom']" class="app-field__bottom">
            <slot name="input-bottom"></slot>
        </div>
    </div>
</template>