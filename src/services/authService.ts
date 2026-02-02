import { apiClient } from '@/api'

// 회원 유형
export type UserRole = 'JUNIOR' | 'SENIOR' | 'GRADUATE' | 'MASTER'

// 로그인 요청
export interface LoginRequest {
  loginId: string
  password: string
}

// 로그인 응답
export interface LoginResponse {
  code: string
  message: string
  data: {
    token: string
    userId: number
    userRole: UserRole
  }
  success: boolean
}

// 회원가입 요청
export interface SignupRequest {
  loginId: string
  password: string
  name: string
  phone: string
  email: string
  scholarNumber: string
  userRole: UserRole
  region?: string
  schoolName?: string
}

// 회원가입 응답
export interface SignupResponse {
  code: string
  message: string
  data: {
    userId: number
    userRole: UserRole
    createdAt: string
  }
  success: boolean
}

// 로그인 API
export async function login(data: LoginRequest): Promise<LoginResponse> {
  const response = await apiClient.post<LoginResponse>('/api/auth/login', data)

  // 토큰 저장 및 API 클라이언트에 설정
  if (response.success && response.data.token) {
    localStorage.setItem('token', response.data.token)
    localStorage.setItem('userId', String(response.data.userId))
    localStorage.setItem('userRole', response.data.userRole)
    apiClient.setToken(response.data.token)
  }

  return response
}

// 회원가입 API
export async function signup(data: SignupRequest): Promise<SignupResponse> {
  return apiClient.post<SignupResponse>('/api/auth/signup', data)
}

// 로그아웃
export async function logout(): Promise<void> {
  try {
    // 토큰 설정 후 API 호출
    const token = localStorage.getItem('token')
    if (token) {
      apiClient.setToken(token)
      await apiClient.post('/api/auth/logout')
    }
  } catch (error) {
    console.error('로그아웃 API 호출 실패:', error)
  } finally {
    // API 성공/실패와 관계없이 로컬 데이터 정리
    localStorage.removeItem('token')
    localStorage.removeItem('userId')
    localStorage.removeItem('userRole')
    localStorage.removeItem('userName')
    localStorage.removeItem('userInterests')
    localStorage.removeItem('userGoals')
    localStorage.removeItem('completedGoals')
    localStorage.removeItem('userSnsId')
    localStorage.removeItem('userSocialLink')
    localStorage.removeItem('userPattern')
    localStorage.removeItem('userCharacter')
    apiClient.setToken(null)
  }
}

// 저장된 토큰으로 인증 상태 복원
export function restoreAuth(): boolean {
  const token = localStorage.getItem('token')
  if (token) {
    apiClient.setToken(token)
    return true
  }
  return false
}

// 현재 로그인 상태 확인
export function isAuthenticated(): boolean {
  return !!localStorage.getItem('token')
}
