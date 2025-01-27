export interface Timer {
  id: string
  name: string
  startTime: string
  endTime: string | null
  isPaused: boolean
  isPaid: boolean
  projectId: string
  userId: string
  pausedAt: string | null
  totalPause: number
} 