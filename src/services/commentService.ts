import { apiClient } from '@/api'

export interface Comment {
  commentId: number
  postId: number
  authorName: string
  authorId: number
  commentContent: string
  commentIsAnonymous: boolean
  createdAt: string
  updatedAt: string
}

export interface CreateCommentRequest {
  commentContent: string
  commentIsAnonymous: boolean
}

export interface UpdateCommentRequest {
  commentContent: string
}

export interface CommentListResponse {
  code: string
  message: string
  success: boolean
  data: Comment[]
}

export interface CommentResponse {
  code: string
  message: string
  success: boolean
  data: Comment
}

export interface DeleteCommentResponse {
  code: string
  message: string
  success: boolean
  data: string
}

export async function getComments(postId: number): Promise<CommentListResponse> {
  return apiClient.get<CommentListResponse>(`/api/v1/posts/${postId}/comments`)
}

export async function createComment(
  postId: number,
  data: CreateCommentRequest
): Promise<CommentResponse> {
  return apiClient.post<CommentResponse>(`/api/v1/posts/${postId}/comments`, data)
}

export async function updateComment(
  commentId: number,
  data: UpdateCommentRequest
): Promise<CommentResponse> {
  return apiClient.patch<CommentResponse>(`/api/v1/comments/${commentId}`, data)
}

export async function deleteComment(commentId: number): Promise<DeleteCommentResponse> {
  return apiClient.delete<DeleteCommentResponse>(`/api/v1/comments/${commentId}`)
}
