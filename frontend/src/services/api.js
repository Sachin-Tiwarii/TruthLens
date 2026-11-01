import axios from 'axios'

export const API_BASE_URL = (import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000').replace(/\/+$/, '')

const api = axios.create({
  baseURL: API_BASE_URL,
  timeout: 30000,
})

// The auth store plugs in here (see store/authStore.js), so this module never
// imports the store and there is no circular dependency.
let getToken = () => null
let onUnauthorized = () => {}

export function configureApiAuth(options) {
  getToken = options.getToken
  onUnauthorized = options.onUnauthorized
}

api.interceptors.request.use((config) => {
  const token = getToken()
  if (token) config.headers.Authorization = `Bearer ${token}`
  return config
})

api.interceptors.response.use(
  (response) => response,
  (error) => {
    // A rejected session (expired token, deleted user): sign out so the user is sent to login.
    if (error.response?.status === 401 && getToken()) onUnauthorized()
    return Promise.reject(error)
  }
)

export function getErrorMessage(error, fallback = 'Something went wrong. Please try again.') {
  if (error?.code === 'ECONNABORTED') {
    return 'The server took too long to respond. Please try again.'
  }
  if (!error?.response) {
    // No response at all: backend down, wrong VITE_API_BASE_URL, or origin not in CORS_ORIGINS.
    return `Cannot reach the TruthLens server at ${API_BASE_URL}. Make sure the backend is running.`
  }
  const detail = error.response.data?.detail
  if (typeof detail === 'string') return detail
  if (Array.isArray(detail) && detail[0]?.msg) return detail[0].msg
  return fallback
}

export default api
