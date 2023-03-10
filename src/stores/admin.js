import { defineStore } from 'pinia'
import axiosHelper from '@/helpers/axios'

export const useAdminStore = defineStore('admin', {
    state: () => ({
        isLoading: false,
        isShowModalDeleteCustomer: false,
        isShowModalDeleteCompany: false,
        isShowModalEditStatistic: false,
    }),
    actions: {
        async loadCompanies(params) {
            try {
                this.isLoading = true

                const response = await axiosHelper.get('/admin/companies', {
                    params
                })

                return response.data
            } catch (e) {
                throw e
            } finally {
                this.isLoading = false
            }
        },
        async deleteCompany(id) {
            try {
                this.isLoading = true

                const response = await axiosHelper.post(`/admin/companies/${id}`, {
                   _method: 'DELETE' 
                })

                if (!response.data.result) {
                    throw new Error(response.data.message)
                }
            } catch (e) {
                throw e
            } finally {
                this.isShowModalDeleteCompany = false
                this.isLoading = false
            }
        },
        async loadCompanyInfo(id) {
            try {
                this.isLoading = true

                const response = await axiosHelper.get(`/admin/companies/${id}`)

                return response.data.data
            } catch (e) {
                throw e
            } finally {
                this.isLoading = false
            }
        },
        async updateCompanyInfo(id, form) {
            try {
                this.isLoading = true

                const response = await axiosHelper.post(`/admin/companies/${id}`, {
                    ...form,
                    _method: 'PUT'
                })

                return response.data.data
            } catch (e) {
                throw e
            } finally {
                this.isLoading = false
            }
        },
        async requestOnChangeCompanyInfo(id, val) {
            try {
                this.isLoading = true

                const response = await axiosHelper.post(`/admin/change-info-company/${id}`, {
                    approved: val,
                    _method: 'PUT'
                })

                return response.data.data
            } catch (e) {
                throw e
            } finally {
                this.isLoading = false
            }
        },
        async loadCustomer(id) {
            try {
                this.isLoading = true

                const response = await axiosHelper.get(`/admin/customers/${id}`)

                return response.data.data
            } catch (e) {
                throw e
            } finally {
                this.isLoading = false
            }
        },
        async updateCustomerTracker(id, form) {
            try {
                this.isLoading = true

                await axiosHelper.post(`/admin/statistic/tracker/${id}`, {
                    ...form,
                    _method: 'PUT'
                })
            } catch (e) {
                throw e
            } finally {
                this.isLoading = false
                this.isShowModalEditStatistic = false
            }
        },
        async updateCustomer(id, form) {
            try {
                this.isLoading = true

                await axiosHelper.post(`/admin/customers/${id}`, {
                    ...form,
                    _method: 'PUT'
                })
            } catch (e) {
                throw e
            } finally {
                this.isLoading = false
            }
        },
        async createCustomer(id, form) {
            try {
                this.isLoading = true

                const response = await axiosHelper.post('/admin/customers', {
                    ...form,
                    company_id: id
                })

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

                const response = await axiosHelper.post(`/admin/customers/${id}`, {
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

                const response = await axiosHelper.get('/admin/customers', {
                    params
                })

                return response.data
            } catch (e) {
                throw e
            } finally {
                this.isLoading = false
            }
        },
        async loadCustomerStatistic(id, params) {
            try {
                this.isLoading = true

                const response = await axiosHelper.get(`/admin/statistic/${id}`, {
                    params
                })

                return response.data
            } catch (e) {
                throw e
            } finally {
                this.isLoading = false
            }
        },
    },
})
