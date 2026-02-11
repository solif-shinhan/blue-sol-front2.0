import { apiClient } from '@/api'
import { ScholarshipProgram, ScholarshipProgramsResponse } from '@/api/types-scholarship'

/**
 * 장학 프로그램 목록을 조회합니다.
 * GET /api/v1/scholarship-programs
 * 
 * @returns 장학 프로그램 목록 (필수 + 선택)
 */
export const getScholarshipPrograms = async (): Promise<ScholarshipProgram[]> => {
  try {
    const response = await apiClient.get<ScholarshipProgramsResponse>(
      '/api/v1/scholarship-programs'
    )
    
    // required와 optional을 합쳐서 반환 (required가 먼저 오도록)
    const allPrograms = [
      ...(response?.data?.required || []),
      ...(response?.data?.optional || [])
    ]
    
    return allPrograms
  } catch (error) {
    console.error('[scholarshipService] Failed to fetch scholarship programs:', error)
    return []
  }
}

/**
 * 필수 장학 프로그램 목록만 조회합니다.
 * 
 * @returns 필수 장학 프로그램 목록
 */
export const getRequiredPrograms = async (): Promise<ScholarshipProgram[]> => {
  try {
    const response = await apiClient.get<ScholarshipProgramsResponse>(
      '/api/v1/scholarship-programs'
    )
    
    return response?.data?.required || []
  } catch (error) {
    console.error('[scholarshipService] Failed to fetch required programs:', error)
    return []
  }
}

/**
 * 선택 장학 프로그램 목록만 조회합니다.
 * 
 * @returns 선택 장학 프로그램 목록
 */
export const getOptionalPrograms = async (): Promise<ScholarshipProgram[]> => {
  try {
    const response = await apiClient.get<ScholarshipProgramsResponse>(
      '/api/v1/scholarship-programs'
    )
    
    return response?.data?.optional || []
  } catch (error) {
    console.error('[scholarshipService] Failed to fetch optional programs:', error)
    return []
  }
}
