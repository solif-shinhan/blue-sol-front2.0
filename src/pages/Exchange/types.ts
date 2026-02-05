export type BoardCategory = '활동후기' | '학업고민' | '취업/진로' | '자유게시판'

export const CATEGORY_COLORS: Record<BoardCategory, string> = {
  '활동후기': '#074ED8',
  '학업고민': '#7B61FF',
  '취업/진로': '#00A86B',
  '자유게시판': '#FF6B6B',
}

export interface Post {
  id: number
  category: BoardCategory
  title: string
  content: string
  authorName: string
  authorAvatar?: string
  createdAt: string
  viewCount: number
  likeCount: number
  commentCount: number
  images?: string[]
}

export interface Comment {
  id: number
  postId: number
  authorName: string
  authorAvatar?: string
  content: string
  createdAt: string
  likeCount: number
}

export interface PostFormData {
  category: BoardCategory | null
  title: string
  content: string
  images: File[]
}

export const CATEGORIES: BoardCategory[] = [
  '활동후기',
  '학업고민',
  '취업/진로',
  '자유게시판',
]
