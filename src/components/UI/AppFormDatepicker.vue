<script setup>
import Datepicker from '@vuepic/vue-datepicker'
import { useMainStore } from '@/stores/main'
import { useAttrs } from 'vue'

const mainStore = useMainStore()

const attrs = useAttrs()
</script>

<template>
    <datepicker
        :select-text="$t('select')"
        :cancel-text="$t('cancel')"
        :clearable="false"
        locale="de"
        :offset="15"
        position="left"
        v-bind="attrs"
    />
</template>