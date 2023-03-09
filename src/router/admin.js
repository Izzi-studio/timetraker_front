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
]