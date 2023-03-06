<script setup>
import { ref } from 'vue'

const props = defineProps(['colspan'])
const isOpen = ref(false)
</script>

<template>
    <tr :class="{'active' : isOpen}">
        <slot></slot>
        <td class="col-btn-dropdown" @click="isOpen = !isOpen">
            <button 
                class="btn btn-green btn-dropdown"
                :class="{'active' : isOpen }"
            ></button>
        </td>
    </tr>
    <tr class="table-inner" :class="{'active' : isOpen }">
        <td :colspan="colspan+1">
            <table>
                <slot name="table-inner"></slot>
            </table>
        </td>
    </tr>
</template>