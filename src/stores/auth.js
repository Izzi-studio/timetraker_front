import { setItem, removeItem } from '@/helpers/persistanceStorage'
import { defineStore } from 'pinia'
import axiosHelper from '@/helpers/axios'

export const useAuthStore = defineStore('auth', {
    state: () => ({
        info: null,
        isLoading: false,
        isUpdating: false,
    }),
    getters: {
        isUserOwner(state) {
            if(!state.info) return false 

            return state.info.role === 'owner'
        },
        isUserCustomer(state) {
            if(!state.info) return false 

            return state.info.role === 'customer'
        },
        isUserAdmin(state) {
            if(!state.info) return false 

            return state.info.role === 'admin'
        },
        isCompanyStatusActive(state) {
            if(!state.info) return false 

            return state.info.active_company === 'active'
        },
        isCompanyStatusBlocked(state) {
            if(!state.info) return false 

            return state.info.active_company === 'blocked'
        },
        isCompanyStatusInactiv(state) {
            if(!state.info) return false 

            return state.info.active_company === 'inactiv'
        },
    },
    actions: {
        async logout() {
            try {
                const response = await axiosHelper.post('/logout')

                if (response.data.result) {
                    this.info = null
                    removeItem('accessToken')
                } else {
                    throw new Error(response.data.message)
                }
            } catch (e) {
                throw e
            }
        },
        async login(email, password) {
            try {
                this.isLoading = true

                const response = await axiosHelper.post('/login', { email, password })

                if (response.data.result) {
                    this.info = response.data.data
                    setItem('accessToken', response.data.data.token)
                } else {
                    throw new Error(response.data.message)
                }
            } catch (e) {
                throw e
            } finally {
                this.isLoading = false
            }
        },
        async loadInfo() {
            try {
                this.isLoading = true

                const response = await axiosHelper.get('/getMe')
                
                if (response.data.result) {
                    this.info = response.data.data
                } else {
                    removeItem('accessToken')
                    throw new Error(response.data.message)
                }
            } catch (e) {
                removeItem('accessToken')
                throw e
            } finally {
                this.isLoading = false
            }
        },
    },
})
