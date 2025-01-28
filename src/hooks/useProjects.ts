import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { projectsApi } from '../services/api'
import { notifications } from '@mantine/notifications'

interface CreateProjectData {
  name: string
  description?: string
  categoryId?: string
}

interface UpdateProjectData {
  id: string
  data: {
    name: string
    description?: string
    categoryId?: string
  }
}

export const useProjects = () => {
  const queryClient = useQueryClient()

  const { data: projects, isLoading: isLoadingProjects } = useQuery({
    queryKey: ['projects'],
    queryFn: async () => {
      const { data } = await projectsApi.getAll()
      return data
    },
  })

  const createMutation = useMutation({
    mutationFn: (data: CreateProjectData) => projectsApi.create(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['projects'] })
      notifications.show({
        title: 'Успешно',
        message: 'Проект создан',
        color: 'green',
      })
    },
  })

  const updateMutation = useMutation({
    mutationFn: ({ id, data }: UpdateProjectData) => projectsApi.update(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['projects'] })
      notifications.show({
        title: 'Успешно',
        message: 'Проект обновлен',
        color: 'green',
      })
    },
  })

  const deleteMutation = useMutation({
    mutationFn: (id: string) => projectsApi.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['projects'] })
      notifications.show({
        title: 'Успешно',
        message: 'Проект удален',
        color: 'green',
      })
    },
  })

  const formatTime = (seconds: number) => {
    const hours = Math.floor(seconds / 3600)
    const minutes = Math.floor((seconds % 3600) / 60)
    return `${hours}ч ${minutes}м`
  }

  return {
    projects,
    isLoadingProjects,
    createProject: createMutation.mutate,
    updateProject: updateMutation.mutate,
    deleteProject: deleteMutation.mutate,
    isCreating: createMutation.isPending,
    isUpdating: updateMutation.isPending,
    isDeleting: deleteMutation.isPending,
    formatTime,
  }
} 