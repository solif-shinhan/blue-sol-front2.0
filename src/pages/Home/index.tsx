import { useState, useRef, useEffect, useCallback } from 'react'
import { useNavigate } from 'react-router-dom'
import styles1 from './Home-1.module.css'
import styles2 from './Home-2.module.css'
import styles3 from './Home-3.module.css'
import styles4 from './Home-4.module.css'
import bellIcon from '@/assets/images/bell.svg'
import { SolidCardModal } from './components/SolidCardModal'
import { QRCodeModal } from './components/QRCodeModal'
import { LECTURE_ITEMS, QUICK_MENU_ITEMS, NEWS_ITEMS } from './Home.constants'
import { getProfile, ProfileData } from '@/services/profileService'
import { getNotifications, NotificationItem } from '@/services/notificationService'
import { goalApi } from '@/api/api-2'
import { logout } from '@/services/authService'

const styles = { ...styles1, ...styles2, ...styles3, ...styles4 }

// UserRole을 한글 배지로 변환
const getRoleBadge = (userRole?: string): string => {
  switch (userRole) {
    case 'JUNIOR': return '솔방울'
    case 'SENIOR': return '솔잎'
    case 'GRADUATE': return '푸른솔'
    case 'MASTER': return '솔마스터'
    default: return '솔방울'
  }
}

