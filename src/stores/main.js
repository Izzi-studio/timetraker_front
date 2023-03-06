import { defineStore } from 'pinia'
import axios from 'axios'

export const useMainStore = defineStore('main', {
    state: () => ({
        isLoading: false,
        width: window.innerWidth,
        height: window.innerHeight,
        perPageDefault: 50,
        version: ''
    }),
    actions: {
        async checkIsDifferentVersion() {
            if (import.meta.hot) {
                return false
            } else {
                try {
                    const response = await axios.get(`${import.meta.env.VITE_URL}/v.txt?v=${Date.now()}`)

                    if (!this.version) {
                        this.version = response.data
                        
                        return false
                    } else {
                        return response.data !== this.version
                    }
                } catch (e) {
                    throw e
                }
            }
        }
    }
})
