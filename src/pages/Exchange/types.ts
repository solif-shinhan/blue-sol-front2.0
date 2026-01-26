// 게시판 카테고리
export type BoardCategory = '활동후기' | '학업고민' | '취업/진로' | '자유게시판'

// 카테고리 색상 매핑
export const CATEGORY_COLORS: Record<BoardCategory, string> = {
  '활동후기': '#074ED8',
  '학업고민': '#7B61FF',
  '취업/진로': '#00A86B',
  '자유게시판': '#FF6B6B',
}

// 게시글 인터페이스
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

// 댓글 인터페이스
export interface Comment {
  id: number
  postId: number
  authorName: string
  authorAvatar?: string
  content: string
  createdAt: string
  likeCount: number
}

// 게시글 작성 폼 데이터
export interface PostFormData {
  category: BoardCategory | null
  title: string
  content: string
  images: File[]
}

// 카테고리 목록
export const CATEGORIES: BoardCategory[] = [
  '활동후기',
  '학업고민',
  '취업/진로',
  '자유게시판',
]