function HomePage() {
  const navigate = useNavigate()
  const [currentSlide, setCurrentSlide] = useState(0)
  const [isCardModalOpen, setIsCardModalOpen] = useState(false)
  const [isQRModalOpen, setIsQRModalOpen] = useState(false)
  const [profile, setProfile] = useState<ProfileData | null>(null)
  const [goalCount, setGoalCount] = useState({ current: 0, total: 10 })
  const [newsItems, setNewsItems] = useState<NotificationItem[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const sliderRef = useRef<HTMLDivElement>(null)
  const isDragging = useRef(false)
  const startX = useRef(0)
  const scrollLeft = useRef(0)

  // 데이터 로드
  useEffect(() => {
    const loadData = async () => {
      setIsLoading(true)
      try {
        // 프로필 조회
        const profileRes = await getProfile()
        if (profileRes.success) {
          setProfile(profileRes.data)
        }

        // 목표 개수 조회
        try {
          const goalRes = await goalApi.getCount()
          if (goalRes.success) {
            setGoalCount({ current: goalRes.data.goalCount, total: 10 })
          }
        } catch {
          // 목표 API 실패 시 localStorage fallback
          const savedGoals = localStorage.getItem('userGoals')
          const completedGoals = localStorage.getItem('completedGoals')
          if (savedGoals) {
            const goals = JSON.parse(savedGoals)
            const completed = completedGoals ? JSON.parse(completedGoals).length : 0
            setGoalCount({ current: completed, total: goals.length || 10 })
          }
        }

        // 새로운 소식 (알림) 조회
        try {
          const notifRes = await getNotifications({ category: 'ACTIVITY', size: 3 })
          if (notifRes.success && notifRes.data.content) {
            setNewsItems(notifRes.data.content)
          }
        } catch {
          // 알림 API 실패 시 빈 배열 유지
        }
      } catch (error) {
        console.error('데이터 로드 실패:', error)
      } finally {
        setIsLoading(false)
      }
    }

    loadData()
  }, [])

  const handleTabClick = (tab: string) => {
    if (tab === '교류') navigate('/exchange')
    else if (tab === '성장') navigate('/growth')
  }

  const handleCardClick = () => setIsCardModalOpen(true)
  const handleCardModalClose = () => setIsCardModalOpen(false)
  const handleShare = () => setIsQRModalOpen(true)
  const handleQRModalClose = () => setIsQRModalOpen(false)
  const handleEdit = () => navigate('/onboarding')
  const handleNetwork = () => navigate('/exchange/network')
  const handleBellClick = () => navigate('/notifications')
  const handleLogout = async () => {
    await logout()
    navigate('/login')
  }

  const handleQuickMenuClick = (label: string) => {
    switch (label) {
      case '쪽지함': navigate('/notifications?tab=activity&sub=message'); break
      case '게시판': navigate('/exchange/board'); break
      case '교류망': navigate('/exchange/network'); break
      case '자치회': navigate('/exchange/council'); break
      case '멘토링': navigate('/mentoring'); break
    }
  }

  const getSlideWidth = useCallback(() => sliderRef.current?.offsetWidth || 360, [])

  const goToSlide = useCallback((index: number) => {
    const itemCount = newsItems.length || 1
    let targetIndex = index
    if (index < 0) targetIndex = itemCount - 1
    else if (index >= itemCount) targetIndex = 0
    setCurrentSlide(targetIndex)
    sliderRef.current?.scrollTo({ left: targetIndex * getSlideWidth(), behavior: 'smooth' })
  }, [getSlideWidth, newsItems.length])

  const handleDragStart = (e: React.MouseEvent | React.TouchEvent) => {
    isDragging.current = true
    startX.current = 'touches' in e ? e.touches[0].pageX : e.pageX
    scrollLeft.current = sliderRef.current?.scrollLeft || 0
  }

  const handleDragMove = (e: React.MouseEvent | React.TouchEvent) => {
    if (!isDragging.current || !sliderRef.current) return
    e.preventDefault()
    const x = 'touches' in e ? e.touches[0].pageX : e.pageX
    sliderRef.current.scrollLeft = scrollLeft.current + (startX.current - x) * 1.5
  }

  const handleDragEnd = () => {
    if (!isDragging.current || !sliderRef.current) return
    isDragging.current = false
    const diff = sliderRef.current.scrollLeft - scrollLeft.current
    if (Math.abs(diff) > getSlideWidth() * 0.2) goToSlide(currentSlide + (diff > 0 ? 1 : -1))
    else goToSlide(currentSlide)
  }

  useEffect(() => {
    const slider = sliderRef.current
    if (!slider) return
    const handleScroll = () => {
      if (isDragging.current) return
      const newSlide = Math.round(slider.scrollLeft / getSlideWidth())
      const itemCount = newsItems.length || 1
      if (newSlide !== currentSlide && newSlide >= 0 && newSlide < itemCount) setCurrentSlide(newSlide)
    }
    slider.addEventListener('scroll', handleScroll)
    return () => slider.removeEventListener('scroll', handleScroll)
  }, [currentSlide, getSlideWidth, newsItems.length])

  return (
    <div className={styles.container}>
      <nav className={styles.tabNav}>
        <div className={styles.tabs}>
          <button className={`${styles.tab} ${styles.tabActive}`}>홈</button>
          <button className={styles.tab} onClick={() => handleTabClick('교류')}>교류</button>
          <button className={styles.tab} onClick={() => handleTabClick('성장')}>성장</button>
        </div>
        <div className={styles.tabNavRight}>
          <button className={styles.iconButton} onClick={handleBellClick}>
            <img src={bellIcon} alt="알림" width={28} height={28} />
          </button>
          <div className={styles.profileCircle} onClick={() => navigate('/mypage')}></div>
        </div>
      </nav>

      <div className={styles.content}>
        <div className={styles.heroSection}>
          <header className={styles.header}>
            <p className={styles.headerSubtitle}>
              <span className={styles.solText}>SOL</span>
              <span className={styles.ifText}>IF</span>
              <span>, 너의 꿈을 응원해</span>
            </p>
            <h1 className={styles.headerTitle}>
              {isLoading ? '로딩 중...' : (profile?.solidGoalName || '목표를 설정해주세요')}
            </h1>
          </header>

          <div className={styles.goalBadge}>
            <span className={styles.goalLabel}>나의 목표</span>
            <div className={styles.goalCount}>
              <span className={styles.goalCurrent}>{String(goalCount.current).padStart(2, '0')}</span>
              <span className={styles.goalDivider}>/</span>
              <span className={styles.goalTotal}>{String(goalCount.total).padStart(2, '0')}</span>
            </div>
          </div>
        </div>

        <div className={styles.solidCard} onClick={handleCardClick} style={{ cursor: 'pointer' }}>
          <div className={styles.solidLogo}>
            <span className={styles.solidLogoSol}>SOL</span>
            <span className={styles.solidLogoId}>ID</span>
          </div>
          <div className={styles.profileSection}>
            <span className={styles.profileName}>{profile?.userName || '사용자'}</span>
            <span className={styles.profileBadge}>{getRoleBadge(localStorage.getItem('userRole') || undefined)}</span>
            <span className={styles.profileTag}>{profile?.solidGoalName || ''}</span>
          </div>
          <div className={styles.goalList}>
            {profile?.mainGoals?.slice(0, 3).map((goal, index) => (
              <p key={index} className={styles[`goalItem${index + 1}` as keyof typeof styles]}>{goal}</p>
            )) || (
              <>
                <p className={styles.goalItem1}>목표를 설정해주세요</p>
              </>
            )}
          </div>
          <div className={styles.interestTags}>
            {profile?.interests?.slice(0, 2).map((interest, index) => (
              <div key={index} className={styles.interestTag}>
                <div className={styles.tagIcon}></div>
                <span>{interest}</span>
              </div>
            )) || null}
          </div>
        </div>

        <div className={styles.bottomSection}>
          <div className={styles.bottomContent}>
            <div className={styles.quickMenu}>
              {QUICK_MENU_ITEMS.map(item => (
                <div key={item.id} className={styles.quickMenuItem} onClick={() => handleQuickMenuClick(item.label)}>
                  <div className={styles.quickMenuIcon}></div>
                  <span>{item.label}</span>
                </div>
              ))}
            </div>

            <section className={styles.newsSection}>
              <h2 className={styles.sectionTitle}>새로운 소식</h2>
              <div className={styles.newsSlider} ref={sliderRef}
                onMouseDown={handleDragStart} onMouseMove={handleDragMove}
                onMouseUp={handleDragEnd} onMouseLeave={handleDragEnd}
                onTouchStart={handleDragStart} onTouchMove={handleDragMove} onTouchEnd={handleDragEnd}>
                <div className={styles.newsSliderTrack}>
                  {NEWS_ITEMS.map(item => (
                    <div key={item.id} className={styles.newsCard}>
                      <div className={styles.newsCardContent}>
                        <h3>{item.title}</h3>
                        <p>{item.subtitle}</p>
                      </div>
                      <div className={styles.newsCardIcon}></div>
                    </div>
                  ))}
                </div>
              </div>
              <div className={styles.sliderDots}>
                {NEWS_ITEMS.map((_, i) => (
                  <span key={i} className={`${styles.dot} ${currentSlide === i ? styles.dotActive : ''}`}
                    onClick={() => goToSlide(i)}></span>
                ))}
              </div>
            </section>

            <section className={styles.growthSection}>
              <div className={styles.sectionHeader}>
                <h2 className={styles.sectionTitle}>푸른 SOL 역량강화</h2>
                <button className={styles.moreButton}>더보기</button>
              </div>
              <div className={styles.categoryTabs}>
                <button className={`${styles.categoryTab} ${styles.categoryTabActive}`}>사회</button>
                <button className={styles.categoryTab}>인성</button>
                <button className={styles.categoryTab}>과학</button>
                <button className={styles.categoryTab}>취업</button>
              </div>
              <div className={styles.lectureGrid}>
                {LECTURE_ITEMS.map(lecture => (
                  <div key={lecture.id} className={styles.lectureCard}>
                    <div className={styles.lectureThumbnail}></div>
                    <div className={styles.lectureInfo}>
                      <div className={styles.lectureTextGroup}>
                        <span className={styles.lectureCategory}>사회</span>
                        <h4 className={styles.lectureTitle}>{lecture.title.split('\n').map((line, i) => <span key={i}>{line}{i === 0 && lecture.title.includes('\n') && <br />}</span>)}</h4>
                      </div>
                      <span className={styles.lectureSpeaker}>{lecture.speaker}</span>
                    </div>
                  </div>
                ))}
              </div>
            </section>

            <footer className={styles.footer}>
              <button className={styles.logoutButton} onClick={handleLogout}>로그아웃</button>
              <div className={styles.footerLogo}>신한장학재단</div>
            </footer>
          </div>
        </div>
      </div>

      <SolidCardModal isOpen={isCardModalOpen} onClose={handleCardModalClose}
        onShare={handleShare} onEdit={handleEdit} onNetwork={handleNetwork} />
      <QRCodeModal isOpen={isQRModalOpen} onClose={handleQRModalClose} userName="김솔잎" />
    </div>
  )
}

export default HomePage
