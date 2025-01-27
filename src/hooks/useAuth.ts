import { useMutation } from '@tanstack/react-query'
import { authApi } from '../services/api'
import { useNavigate } from 'react-router-dom'
import { notifications } from '@mantine/notifications'
import { AxiosError } from 'axios'

interface ErrorResponse {
  message: string
  error: string
  statusCode: number
}

export const useAuth = () => {
  const navigate = useNavigate()

  const loginMutation = useMutation({
    mutationFn: async (credentials: { email: string; password: string }) => {
      try {
        const response = await authApi.login(credentials)
        return response.data
      } catch (error) {
        const axiosError = error as AxiosError<ErrorResponse>
        throw new Error(axiosError.response?.data?.message || 'Ошибка при входе')
      }
    },
    onSuccess: () => {
      navigate('/')
      notifications.show({
        title: 'Успешно',
        message: 'Вы вошли в систему',
        color: 'green',
      })
    },
    onError: (error: Error) => {
      notifications.show({
        title: 'Ошибка',
        message: error.message,
        color: 'red',
      })
    },
  })

  const registerMutation = useMutation({
    mutationFn: async (credentials: { email: string; password: string }) => {
      try {
        const response = await authApi.register(credentials)
        return response.data
      } catch (error) {
        const axiosError = error as AxiosError<ErrorResponse>
        throw new Error(axiosError.response?.data?.message || 'Ошибка при регистрации')
      }
    },
    onSuccess: () => {
      navigate('/')
      notifications.show({
        title: 'Успешно',
        message: 'Регистрация выполнена успешно',
        color: 'green',
      })
    },
    onError: (error: Error) => {
      notifications.show({
        title: 'Ошибка',
        message: error.message,
        color: 'red',
      })
    },
  })

  const logoutMutation = useMutation({
    mutationFn: () => authApi.logout(),
    onSuccess: () => {
      navigate('/login')
      notifications.show({
        title: 'Успешно',
        message: 'Вы вышли из системы',
        color: 'green',
      })
    },
  })

  return {
    login: loginMutation.mutate,
    register: registerMutation.mutate,
    logout: logoutMutation.mutate,
    isLoginPending: loginMutation.isPending,
    isRegisterPending: registerMutation.isPending,
    loginError: loginMutation.error?.message,
    registerError: registerMutation.error?.message,
  }
} 