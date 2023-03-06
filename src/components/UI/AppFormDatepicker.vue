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
        :enableTimePicker="false"
        :locale="mainStore.lang"
        :offset="15"
        position="left"
        format="yyyy-MM-dd"
        placeholder="YYYY-MM-DD"
        v-bind="attrs"
    />
</template>