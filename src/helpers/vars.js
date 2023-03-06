export const months = [
    {
        id: '01',
        name: 'January',
    },
    {
        id: '02',
        name: 'February',
    },
    {
        id: '03',
        name: 'March',
    },
    {
        id: '04',
        name: 'April',
    },
    {
        id: '05',
        name: 'May',
    },
    {
        id: '06',
        name: 'June',
    },
    {
        id: '07',
        name: 'July',
    },
    {
        id: '08',
        name: 'August',
    },
    {
        id: '09',
        name: 'September',
    },
    {
        id: '10',
        name: 'October',
    },
    {
        id: '11',
        name: 'November',
    },
    {
        id: '12',
        name: 'December',
    },
]

export const years = [
    new Date().getFullYear(),
    new Date(new Date().setFullYear(new Date().getFullYear() - 1)).getFullYear(),
    new Date(new Date().setFullYear(new Date().getFullYear() - 2)).getFullYear(),
]

export const trackerStatuses = [
    {
        id: 0,
        name: 'weekend_day'
    },
    {
        id: 1,
        name: 'start_day'
    },
    {
        id: 2,
        name: 'stop_day'
    },
    {
        id: 3,
        name: 'pause'
    },
    {
        id: 5,
        name: 'sick_day'
    },
    {
        id: 6,
        name: 'vocation_day'
    },
]