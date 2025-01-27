import { useQuery } from '@tanstack/react-query'
import { timersApi } from '../services/api'

export type Period = 'week' | 'month' | 'year' | 'all'
export type PaidFilter = 'all' | 'paid' | 'unpaid'

interface Timer {
  id: string
  name: string
  time: number
  isPaid: boolean
  startTime: string
  endTime: string | null
}

interface ProjectStat {
  id: string
  name: string
  totalTime: number
  isPaid: boolean
  timers: Timer[]
}

interface Statistics {
  totalTime: number
  totalPaidTime: number
  totalUnpaidTime: number
  projectStats: ProjectStat[]
}

export const useStatistics = (period: Period, paidFilter: PaidFilter) => {
  const { data, isLoading } = useQuery<Statistics>({
    queryKey: ['statistics', period, paidFilter],
    queryFn: async () => {
      const { data } = await timersApi.getStatistics(period, paidFilter)
      return data
    },
  })

  const formatTime = (seconds: number) => {
    const hours = Math.floor(seconds / 3600)
    const minutes = Math.floor((seconds % 3600) / 60)
    return `${hours}ч ${minutes}м`
  }

  const formatDate = (date: string) => {
    return new Date(date).toLocaleString('ru-RU', {
      day: '2-digit',
      month: '2-digit',
      year: '2-digit',
      hour: '2-digit',
      minute: '2-digit',
    })
  }

  return {
    statistics: data,
    isLoading,
    formatTime,
    formatDate,
  }
} 