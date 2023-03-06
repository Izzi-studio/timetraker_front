import { defineStore } from 'pinia'
import axiosHelper from '@/helpers/axios'

export const useCustomerStore = defineStore('customer', {
    state: () => ({
        isLoading: false
    }),
    actions: {
        async loadStatistic(params) {
            try {
                this.isLoading = true

                const response = await axiosHelper.get('/customer/statistic', {
                    params
                })

                return response.data
            } catch (e) {
                throw e
            } finally {
                this.isLoading = false
            }
        },
        async updateComments({trackerId, comments}) {
            try {
                const response = await axiosHelper.post(`/customer/tracker/${trackerId}`, {
                    _method: 'PUT',
                    comments
                })

                if (!response.data.result) {
                    throw new Error(response.data.message)
                }
            } catch (e) {
                throw e
            }
        },
        async availableActions() {
            try {
                const response = await axiosHelper.get('/customer/tracker')

                if (response.data.result) {
                    return response.data.data
                } else {
                    throw new Error(response.data.message)
                }
            } catch (e) {
                throw e
            }
        },
        async tracker(typeAction) {
            try {
                const response = await axiosHelper.post('/customer/tracker', {
                    typeAction
                })

                if (response.data.result) {
                    return response.data.data
                } else {
                    throw new Error(response.data.message)
                }
            } catch (e) {
                throw e
            }
        }
    },
})
