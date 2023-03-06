import de from './locales/de'

import 'virtual:svg-icons-register'
import { createApp } from 'vue'
import { createPinia } from 'pinia'
import { createI18n } from 'vue-i18n'
import Notifications from '@kyvg/vue3-notification'

import router from './router'
import App from './App'

import vh from '@/helpers/vh'

window.addEventListener('resize', vh)
window.addEventListener('load', vh)

const pinia = createPinia()

export const i18n = createI18n({
    locale: 'de',
    fallbackLocale: 'de',
    messages: {
        de
    }
})

const app = createApp(App)

app
    .use(pinia)
    .use(router)
    .use(i18n)
    .use(Notifications)
    .mount('#app')
