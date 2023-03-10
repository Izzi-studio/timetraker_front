export default [
    {
        path: '/companies',
        name: 'companies',
        meta: { layout: 'main', auth: true, role: 'admin' },
        component: () => import('@/views/admin/CompaniesList'),
    },
    {
        path: '/companies/:id/view',
        name: 'admin-company-info',
        meta: { layout: 'main', auth: true, role: 'admin' },
        component: () => import('@/views/admin/CompanyInfo'),
    },
    {
        path: '/companies/:id/customers',
        name: 'admin-company-customers',
        meta: { layout: 'main', auth: true, role: 'admin' },
        component: () => import('@/views/admin/CustomersList'),
    },
    {
        path: '/companies/:id/customers/create',
        name: 'admin-company-customers-create',
        meta: { layout: 'main', auth: true, role: 'admin' },
        component: () => import('@/views/admin/CustomerCreate'),
    },
    {
        path: '/companies/:companyId/customers/:customerId/view',
        name: 'admin-company-customer-info',
        meta: { layout: 'main', auth: true, role: 'admin' },
        component: () => import('@/views/admin/CustomerInfo'),
    },
    {
        path: '/companies/:companyId/customers/:customerId/statistics',
        name: 'admin-company-customer-statistics',
        meta: { layout: 'main', auth: true, role: 'admin' },
        component: () => import('@/views/admin/CustomerStatistics'),
    },
]