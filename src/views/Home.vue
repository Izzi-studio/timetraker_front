<script setup>
import { storeToRefs } from 'pinia'
import { useAuthStore } from '@/stores/auth'

const authStore = useAuthStore()

const { isUserOwner, isUserCustomer, isCompanyStatusBlocked, isCompanyStatusInactiv } = storeToRefs(authStore)

</script>

<template>
    <div class="container mt-4">
        <h2 v-if="isUserOwner && isCompanyStatusInactiv" class="section-title">
            {{$t('owner_inactiv_company')}}
        </h2>
        <h2 v-else-if="isUserOwner && isCompanyStatusBlocked" class="section-title">
            {{$t('owner_blocked_company')}}
        </h2>
        <h2 v-else-if="isUserCustomer && isCompanyStatusInactiv" class="section-title">
            {{$t('customer_inactiv_company')}}
        </h2>
        <h2 v-else-if="isUserCustomer && isCompanyStatusBlocked" class="section-title">
            {{$t('customer_blocked_company')}}
        </h2>
        <h2 v-else class="section-title">
            {{$t('welcome')}}
        </h2>
    </div>
</template>