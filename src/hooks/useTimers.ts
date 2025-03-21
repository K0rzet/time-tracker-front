import { useMutation, useQueryClient } from '@tanstack/react-query'
import { timersApi } from '../services/api'
import { notifications } from '@mantine/notifications'

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
    mutationFn: (data: { id: string; name?: string; description?: string; elapsed?: number; isPaid?: boolean; isLogged?: boolean }) => {
      const { id, elapsed, description, ...updateData } = data
      
      // Если указано время, вычисляем новое значение startTime
      if (elapsed !== undefined) {
        // Получаем текущий таймер из кэша или запроса
        let timer;
        if (projectId) {
          const project = queryClient.getQueryData(['project', projectId]) as any
          timer = project?.timers?.find((t: any) => t.id === id)
        }
        
        if (timer) {
          // Если таймер остановлен
          if (timer.endTime) {
            const endTime = new Date(timer.endTime)
            // Вычисляем новое startTime на основе endTime и elapsed
            const newStartTime = new Date(endTime.getTime() - (elapsed * 1000) - (timer.totalPause * 1000))
            
            return timersApi.update(id, {
              ...updateData,
              startTime: newStartTime.toISOString()
            })
          } 
          // Если таймер активен
          else {
            const now = new Date()
            let totalPauseMs = timer.totalPause * 1000;
            
            // Если таймер на паузе, нужно учесть текущий период паузы
            if (timer.isPaused && timer.pausedAt) {
              const pauseStart = new Date(timer.pausedAt);
              const currentPauseMs = now.getTime() - pauseStart.getTime();
              totalPauseMs += currentPauseMs;
            }
            
            // Вычисляем новое startTime на основе текущего времени и elapsed
            const newStartTime = new Date(now.getTime() - (elapsed * 1000) - totalPauseMs)
            
            return timersApi.update(id, {
              ...updateData,
              startTime: newStartTime.toISOString()
            })
          }
        }
      }
      
      return timersApi.update(id, updateData)
    },
    onSuccess: () => {
      if (projectId) {
        queryClient.invalidateQueries({ queryKey: ['project', projectId] })
      }
      notifications.show({
        title: 'Успешно',
        message: 'Таймер обновлен',
        color: 'green',
      })
    },
    onError: (error) => {
      console.error('Ошибка при обновлении таймера:', error)
      notifications.show({
        title: 'Ошибка',
        message: 'Не удалось обновить таймер',
        color: 'red',
      })
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