import { useMutation, useQueryClient } from '@tanstack/react-query'
import { timersApi } from '../services/api'

// interface Timer {
//   id: string
//   name: string
//   startTime: string
//   endTime: string | null
//   isPaused: boolean
//   pausedAt: string | null
//   totalPause: number
//   isPaid: boolean
// }

export function useTimers(projectId?: string) {
  const queryClient = useQueryClient()

  const createTimer = useMutation({
    mutationFn: (data: { name: string; projectId: string }) =>
      timersApi.create(data),
    onSuccess: () => {
      if (projectId) {
        queryClient.invalidateQueries({ queryKey: ['project', projectId] })
      }
    },
  })

  const deleteTimer = useMutation({
    mutationFn: timersApi.delete,
    onSuccess: () => {
      if (projectId) {
        queryClient.invalidateQueries({ queryKey: ['project', projectId] })
      }
    },
  })

  const pauseTimer = useMutation({
    mutationFn: timersApi.pause,
    onSuccess: () => {
      if (projectId) {
        queryClient.invalidateQueries({ queryKey: ['project', projectId] })
      }
    },
  })

  const resumeTimer = useMutation({
    mutationFn: timersApi.resume,
    onSuccess: () => {
      if (projectId) {
        queryClient.invalidateQueries({ queryKey: ['project', projectId] })
      }
    },
  })

  const stopTimer = useMutation({
    mutationFn: timersApi.stop,
    onSuccess: () => {
      if (projectId) {
        queryClient.invalidateQueries({ queryKey: ['project', projectId] })
      }
    },
  })

  const updateTimer = useMutation({
    mutationFn: (data: { id: string; isPaid?: boolean; isLogged?: boolean }) =>
      timersApi.update(data.id, data),
    onSuccess: () => {
      if (projectId) {
        queryClient.invalidateQueries({ queryKey: ['project', projectId] })
      }
    },
  })

  const markAllPaidMutation = useMutation({
    mutationFn: () => {
      if (!projectId) throw new Error('Project ID is required')
      return timersApi.markAllPaid(projectId)
    },
    onSuccess: () => {
      if (projectId) {
        queryClient.invalidateQueries({ queryKey: ['project', projectId] })
      }
    },
  })

  const calculateElapsedTime = (timer: any) => {
    if (!timer) return 0
    
    const now = new Date()
    const start = new Date(timer.startTime)
    const end = timer.endTime ? new Date(timer.endTime) : now
    
    let totalSeconds = Math.floor((end.getTime() - start.getTime()) / 1000)
    
    // Вычитаем время на паузе
    totalSeconds -= timer.totalPause || 0
    
    // Если таймер сейчас на паузе, вычитаем текущий период паузы
    if (timer.isPaused && timer.pausedAt) {
      const pauseStart = new Date(timer.pausedAt)
      const currentPause = Math.floor((now.getTime() - pauseStart.getTime()) / 1000)
      totalSeconds -= currentPause
    }
    
    return Math.max(0, totalSeconds)
  }

  return {
    createTimer: createTimer.mutateAsync,
    deleteTimer: deleteTimer.mutateAsync,
    pauseTimer: pauseTimer.mutateAsync,
    resumeTimer: resumeTimer.mutateAsync,
    stopTimer: stopTimer.mutateAsync,
    updateTimer: updateTimer.mutate,
    isCreating: createTimer.isPending,
    isDeleting: deleteTimer.isPending,
    isPausing: pauseTimer.isPending,
    isResuming: resumeTimer.isPending,
    isStopping: stopTimer.isPending,
    isUpdating: updateTimer.isPending,
    calculateElapsedTime,
    markAllPaid: markAllPaidMutation.mutateAsync,
    isMarkingAllPaid: markAllPaidMutation.isPending,
  }
} 