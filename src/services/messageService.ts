import { apiClient } from '@/api'

export interface MessageListItem {
  messageId: number
  senderUserId: number
  senderName: string
  senderProfileImage?: string
  receiverUserId: number
  receiverName: string
  receiverProfileImage?: string
  messageTitle: string
  messageContent: string
  isRead: boolean
  createdAt: string
}

export interface MessageListResponse {
  code: string
  message: string
  success: boolean
  data: {
    content: MessageListItem[]
    pageable: {
      paged: boolean
      pageNumber: number
      pageSize: number
    }
    first: boolean
    last: boolean
    size: number
    number: number
    numberOfElements: number
    empty: boolean
  }
}

export interface MessageDetailResponse {
  code: string
  message: string
  success: boolean
  data: {
    messageId: number
    senderUserId: number
    senderName: string
    senderProfileImage?: string
    receiverUserId: number
    receiverName: string
    receiverProfileImage?: string
    messageTitle: string
    messageContent: string
    isRead: boolean
    createdAt: string
    images?: { imageId: number; imageUrl: string }[]
  }
}

export interface SendMessageRequest {
  receiverId: number
  messageTitle: string
  messageContent: string
  fileIds?: number[]
}

export interface SendMessageResponse {
  code: string
  message: string
  success: boolean
  data: {
    messageId: number
    createdAt: string
  }
}

export interface DeleteMessageResponse {
  code: string
  message: string
  success: boolean
  data: null
}

export async function getReceivedMessages(params?: {
  page?: number
  size?: number
}): Promise<MessageListResponse> {
  const queryParams: Record<string, string> = {}
  if (params?.page !== undefined) queryParams.page = String(params.page)
  if (params?.size !== undefined) queryParams.size = String(params.size)
  return apiClient.get<MessageListResponse>('/api/v1/messages/received', queryParams)
}

export async function getSentMessages(params?: {
  page?: number
  size?: number
}): Promise<MessageListResponse> {
  const queryParams: Record<string, string> = {}
  if (params?.page !== undefined) queryParams.page = String(params.page)
  if (params?.size !== undefined) queryParams.size = String(params.size)
  return apiClient.get<MessageListResponse>('/api/v1/messages/sent', queryParams)
}

export async function getMessageDetail(messageId: number): Promise<MessageDetailResponse> {
  return apiClient.get<MessageDetailResponse>(`/api/v1/messages/${messageId}`)
}

export async function sendMessage(data: SendMessageRequest): Promise<SendMessageResponse> {
  return apiClient.post<SendMessageResponse>('/api/v1/messages', data)
}

export async function deleteMessage(messageId: number): Promise<DeleteMessageResponse> {
  return apiClient.delete<DeleteMessageResponse>(`/api/v1/messages/${messageId}`)
}
