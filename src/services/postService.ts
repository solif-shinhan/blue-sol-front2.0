import { apiClient } from '@/api'

export type PostCategory = 'STUDY' | 'ADMISSION' | 'JOB' | 'ETC' | 'NOTICE' | 'PROGRAM' | 'REQUIRED' | 'OPTIONAL'

// GET /api/v1/posts 목록 응답 아이템
export interface PostListItem {
  postId: number
  boardId: number
  postCategory: PostCategory
  postTitle: string
  postContentPreview: string
  thumbnailImageUrl: string | null
  councilName: string | null
  authorName: string
  viewCount: number
  commentCount: number
  createdAt: string
}

// GET /api/v1/posts/{postId} 상세 응답
export interface PostDetail {
  postId: number
  boardId: number
  postCategory: PostCategory
  postTitle: string
  postContent: string
  imageUrls: string[]
  authorId: number
  authorName: string
  viewCount: number
  commentCount: number
  likeCount: number
  isLikedByUser: boolean
  createdAt: string
  updatedAt: string
}

export interface CreatePostRequest {
  boardId: number
  postTitle: string
  postContent: string
  postCategory: PostCategory
  mentoringRequestId?: number
  fileIds?: number[]
}

export interface UpdatePostRequest {
  postTitle: string
  postContent: string
  fileIds?: number[] | null
}

export interface SliceResponse<T> {
  content: T[]
  first: boolean
  last: boolean
  empty: boolean
  number: number
  size: number
  numberOfElements: number
}

export interface PostListResponse {
  code: string
  message: string
  success: boolean
  data: SliceResponse<PostListItem>
}

export interface PostDetailResponse {
  code: string
  message: string
  success: boolean
  data: PostDetail
}

export interface PostCreateResponse {
  code: string
  message: string
  success: boolean
  data: {
    postId: number
    postTitle: string
    createdAt: string
  }
}

export const CATEGORY_MAP: Record<string, PostCategory> = {
  '활동후기': 'ETC',
  '학업고민': 'STUDY',
  '취업/진로': 'JOB',
  '자유게시판': 'ETC',
  '멘토링 후기': 'PROGRAM',
  '자치회 활동 후기': 'NOTICE',
}

export const BOARD_NAME_MAP: Record<number, string> = {
  1: '자치회 활동 후기',
  2: '멘토링 후기',
  3: '고민상담',
  4: '운영공지',
  5: '프로그램',
}

export const CATEGORY_REVERSE_MAP: Record<PostCategory, string> = {
  'STUDY': '학업고민',
  'ADMISSION': '진학고민',
  'JOB': '취업/진로',
  'ETC': '자유게시판',
  'NOTICE': '공지',
  'PROGRAM': '멘토링 후기',
  'REQUIRED': '필수',
  'OPTIONAL': '선택',
}

export async function getPosts(params: {
  boardId: number
  category?: PostCategory
  page?: number
  size?: number
}): Promise<PostListResponse> {
  const queryParams: Record<string, string> = {
    boardId: String(params.boardId),
  }

  if (params.category) {
    queryParams.category = params.category
  }
  if (params.page !== undefined) {
    queryParams.page = String(params.page)
  }
  if (params.size !== undefined) {
    queryParams.size = String(params.size)
  }

  return apiClient.get<PostListResponse>('/api/v1/posts', queryParams)
}

export async function getPostDetail(postId: number): Promise<PostDetailResponse> {
  return apiClient.get<PostDetailResponse>(`/api/v1/posts/${postId}`)
}

export async function createPost(data: CreatePostRequest): Promise<PostCreateResponse> {
  return apiClient.post<PostCreateResponse>('/api/v1/posts', data)
}

export async function updatePost(
  postId: number,
  data: UpdatePostRequest
): Promise<{ code: string; message: string; success: boolean }> {
  return apiClient.patch(`/api/v1/posts/${postId}`, data)
}

export async function deletePost(postId: number): Promise<{ code: string; message: string; success: boolean }> {
  return apiClient.delete(`/api/v1/posts/${postId}`)
}

export async function likePost(postId: number): Promise<{ code: string; message: string; success: boolean }> {
  return apiClient.post(`/api/v1/posts/${postId}/like`)
}

export async function unlikePost(postId: number): Promise<{ code: string; message: string; success: boolean }> {
  return apiClient.delete(`/api/v1/posts/${postId}/like`)
}
