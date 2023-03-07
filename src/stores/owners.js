import { defineStore } from 'pinia'
import axiosHelper from '@/helpers/axios'

export const useOwnersStore = defineStore('owners', {
    state: () => ({
        isLoading: false,
        isShowModalDeleteCustomer: false
    }),
    actions: {
        async createCustomer(form) {
            try {
                this.isLoading = true

                const response = await axiosHelper.post('/owner/register-customer', form)

                if (!response.data.result) {
                    throw new Error(response.data.message)
                }
            } catch (e) {
                throw e
            } finally {
                this.isLoading = false
            }
        },
        async deleteCustomer(id) {
            try {
                this.isLoading = true

                const response = await axiosHelper.post(`/owner/customers/${id}`, {
                   _method: 'DELETE' 
                })

                if (!response.data.result) {
                    throw new Error(response.data.message)
                }
            } catch (e) {
                throw e
            } finally {
                this.isShowModalDeleteCustomer = false
                this.isLoading = false
            }
        },
        async loadCustomers(params) {
            try {
                this.isLoading = true

                const response = await axiosHelper.get('/owner/customers', {
                    params
                })

                return response.data
            } catch (e) {
                throw e
            } finally {
                this.isLoading = false
            }
        },
        async loadCompanyInfo() {
            try {
                this.isLoading = true

                const response = await axiosHelper.get('/owner/company')

                return response.data.data
            } catch (e) {
                throw e
            } finally {
                this.isLoading = false
            }
        },
        async updateCompanyInfo(form) {
            try {
                this.isLoading = true

                const response = await axiosHelper.post('/owner/company', form)

                if (!response.data.result) {
                    throw new Error(response.data.message)
                }
            } catch (e) {
                throw e
            } finally {
                this.isLoading = false
            }
        },
    },
})
