import { apiClient } from '@/api'
import { YoutubeVideo } from '@/api/types-youtube'

/**
 * YouTube 동영상 캐시를 수동으로 갱신합니다.
 * POST /api/youtube/refresh
 * 
 * @returns 갱신 결과
 */
export const refreshYoutubeCache = async (): Promise<string> => {
  try {
    const response = await apiClient.post<string>('/api/youtube/refresh')
    return response
  } catch (error) {
    console.error('[youtubeService] Failed to refresh cache:', error)
    throw error
  }
}

/**
 * 최신 동영상 목록을 조회합니다.
 * GET /api/youtube/videos?maxResults=20
 * 
 * @param maxResults 최대 결과 개수 (기본값: 20)
 * @returns YouTube 동영상 목록
 */
export const getYoutubeVideos = async (maxResults: number = 20): Promise<YoutubeVideo[]> => {
  try {
    // 백엔드는 List<VideoDto>를 직접 반환
    const response = await apiClient.get<YoutubeVideo[]>(
      '/api/youtube/videos',
      { maxResults: String(maxResults) }
    )
    return response || []
  } catch (error) {
    console.error('[youtubeService] Failed to fetch videos:', error)
    return []
  }
}

/**
 * 카테고리별 동영상 목록을 조회합니다.
 * GET /api/youtube/videos/category?category={category}&maxResults=20
 * 
 * @param category 동영상 카테고리
 * @param maxResults 최대 결과 개수 (기본값: 20)
 * @returns 해당 카테고리의 YouTube 동영상 목록
 */
export const getYoutubeVideosByCategory = async (
  category: string,
  maxResults: number = 20
): Promise<YoutubeVideo[]> => {
  try {
    // 백엔드는 List<VideoDto>를 직접 반환
    const response = await apiClient.get<YoutubeVideo[]>(
      `/api/youtube/videos/category`,
      {
        category,
        maxResults: String(maxResults)
      }
    )
    return response || []
  } catch (error) {
    console.error(`[youtubeService] Failed to fetch videos by category '${category}':`, error)
    return []
  }
}
