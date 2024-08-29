import axios from 'axios'
import { useUserStore } from '../stores/user-store'
import { useAuthStore } from '../stores/auth-store'
import router from '../router' // Import your Vue Router instance

const apiClient = axios.create({
  baseURL: 'http://localhost:5264/api', // Base URL for your API
  headers: {
    'Content-Type': 'application/json'
  }
})

// Request interceptor to add the Authorization header
apiClient.interceptors.request.use(config => {
  const userStore = useUserStore()
  const token = userStore.token
  if (token) {
    config.headers.Authorization = `Bearer ${token}`
  }
  return config
}, error => {
  return Promise.reject(error)
})

// Response interceptor to handle unauthorized responses
apiClient.interceptors.response.use(
  response => response,
  error => {
    if (error.response && error.response.status === 401) {
      // Redirect to login page
      router.push('/auth/login')
    }
    return Promise.reject(error)
  }
)

export const get = async (url, params = {}) => {
  try {
    const response = await apiClient.get(url, { params })
    return response.data
  } catch (error) {
    handleError(error)
  }
}

export const post = async (url, data) => {
  try {
    const response = await apiClient.post(url, data)
    return response.data
  } catch (error) {
    handleError(error)
  }
}

export const put = async (url, data) => {
  try {
    const response = await apiClient.put(url, data)
    return response.data
  } catch (error) {
    handleError(error)
  }
}

export const del = async (url) => {
  try {
    const response = await apiClient.delete(url)
    return response.data
  } catch (error) {
    handleError(error)
  }
}

const handleError = (error) => {
  console.error(error)
  if (error.response) {
    console.log(error.response.data.message)
    if (error.response.status === 401) {
      // Clear user data from store
      const authStore = useAuthStore()
      authStore.logout()
    }
  } else {
    alert('An error occurred')
  }
  throw error
}
