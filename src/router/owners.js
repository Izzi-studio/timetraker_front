export default [
    {
        path: '/company-info',
        name: 'company-info',
        meta: { layout: 'main', auth: true, role: 'owner' },
        component: () => import('@/views/owners/CompanyInfo'),
    },
    {
        path: '/customers',
        name: 'company-customers',
        meta: { layout: 'main', auth: true, role: 'owner' },
        component: () => import('@/views/owners/CustomersList'),
    },
    {
        path: '/customer/:id/view',
        name: 'company-customer-info',
        meta: { layout: 'main', auth: true, role: 'owner' },
        component: () => import('@/views/owners/CustomerInfo'),
    },
    {
        path: '/customer/:id/statistics',
        name: 'company-customer-statistics',
        meta: { layout: 'main', auth: true, role: 'owner' },
        component: () => import('@/views/owners/CustomerStatistics'),
    },
    {
        path: '/customers/create',
        name: 'company-customer-create',
        meta: { layout: 'main', auth: true, role: 'owner' },
        component: () => import('@/views/owners/CustomerCreate'),
    },
]