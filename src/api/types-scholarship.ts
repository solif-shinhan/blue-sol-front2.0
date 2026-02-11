/**
 * 장학 프로그램 게시글 타입
 */
export interface ScholarshipProgram {
  postId: number
  title: string
  content: string
  viewCount: number
  commentCount: number
  createdAt: string
  thumbnailUrl: string | null
}

/**
 * 장학 프로그램 목록 응답 타입
 */
export interface ScholarshipProgramsResponse {
  data: {
    required: ScholarshipProgram[]
    optional: ScholarshipProgram[]
  }
  code: string
  message: string
  success: boolean
}
