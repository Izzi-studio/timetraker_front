import { i18n } from '@/main'

const getTimeSpent = (sec) => {
    let str = ''

    const distance = sec * 1000
    
    const days = Math.floor(distance / (1000 * 60 * 60 * 24))
    const hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60))
    const minutes = Math.round((distance % (1000 * 60 * 60)) / (1000 * 60))

    if (days) str += `${days} ${i18n.global.t('date_d')} `
    if (hours) str += `${hours} ${i18n.global.t('date_h')} `
    if (minutes) str += `${minutes} ${i18n.global.t('date_m')} `

    return str
}

export default getTimeSpent