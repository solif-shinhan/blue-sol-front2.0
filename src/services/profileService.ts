import { apiClient } from '@/api'

// Request Types
export interface CreateProfileRequest {
  mainGoals: string[]
  solidGoalName: string
  userCharacter: string
  backgroundPattern: string
}

export interface UpdateProfileRequest {
  mainGoals?: string[]
  solidGoalName?: string
  userCharacter?: string
  backgroundPattern?: string
  interests?: string[]
}

// Response Types
export interface ProfileData {
  profileId: number
  userName: string
  mainGoals: string[]
  solidGoalName: string
  userCharacter: string
  backgroundPattern: string
  qrCodeUrl: string
  interests: string[]
}

export interface CreateProfileResponse {
  code: string
  message: string
  data: {
    profileId: number
    qrCodeUrl: string
  }
  success: boolean
}

export interface GetProfileResponse {
  code: string
  message: string
  data: ProfileData
  success: boolean
}

export interface UpdateProfileResponse {
  code: string
  message: string
  data: {
    profileId: number
  }
  success: boolean
}

export interface RegisterInterestsRequest {
  categoryNames: string[]
}

export interface RegisterInterestsResponse {
  code: string
  message: string
  data: {
    interests: string[]
  }
  success: boolean
}

// API Functions
export async function getProfile(): Promise<GetProfileResponse> {
  return apiClient.get<GetProfileResponse>('/api/profiles')
}

export async function createProfile(data: CreateProfileRequest): Promise<CreateProfileResponse> {
  const response = await apiClient.post<CreateProfileResponse>('/api/profiles', data)

  if (response.success && response.data.qrCodeUrl) {
    localStorage.setItem('qrCodeUrl', response.data.qrCodeUrl)
    localStorage.setItem('profileId', String(response.data.profileId))
  }

  return response
}

export async function updateProfile(data: UpdateProfileRequest): Promise<UpdateProfileResponse> {
  return apiClient.patch<UpdateProfileResponse>('/api/profiles', data)
}

export async function registerInterests(categoryNames: string[]): Promise<RegisterInterestsResponse> {
  return apiClient.post<RegisterInterestsResponse>('/api/interests', { categoryNames })
}
