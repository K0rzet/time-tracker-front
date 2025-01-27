import { useQuery } from '@tanstack/react-query'
import { projectsApi } from '../services/api'

export const useProject = (projectId: string | undefined) => {
  const { data: project, isLoading } = useQuery({
    queryKey: ['project', projectId],
    queryFn: async () => {
      if (!projectId) return null
      const { data } = await projectsApi.getProjectWithTimers(projectId)
      return data
    },
    enabled: !!projectId,
  })

  return {
    data: project,
    isLoading,
  }
} 