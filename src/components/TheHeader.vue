<script setup>
import { computed, ref, watch } from 'vue'
import { storeToRefs } from 'pinia'
import { useMainStore } from '@/stores/main'
import { useRoute, useRouter } from 'vue-router'
import { useAuthStore } from '@/stores/auth'
import getCSSVariable from '@/helpers/getCSSVariable'
import { notify } from '@kyvg/vue3-notification'

import AppBurger from '@/components/UI/AppBurger'
// import AppIcon from '@/components/UI/AppIcon'

const router = useRouter()
const route = useRoute()

const authStore = useAuthStore()
const mainStore = useMainStore()
const { width } = storeToRefs(mainStore)
const { isUserOwner, isUserCustomer, isUserAdmin } = storeToRefs(authStore)
const { logout } = authStore

const isActiveNav = ref(false)

const navHandler = (e) => {
    const parentClassList = e.target.parentElement.classList
    if (width.value < +getCSSVariable('--xl') && parentClassList.contains('has-submenu')) {
        parentClassList.toggle('active')
    }
}

const navClasses = computed(() => {
    return {
        'transition': width.value < +getCSSVariable('--xl'),
        'active': isActiveNav.value
    }
})

const initLogout = async () => {
    try {
        await logout()
        router.push({ name: 'login' })
    } catch (e) {
        notify({ type: "error", text: e.message });
    }
}

watch(() => route.name, () => {
    setTimeout(() => {
        isActiveNav.value = false
    }, 100)
})
</script>

<template>
    <header class="header">
        <div @click="isActiveNav = false" class="overlay" :class="{'active': isActiveNav}"></div>
        <div class="container header__container">
            <AppBurger @click="isActiveNav = !isActiveNav" class="header__burger" :class="{ 'active': isActiveNav }" />
            <img src="@/assets/images/logo.svg" alt="" class="header__logo">
            <div class="header__nav" :class="navClasses">
                <ul @click="navHandler" class="header__menu">
                    <li class="header__item">
                        <RouterLink :to="{ name: 'home' }">{{ $t('homepage') }}</RouterLink>
                    </li>
                    <template v-if="isUserCustomer">
                        <li class="header__item">
                            <RouterLink :to="{ name: 'statistics' }">{{ $t('statistics') }}</RouterLink>
                        </li>
                        <li class="header__item">
                            <RouterLink :to="{ name: 'time-tracking' }">{{ $t('time_tracking') }}</RouterLink>
                        </li>
                    </template>
                </ul>
                <ul class="header__action">
                    <li class="header__item">
                        <button class="btn-link color-red" @click="initLogout">Ausloggen</button>
                    </li>
                </ul>
            </div>
        </div>
    </header>
</template>