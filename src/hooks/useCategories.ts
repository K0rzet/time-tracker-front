import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { notifications } from '@mantine/notifications'
import { categoriesApi } from '../services/api'

interface Category {
  id: string
  name: string
}

export function useCategories() {
  const queryClient = useQueryClient()

  const { data: categories, isLoading } = useQuery({
    queryKey: ['categories'],
    queryFn: async () => {
      const { data } = await categoriesApi.getAll()
      return data as Category[]
    },
  })

  const createCategory = useMutation({
    mutationFn: (data: { name: string }) => categoriesApi.create(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['categories'] })
      notifications.show({
        title: 'Успешно',
        message: 'Категория создана',
        color: 'green',
      })
    },
    onError: () => {
      notifications.show({
        title: 'Ошибка',
        message: 'Не удалось создать категорию',
        color: 'red',
      })
    },
  })

  const deleteCategory = useMutation({
    mutationFn: (id: string) => categoriesApi.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['categories'] })
      notifications.show({
        title: 'Успешно',
        message: 'Категория удалена',
        color: 'green',
      })
    },
    onError: () => {
      notifications.show({
        title: 'Ошибка',
        message: 'Не удалось удалить категорию',
        color: 'red',
      })
    },
  })

  return {
    categories,
    isLoading,
    createCategory: createCategory.mutate,
    isCreatingCategory: createCategory.isPending,
    deleteCategory: deleteCategory.mutate,
    isDeletingCategory: deleteCategory.isPending,
  }
} 