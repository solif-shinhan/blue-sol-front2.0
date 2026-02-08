import { apiClient } from '@/api'

export type NotificationCategory = 'NOTICE' | 'ACTIVITY'
export type NotificationSubCategory = 'MESSAGE' | 'NETWORK' | 'COUNCIL'
export type NotificationFilter = 'ALL' | 'UNREAD'
export type NotificationType = 'NOTICE' | 'MESSAGE' | 'NETWORK' | 'COUNCIL'

export interface NotificationItem {
  notificationId: number
  notificationType: NotificationType
  notificationTitle: string
  notificationContent: string
  targetType: string
  targetId: number
  isRead: boolean
  createdAt: string
  senderName?: string
  senderProfileImage?: string
}

export interface NotificationDetail {
  notificationId: number
  notificationTitle: string
  notificationContent: string
  notificationType: NotificationType
  createdAt: string
  images: {
    imageId: number
    imageUrl: string
  }[]
  targetType: string
  targetId: number
  senderName?: string
  senderProfileImage?: string
}

export interface PageableInfo {
  paged: boolean
  pageNumber: number
  pageSize: number
  offset: number
  sort: {
    sorted: boolean
    empty: boolean
    unsorted: boolean
  }
  unpaged: boolean
}

export interface NotificationListResponse {
  code: string
  message: string
  success: boolean
  data: {
    pageable: PageableInfo
    first: boolean
    size: number
    content: NotificationItem[]
    number: number
    sort: {
      sorted: boolean
      empty: boolean
      unsorted: boolean
    }
    numberOfElements: number
    last: boolean
    empty: boolean
  }
}

export interface NotificationDetailResponse {
  code: string
  message: string
  success: boolean
  data: NotificationDetail
}

export interface MarkAsReadResponse {
  code: string
  message: string
  success: boolean
  data: {
    notificationId: number
    readAt: string
  }
}

export interface UnreadCountResponse {
  code: string
  message: string
  success: boolean
  data: {
    unreadCount: number
  }
}

export async function getNotifications(params: {
  category: NotificationCategory
  subCategory?: NotificationSubCategory
  filter?: NotificationFilter
  page?: number
  size?: number
}): Promise<NotificationListResponse> {
  const queryParams: Record<string, string> = {
    category: params.category,
  }

  if (params.subCategory) {
    queryParams.subCategory = params.subCategory
  }
  if (params.filter) {
    queryParams.filter = params.filter
  }
  if (params.page !== undefined) {
    queryParams.page = String(params.page)
  }
  if (params.size !== undefined) {
    queryParams.size = String(params.size)
  }

  return apiClient.get<NotificationListResponse>('/api/v1/notifications', queryParams)
}

export async function getNotificationDetail(notificationId: number): Promise<NotificationDetailResponse> {
  return apiClient.get<NotificationDetailResponse>(`/api/v1/notifications/${notificationId}`)
}

export async function markNotificationAsRead(notificationId: number): Promise<MarkAsReadResponse> {
  return apiClient.patch<MarkAsReadResponse>(`/api/v1/notifications/${notificationId}/read`)
}

export async function getUnreadCount(): Promise<UnreadCountResponse> {
  return apiClient.get<UnreadCountResponse>('/api/v1/notifications/unread-count')
}

export function getNotificationSubscribeUrl(): string {
  const baseUrl = import.meta.env.VITE_API_URL || 'http://localhost:3001'
  const token = localStorage.getItem('token')
  return `${baseUrl}/api/v1/notifications/subscribe${token ? `?token=${token}` : ''}`
}
