<script setup>
import { computed } from 'vue'
import { useI18n } from 'vue-i18n'

const { t } = useI18n()

const props = defineProps(['value'])

const result = computed(() => {
    let str = ''

    const distance = props.value * 1000
    
    const days = Math.floor(distance / (1000 * 60 * 60 * 24))
    const hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60))
    const minutes = Math.round((distance % (1000 * 60 * 60)) / (1000 * 60))

    if (days) str += `${days} ${t('date_d')} `
    if (hours) str += `${hours} ${t('date_h')} `
    if (minutes) str += `${minutes} ${t('date_m')} `

    return str
})

</script>

<template>
    {{ result }}
</template>