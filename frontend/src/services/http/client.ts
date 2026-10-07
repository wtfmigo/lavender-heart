import axios from 'axios'

export const apiBaseUrl = import.meta.env.VITE_API_BASE_URL?.trim()

export const http = axios.create({
  baseURL: apiBaseUrl,
  timeout: 10000,
  withCredentials: true,
  withXSRFToken: true,
  headers: { Accept: 'application/json' },
})
