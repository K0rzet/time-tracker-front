export interface Timer {
  id: string
  name: string
  startTime: string
  endTime: string | null
  isPaused: boolean
  pausedAt: string | null
  totalPause: number
  isPaid: boolean
  isLogged: boolean
  projectId: string
  userId: string
} 
