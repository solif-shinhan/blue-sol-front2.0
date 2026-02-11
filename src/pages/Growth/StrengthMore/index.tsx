import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import styles from './StrengthMore.module.css'
import { BackHeader } from '@/components/BackHeader'
import { logout } from '@/services'
import { getYoutubeVideos, getYoutubeVideosByCategory } from '@/services/youtubeService'
import { YoutubeVideo } from '@/api/types-youtube'
import { decodeHtmlEntities } from '@/utils/htmlDecode'
import imgFooterLogo from '@/assets/images/057453724e8f804d5306e38ceabfcf7513cbed10.png'

const CATEGORIES = ['전체', '인성', '사회', '과학', '창업', '취업']

function StrengthMorePage() {
  const navigate = useNavigate()
  const [activeCategory, setActiveCategory] = useState('전체')
  const [videos, setVideos] = useState<YoutubeVideo[]>([])
  const [isLoading, setIsLoading] = useState(true)

  // 초기 데이터 로드
  useEffect(() => {
    loadVideos('전체')
  }, [])

  // 카테고리별 비디오 로드
  const loadVideos = async (category: string) => {
    setIsLoading(true)
    try {
      const data = category === '전체' 
        ? await getYoutubeVideos(50)  // 더보기 페이지는 더 많이 표시
        : await getYoutubeVideosByCategory(category, 50)
      setVideos(data)
    } catch (error) {
      console.error('Failed to load videos:', error)
    } finally {
      setIsLoading(false)
    }
  }

  const handleCategoryClick = (category: string) => {
    setActiveCategory(category)
    loadVideos(category)
  }

  const handleVideoClick = (videoUrl: string) => {
    window.open(videoUrl, '_blank')
  }

  const handleLogout = async () => {
    await logout()
    navigate('/login')
  }

  return (
    <div className={styles.container}>
      <BackHeader title="푸른 SOL 역량강화" showSearch />

      <div className={styles.content}>
        <div className={styles.categoryTabs}>
          {CATEGORIES.map(cat => (
            <button
              key={cat}
              className={`${styles.categoryTab} ${activeCategory === cat ? styles.categoryTabActive : ''}`}
              onClick={() => handleCategoryClick(cat)}
            >
              {cat}
            </button>
          ))}
        </div>

        <div className={styles.cardGrid}>
          {isLoading ? (
            <div style={{ padding: '40px', textAlign: 'center', color: '#666', gridColumn: '1 / -1' }}>
              동영상을 불러오는 중입니다...
            </div>
          ) : videos.length > 0 ? (
            videos.map((video) => (
              <div 
                key={video.videoId} 
                className={styles.card}
                onClick={() => handleVideoClick(video.videoUrl)}
                style={{ cursor: 'pointer' }}
              >
                <div className={styles.cardImageWrap}>
                  <img src={video.thumbnailUrl} alt={video.category} className={styles.cardImage} />
                </div>
                <div className={styles.cardDarkOverlay} />
                <div className={styles.cardBottom}>
                  <div className={styles.cardInfo}>
                    <div className={styles.cardTexts}>
                      <span className={styles.cardCategory}>{video.category}</span>
                      <div className={styles.cardTitle}>
                        {decodeHtmlEntities(video.title)}
                      </div>
                    </div>
                    <div className={styles.cardAuthor}>
                      <span>{decodeHtmlEntities(video.speaker)}</span>
                    </div>
                  </div>
                </div>
              </div>
            ))
          ) : (
            <div style={{ padding: '40px', textAlign: 'center', color: '#666', gridColumn: '1 / -1' }}>
              동영상이 없습니다.
            </div>
          )}
        </div>

        <div className={styles.footer}>
          <button type="button" className={styles.footerButton} onClick={handleLogout}>
            로그아웃
          </button>
          <button type="button" className={styles.footerButton}>
            <img src={imgFooterLogo} alt="신한장학재단" className={styles.footerLogo} />
          </button>
        </div>
      </div>
    </div>
  )
}

export default StrengthMorePage
