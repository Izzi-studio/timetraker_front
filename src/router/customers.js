export default [
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
]