export interface Project {
  id: string
  name: string
  description?: string
  categoryId?: string
  category?: {
    id: string
    name: string
  }
  totalTime: number
  isPaid: boolean
} 