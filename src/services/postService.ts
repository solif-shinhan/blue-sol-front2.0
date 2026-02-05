import { apiClient } from '@/api'

export type PostCategory = 'STUDY' | 'ADMISSION' | 'JOB' | 'ETC' | 'NOTICE' | 'PROGRAM'

export interface PostItem {
  postId: number
  title: string
  content: string
  category: PostCategory
  authorId: number
  authorName: string
  authorProfileImageUrl: string
  likeCount: number
  commentCount: number
  viewCount: number
  isLiked: boolean
  createdAt: string
  updatedAt: string
  images?: string[]
}

export interface PostDetail extends PostItem {
  images: string[]
}

export interface CreatePostRequest {
  boardId: number
  title: string
  content: string
  category: PostCategory
}

export interface UpdatePostRequest {
  title?: string
  content?: string
  category?: PostCategory
}

export interface PageResponse<T> {
  content: T[]
  totalPages: number
  totalElements: number
  size: number
  number: number
  first: boolean
  last: boolean
  empty: boolean
}

export interface PostListResponse {
  code: string
  message: string
  success: boolean
  data: PageResponse<PostItem>
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
  data: PostItem
}

export interface PostLikeResponse {
  code: string
  message: string
  success: boolean
  data: {
    postId: number
    likeCount: number
    isLiked: boolean
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

export const CATEGORY_REVERSE_MAP: Record<PostCategory, string> = {
  'STUDY': '학업고민',
  'ADMISSION': '학업고민',
  'JOB': '취업/진로',
  'ETC': '자유게시판',
  'NOTICE': '자치회 활동 후기',
  'PROGRAM': '멘토링 후기',
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
): Promise<PostDetailResponse> {
  return apiClient.patch<PostDetailResponse>(`/api/v1/posts/${postId}`, data)
}

export async function deletePost(postId: number): Promise<{ code: string; message: string; success: boolean }> {
  return apiClient.delete(`/api/v1/posts/${postId}`)
}

export async function likePost(postId: number): Promise<PostLikeResponse> {
  return apiClient.post<PostLikeResponse>(`/api/v1/posts/${postId}/like`)
}

export async function unlikePost(postId: number): Promise<PostLikeResponse> {
  return apiClient.delete<PostLikeResponse>(`/api/v1/posts/${postId}/like`)
}
