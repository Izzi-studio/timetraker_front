import { createRouter, createWebHistory } from 'vue-router'

import { useAuthStore } from '@/stores/auth'
import { getItem } from '@/helpers/persistanceStorage'

const routes = [
    {
        path: '/',
        name: 'home',
        meta: { layout: 'main', auth: true },
        component: () => import('@/views/Home'),
    },
    {
        path: '/login',
        name: 'login',
        meta: { layout: 'empty' },
        component: () => import('@/views/Login'),
    },
    {
        path: '/time-tracking',
        name: 'time-tracking',
        meta: { layout: 'main', auth: true, role: 'customer' },
        component: () => import('@/views/customers/TimeTracking'),
    },
    {
        path: '/statistics',
        name: 'statistics',
        meta: { layout: 'main', auth: true, role: 'customer' },
        component: () => import('@/views/customers/Statistics'),
    },
    {
        path: '/customers',
        name: 'owner-customers',
        meta: { layout: 'main', auth: true, role: 'owner' },
        component: () => import('@/views/owners/CustomersList'),
    },
    {
        path: '/customer/:id/view',
        name: 'owner-customer-info',
        meta: { layout: 'main', auth: true, role: 'owner' },
        component: () => import('@/views/owners/CustomerInfo'),
    },
    {
        path: '/customer/:id/statistics',
        name: 'owner-customer-statistics',
        meta: { layout: 'main', auth: true, role: 'owner' },
        component: () => import('@/views/owners/CustomerStatistics'),
    },
    {
        path: '/customers/create',
        name: 'owner-customer-create',
        meta: { layout: 'main', auth: true, role: 'owner' },
        component: () => import('@/views/owners/CustomerCreate'),
    },
    {
        path: '/company-info',
        name: 'owner-info',
        meta: { layout: 'main', auth: true, role: 'owner' },
        component: () => import('@/views/owners/CompanyInfo'),
    },
    {
        path: '/register-company',
        name: 'register-company',
        meta: { layout: 'empty' },
        component: () => import('@/views/owners/CompanyRegister'),
    },
    {
        path: '/:pathMatch(.*)*',
        name: 'notFound',
        meta: { layout: 'empty' },
        component: () => import('@/views/NotFound'),
    },
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

                if (
                    (authStore.isUserOwner || authStore.isUserCustomer) &&
                    (authStore.isCompanyStatusInactiv || authStore.isCompanyStatusBlocked)
                ) {
                    return { name: 'home' }
                }

                if (authStore.info.role !== to.meta.role) {
                    return { name: 'home' }
                }
            } catch (e) {
                if (to.meta.auth) {
                    return { name: 'login', query: { redirect: to.fullPath } }
                }
            }
        }
    }
})

export default router