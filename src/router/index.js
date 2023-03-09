import { createRouter, createWebHistory } from 'vue-router'

import { useAuthStore } from '@/stores/auth'
import { getItem } from '@/helpers/persistanceStorage'

import admin from './admin'
import owners from './owners'
import customers from './customers'
import general from './general'

const routes = [
    ...admin,
    ...owners,
    ...customers,
    ...general,
]

const router = createRouter({
    history: createWebHistory(),
    routes,
})

router.beforeEach(async (to) => {
    if (!getItem('accessToken') && to.meta.auth) {
        return {name: 'login', query: { redirect: to.fullPath }}
    }

    if (getItem('accessToken')) {
        const authStore = useAuthStore()

        if (!authStore.info) {
            try {
                await authStore.loadInfo()

                if (to.name == 'login' || to.name == 'register-company') {
                    return { name: 'home' }
                }
            } catch (e) {
                if (to.meta.auth) {
                    return { name: 'login', query: { redirect: to.fullPath } }
                }
            }
        }

        if (to.name !== 'home') {
            if (
                (authStore.isUserOwner || authStore.isUserCustomer) &&
                (authStore.isCompanyStatusInactiv || authStore.isCompanyStatusBlocked)
            ) {
                return { name: 'home' }
            }
    
            if (authStore.info.role !== to.meta.role) {
                return { name: 'home' }
            }
        }
    }
})

export default router