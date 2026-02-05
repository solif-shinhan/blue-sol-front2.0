const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000/api'

interface RequestConfig extends RequestInit {
  params?: Record<string, string>
}

class ApiClient {
  private baseUrl: string
  private token: string | null = null

  constructor(baseUrl: string) {
    this.baseUrl = baseUrl
  }

  setToken(token: string | null) {
    this.token = token
  }

  private async request<T>(
    endpoint: string,
    config: RequestConfig = {}
  ): Promise<T> {
    const { params, ...requestConfig } = config

    let url = `${this.baseUrl}${endpoint}`
    if (params) {
      const searchParams = new URLSearchParams(params)
      url += `?${searchParams.toString()}`
    }

    const headers: Record<string, string> = {
      'Content-Type': 'application/json',
      ...(requestConfig.headers as Record<string, string>),
    }

    if (this.token) {
      headers['Authorization'] = `Bearer ${this.token}`
    }

    const response = await fetch(url, {
      ...requestConfig,
      headers,
    })

    if (!response.ok) {
      const errorText = await response.text()
      console.error('[apiClient] Error response:', {
        status: response.status,
        statusText: response.statusText,
        url: url,
        body: errorText
      })

      let error: Record<string, unknown> = {}
      try {
        error = JSON.parse(errorText)
      } catch {
        // JSON 파싱 실패 시 텍스트 그대로 사용
      }

      let errorMessage = (error.message as string) || `HTTP Error: ${response.status}`
      if (error.errors) {
        if (Array.isArray(error.errors)) {
          errorMessage += ': ' + error.errors.join(', ')
        } else if (typeof error.errors === 'object') {
          errorMessage += ': ' + Object.values(error.errors as Record<string, string>).join(', ')
        }
      }
      throw new Error(errorMessage)
    }

    const data = await response.json()

    // 백엔드 응답에 success 필드가 없는 경우 code로 판단
    if (data && typeof data === 'object' && 'code' in data && !('success' in data)) {
      data.success = data.code === 'SUCCESS' || data.code === '200' || data.code === 'OK'
    }

    return data
  }

  async get<T>(endpoint: string, params?: Record<string, string>): Promise<T> {
    return this.request<T>(endpoint, { method: 'GET', params })
  }

  async post<T>(endpoint: string, data?: unknown): Promise<T> {
    return this.request<T>(endpoint, {
      method: 'POST',
      body: data ? JSON.stringify(data) : undefined,
    })
  }

  async put<T>(endpoint: string, data?: unknown): Promise<T> {
    return this.request<T>(endpoint, {
      method: 'PUT',
      body: data ? JSON.stringify(data) : undefined,
    })
  }

  async patch<T>(endpoint: string, data?: unknown): Promise<T> {
    return this.request<T>(endpoint, {
      method: 'PATCH',
      body: data ? JSON.stringify(data) : undefined,
    })
  }

  async delete<T>(endpoint: string): Promise<T> {
    return this.request<T>(endpoint, { method: 'DELETE' })
  }
}

export const apiClient = new ApiClient(API_BASE_URL)
export default apiClient
