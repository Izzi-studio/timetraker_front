<script setup>
import { storeToRefs } from 'pinia'
import { useAuthStore } from '@/stores/auth'

const authStore = useAuthStore()

const { info } = storeToRefs(authStore)

</script>

<template>
    <div class="container mt-4">
        <h2 v-if="info.role === 'owner' && info.active_company === 'inactiv'" class="section-title">{{$t('owner_inactiv_company')}}</h2>
        <h2 v-else-if="info.role === 'owner' && info.active_company === 'blocked'" class="section-title">{{$t('owner_blocked_company')}}</h2>
        <h2 v-else-if="info.role === 'customer' && info.active_company === 'inactiv'" class="section-title">{{$t('customer_blocked_company')}}</h2>
        <h2 v-else-if="info.role === 'customer' && info.active_company === 'blocked'" class="section-title">{{$t('customer_blocked_company')}}</h2>
        <h2 v-else class="section-title">{{$t('welcome')}}</h2>
    </div>
</template>