export * from './navigation'

export interface User {
  id: string
  email: string
  name: string
  nickname?: string
  profileImage?: string
  createdAt: string
}

export interface Solid {
  id: string
  userId: string
  bio?: string
  interests: string[]
  skills: string[]
  goals: string[]
  isPublic: boolean
}

export interface ApiResponse<T> {
  success: boolean
  data: T
  message?: string
}

export interface PaginatedResponse<T> {
  success: boolean
  data: T[]
  pagination: {
    page: number
    limit: number
    total: number
    totalPages: number
  }
}
