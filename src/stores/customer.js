import { defineStore } from 'pinia'
import axiosHelper from '@/helpers/axios'

export const useCustomerStore = defineStore('customer', {
    actions: {
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
