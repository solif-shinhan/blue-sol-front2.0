/**
 * YouTube API 관련 타입 정의
 */

export interface YoutubeVideo {
  videoId: string
  title: string
  description: string
  thumbnailUrl: string
  channelTitle: string
  publishedAt: string  // LocalDateTime이 ISO 8601 string으로 직렬화됨
  videoUrl: string
  category: string
  speaker: string
}
