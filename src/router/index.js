import { createRouter, createWebHistory } from 'vue-router'

// import { notify } from '@kyvg/vue3-notification'
import { useAuthStore } from '@/stores/auth'
// import { useMainStore } from '@/stores/main'
import { getItem } from '@/helpers/persistanceStorage'
// import { i18n } from '@/main'

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
        component: () => import('@/views/TimeTracking'),
    },
    {
        path: '/statistics',
        name: 'statistics',
        meta: { layout: 'main', auth: true, role: 'customer' },
        component: () => import('@/views/Statistics'),
    },
    {
        path: '/register-company',
        name: 'register-company',
        meta: { layout: 'empty' },
        component: () => import('@/views/RegisterCompany'),
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
    // const mainStore = useMainStore()
    // const isDifferentVersion = await mainStore.checkIsDifferentVersion()

    // if(isDifferentVersion) window.location.href = to.fullPath 

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