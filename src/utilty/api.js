import axios from 'axios'
import { useUserStore } from '../stores/user-store'
const userStore = useUserStore()

const apiClient = axios.create({
  baseURL: 'http://localhost:5264/api', // Base URL for your API
  headers: {
    'Content-Type': 'application/json',
    Authorization: 'Bearer ' + userStore.token || ''
  }
})

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
  } else {
    alert('An error occurred')
  }
  throw error // Re-throw the error to handle it further up the call stack if necessary
}
