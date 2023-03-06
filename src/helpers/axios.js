import axios from 'axios'
import { getItem } from '@/helpers/persistanceStorage'

const axiosHelper = axios.create()

axiosHelper.defaults.baseURL = import.meta.env.VITE_API_URL

axiosHelper.defaults.headers.post['Content-Type'] = 'application/x-www-form-urlencoded'
axiosHelper.interceptors.request.use(config => {
    const token = getItem('accessToken')
    const authorizationToken = token ? `Bearer ${token}` : ''
    
    config.headers.Authorization = authorizationToken
    return config
})

export default axiosHelper