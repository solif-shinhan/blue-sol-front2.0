import { apiClient } from '@/api'

export type InteractionType = 'CHEER' | 'SHARE_EXPERIENCE'
export type ButtonType = 'CHEER' | 'SHARE_EXPERIENCE'

export interface NetworkFriend {
  userId: number
  userName: string
  character: string
  characterImageUrl?: string
  backgroundPattern: string
  backgroundImageUrl?: string
}

export interface NetworkCard {
  userId: number
  userName: string
  character: string
  characterImageUrl?: string
  backgroundPattern: string
  backgroundImageUrl?: string
  solidGoalName: string
  mainGoals: string[]
  interests: string[]
  buttonType: ButtonType
  isInCouncil: boolean
  councilName?: string
  schoolName?: string
  joinYear?: number
}

export interface NetworkListResponse {
  code: string
  message: string
  success: boolean
  data: {
    myRole: string
    totalCount: number
    addedFriends: NetworkFriend[]
    networkCards: NetworkCard[]
  }
}

export interface AddNetworkRequest {
  targetQrCode?: string
  targetUserId?: number
}

export interface AddNetworkResponse {
  code: string
  message: string
  success: boolean
  data: {
    connectionId: number
    targetUserId: number
    targetUserName: string
    createdAt: string
  }
}

export interface InteractionRequest {
  targetUserId: number
  interactionType: InteractionType
}

export interface InteractionResponse {
  code: string
  message: string
  success: boolean
  data: {
    notificationId: number
    targetUserId: number
    interactionType: string
    notificationContent: string
    createdAt: string
  }
}

export interface SearchUser {
  userId: number
  userName: string
  character: string
  characterImageUrl?: string
  backgroundPattern: string
  backgroundImageUrl?: string
  solidGoalName: string
  interests: string[]
  councilName?: string
  connected: boolean
  isConnected: boolean
  isInCouncil: boolean
}

export interface SearchResponse {
  code: string
  message: string
  success: boolean
  data: {
    keyword: string
    resultCount: number
    users: SearchUser[]
  }
}

export interface RecommendationUser {
  userId: number
  userName: string
  character: string
  characterImageUrl?: string
  backgroundPattern: string
  backgroundImageUrl?: string
  solidGoalName: string
  interests: string[]
  isInCouncil: boolean
  councilName?: string
}

export interface RecommendationsResponse {
  code: string
  message: string
  success: boolean
  data: {
    interestBased: {
      title: string
      users: RecommendationUser[]
    }
    allUsers: {
      title: string
      users: RecommendationUser[]
    }
  }
}

export async function getNetworkList(): Promise<NetworkListResponse> {
  return apiClient.get<NetworkListResponse>('/api/v1/networks')
}

export async function addToNetwork(data: AddNetworkRequest): Promise<AddNetworkResponse> {
  return apiClient.post<AddNetworkResponse>('/api/v1/networks', data)
}

export async function addNetworkByQrScan(qrData: string): Promise<AddNetworkResponse> {
  return apiClient.post<AddNetworkResponse>(`/api/v1/networks/qr-scan?qrData=${encodeURIComponent(qrData)}`)
}

export async function sendInteraction(data: InteractionRequest): Promise<InteractionResponse> {
  return apiClient.post<InteractionResponse>('/api/v1/networks/interactions', data)
}

export async function searchNetwork(keyword: string): Promise<SearchResponse> {
  return apiClient.get<SearchResponse>('/api/v1/networks/search', { keyword })
}

export async function getNetworkRecommendations(): Promise<RecommendationsResponse> {
  return apiClient.get<RecommendationsResponse>('/api/v1/networks/recommendations')
}

export interface UserSolidCardResponse {
  code: string
  message: string
  success: boolean
  data: {
    userId: number
    userName: string
    character: string
    characterImageUrl?: string
    backgroundPattern: string
    backgroundImageUrl?: string
    solidGoalName: string
    mainGoals: string[]
    interests: string[]
    isInCouncil: boolean
    councilName?: string
    schoolName?: string
    joinYear?: number
    isConnected: boolean
  }
}

export async function getUserSolidCard(userId: number): Promise<UserSolidCardResponse> {
  return apiClient.get<UserSolidCardResponse>(`/api/v1/networks/users/${userId}/card`)
}
