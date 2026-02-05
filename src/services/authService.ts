import {
  apiClient,
  type UserRole,
  type LoginRequest,
  type LoginResponse,
  type SignupRequest,
  type SignupResponse,
  type ApiResponse,
} from '@/api'

export type { UserRole, LoginRequest, LoginResponse, SignupRequest, SignupResponse }

export async function login(data: LoginRequest): Promise<ApiResponse<LoginResponse>> {
  const response = await apiClient.post<ApiResponse<LoginResponse>>('/api/auth/login', data)

  console.log('[authService] login response:', response)

  if (response.success && response.data?.token) {
    localStorage.setItem('accessToken', response.data.token)
    localStorage.setItem('userId', String(response.data.userId))
    localStorage.setItem('userRole', response.data.userRole)
    apiClient.setToken(response.data.token)
    console.log('[authService] token saved:', response.data.token.substring(0, 20) + '...')
  } else {
    console.warn('[authService] login failed or no token:', { success: response.success, hasData: !!response.data })
  }

  return response
}

export async function signup(data: SignupRequest): Promise<ApiResponse<SignupResponse>> {
  console.log('[authService] signup request:', { ...data, password: '***' })
  const response = await apiClient.post<ApiResponse<SignupResponse>>('/api/auth/signup', data)
  console.log('[authService] signup response:', response)
  return response
}

export async function logout(): Promise<void> {
  try {
    const token = localStorage.getItem('accessToken')
    if (token) {
      apiClient.setToken(token)
      await apiClient.post('/api/auth/logout')
    }
  } catch (error) {
    console.error('로그아웃 API 호출 실패:', error)
  } finally {
    localStorage.removeItem('accessToken')
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

export function restoreAuth(): boolean {
  const token = localStorage.getItem('accessToken')
  if (token) {
    apiClient.setToken(token)
    return true
  }
  return false
}

export function isAuthenticated(): boolean {
  return !!localStorage.getItem('accessToken')
}
