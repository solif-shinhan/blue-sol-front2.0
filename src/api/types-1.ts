// API 기본 타입 + 인증 + 프로필 + 게시글 + 댓글 타입

export interface ApiResponse<T> {
  code: string;
  message: string;
  data: T;
  success: boolean;
}

export interface PageResponse<T> {
  content: T[];
  totalPages: number;
  totalElements: number;
  size: number;
  number: number;
}

export type UserRole = 'JUNIOR' | 'SENIOR' | 'GRADUATE' | 'MASTER';

export type PostCategory = 'STUDY' | 'ADMISSION' | 'JOB' | 'ETC' | 'NOTICE' | 'PROGRAM';

export type InteractionType = 'CHEER' | 'HELP';

export type NotificationCategory = 'NOTICE' | 'ACTIVITY';
export type NotificationSubCategory = 'MESSAGE' | 'NETWORK' | 'COUNCIL';
export type NotificationFilter = 'ALL' | 'UNREAD';

// ============ 인증 타입 ============

export interface SignupRequest {
  loginId: string;
  password: string;
  name: string;
  phone: string;
  email: string;
  scholarNumber?: string;
  userRole: UserRole;
  region?: string;
  schoolName?: string;
  job?: string;
}

export interface SignupResponse {
  userId: number;
  userRole: UserRole;
  createdAt: string;
}

export interface LoginRequest {
  loginId: string;
  password: string;
}

export interface LoginResponse {
  token: string;
  userId: number;
  userRole: UserRole;
}

// ============ 프로필 타입 ============

export interface Profile {
  profileId: number;
  userName: string;
  mainGoals: string[];
  solidGoalName: string;
  userCharacter: string;
  characterImageUrl: string;
  backgroundPattern: string;
  backgroundImageUrl: string;
  qrCodeUrl: string;
  interests: string[];
}

export interface ProfileCreateRequest {
  mainGoals: string[];
  solidGoalName: string;
  userCharacter: string;
  backgroundPattern: string;
}

export interface ProfileCreateResponse {
  profileId: number;
  qrCodeUrl: string;
}

export interface ProfileUpdateRequest {
  mainGoals?: string[];
  solidGoalName?: string;
  userCharacter?: string;
  backgroundPattern?: string;
  interests?: string[];
}

export interface ProfileUpdateResponse {
  profileId: number;
}

export interface InterestRequest {
  categoryNames: string[];
}

export interface InterestResponse {
  count: number;
  categoryNames: string[];
}

// ============ 게시글 타입 ============

export interface PostSummary {
  postId: number;
  boardId: number;
  postCategory: PostCategory;
  postTitle: string;
  postContentPreview: string;
  thumbnailImageUrl: string;
  councilName: string;
  authorName: string;
  viewCount: number;
  commentCount: number;
  createdAt: string;
}

export interface PostDetail {
  postId: number;
  boardId: number;
  postCategory: PostCategory;
  postTitle: string;
  postContent: string;
  authorId: number;
  authorName: string;
  viewCount: number;
  commentCount: number;
  likeCount: number;
  isLikedByUser: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface Post extends PostDetail {}

export interface PostCreateRequest {
  boardId: number;
  postCategory: PostCategory;
  postTitle: string;
  postContent: string;
  mentoringRequestId?: number;
}

export interface PostCreateResponse {
  postId: number;
  postTitle: string;
  createdAt: string;
}

export interface PostUpdateRequest {
  postTitle: string;
  postContent: string;
}

// ============ 댓글 타입 ============

export interface Comment {
  commentId: number;
  postId: number;
  authorName: string;
  authorId: number;
  commentContent: string;
  commentIsAnonymous: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface CommentCreateRequest {
  commentContent: string;
  commentIsAnonymous: boolean;
}

export interface CommentUpdateRequest {
  commentContent: string;
}
