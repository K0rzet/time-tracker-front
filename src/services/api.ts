import axios from 'axios'
import { CreateProjectDto, UpdateProjectDto, CreateTimerDto, UpdateTimerDto } from '../types'

const BASE_URL = import.meta.env.VITE_API_URL || 'https://api.time-tracker.ilyacode.ru'

export const api = axios.create({
  baseURL: BASE_URL,
  withCredentials: true,
  headers: {
    'Content-Type': 'application/json',
  },
})

// Добавляем токен к каждому запросу
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token')
  if (token) {
    config.headers.Authorization = `Bearer ${token}`
  }
  return config
})

// Добавляем перехватчик ответов
api.interceptors.response.use(
  (response) => response,
  (error) => {
    // Не перенаправляем на страницу логина автоматически
    // Вместо этого пробрасываем ошибку дальше для обработки в компонентах
    return Promise.reject(error)
  }
)

export const authApi = {
  login: async (data: { email: string; password: string }) => {
    const response = await api.post('/auth/login', data)
    if (response.data.token) {
      localStorage.setItem('token', response.data.token)
    }
    return response
  },
  register: async (data: { email: string; password: string }) => {
    const response = await api.post('/auth/register', data)
    if (response.data.token) {
      localStorage.setItem('token', response.data.token)
    }
    return response
  },
  logout: () => {
    localStorage.removeItem('token')
    return Promise.resolve()
  },
}

export const projectsApi = {
  getAll: () => api.get('/projects'),
  getOne: (id: string) => api.get(`/projects/${id}`),
  getProjectWithTimers: (id: string) => api.get(`/projects/${id}/timers`),
  create: (data: CreateProjectDto) => api.post('/projects', data),
  update: (id: string, data: UpdateProjectDto) => api.patch(`/projects/${id}`, data),
  delete: (id: string) => api.delete(`/projects/${id}`),
}

export const timersApi = {
  getAll: () => api.get('/timers'),
  getAllByProject: (projectId: string) => api.get(`/projects/${projectId}/timers`),
  create: (data: CreateTimerDto) => api.post('/timers', data),
  delete: (id: string) => api.delete(`/timers/${id}`),
  pause: (id: string) => api.post(`/timers/${id}/pause`),
  resume: (id: string) => api.post(`/timers/${id}/resume`),
  stop: (id: string) => api.post(`/timers/${id}/stop`),
  update: (timerId: string, data: UpdateTimerDto) =>
    api.patch(`/timers/${timerId}`, data),
  getStatistics: (period: string, paidFilter: string) => 
    api.get(`/timers/statistics/${period}`, { params: { paidFilter } }),
  markAllPaid: (projectId: string) => 
    api.post(`/timers/project/${projectId}/mark-all-paid`),
}