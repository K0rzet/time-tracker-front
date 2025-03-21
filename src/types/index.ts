export interface Timer {
  id: string
  name: string
  startTime: string
  endTime: string | null
  isPaused: boolean
  pausedAt: string | null
  totalPause: number
  isPaid: boolean
  project?: {
    name: string
  }
}

export interface Project {
  id: string
  name: string
  description?: string
  timers: Timer[]
}

export interface CreateProjectDto {
  name: string
  description?: string
}

export interface UpdateProjectDto {
  name?: string
  description?: string
}

export interface CreateTimerDto {
  name: string
  projectId: string
}

export interface UpdateTimerDto {
  name?: string
  description?: string
  startTime?: string
  isPaid?: boolean
  isLogged?: boolean
} 