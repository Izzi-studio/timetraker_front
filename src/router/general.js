export default [
    {
        path: '/',
        name: 'home',
        meta: { layout: 'main', auth: true },
        component: () => import('@/views/Home'),
    },
    {
        path: '/register-company',
        name: 'register-company',
        meta: { layout: 'empty' },
        component: () => import('@/views/owners/CompanyRegister'),
    },
    {
        path: '/login',
        name: 'login',
        meta: { layout: 'empty' },
        component: () => import('@/views/Login'),
    },
    {
        path: '/:pathMatch(.*)*',
        name: 'notFound',
        meta: { layout: 'empty' },
        component: () => import('@/views/NotFound'),
    },
]