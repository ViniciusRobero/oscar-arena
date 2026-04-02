import axios from 'axios'

const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL ?? 'http://localhost:3001',
})

api.interceptors.request.use((config) => {
  if (typeof window !== 'undefined') {
    const token = localStorage.getItem('auth_token')
    if (token) config.headers.Authorization = `Bearer ${token}`
  }
  return config
})

api.interceptors.response.use(
  (res) => res,
  (error) => {
    if (error.response?.status === 401 && typeof window !== 'undefined') {
      localStorage.removeItem('auth_token')
      document.cookie = 'auth_token=; path=/; max-age=0'
      const locale = window.location.pathname.split('/')[1] ?? 'pt'
      window.location.href = `/${locale}/login`
    }
    return Promise.reject(error)
  },
)

export default api
