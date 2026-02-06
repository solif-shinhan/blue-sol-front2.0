import { useState, useRef, useEffect, useCallback, useMemo } from 'react'
import { useNavigate } from 'react-router-dom'
import styles1 from './Home-1.module.css'
import styles2 from './Home-2.module.css'
import styles3 from './Home-3.module.css'
import styles4 from './Home-4.module.css'
import bellIcon from '@/assets/images/bell.svg'
import imgFooterLogo from '@/assets/images/057453724e8f804d5306e38ceabfcf7513cbed10.png'
import { SolidCardModal } from './components/SolidCardModal'
import { QRCodeModal } from './components/QRCodeModal'
import { LECTURE_ITEMS, QUICK_MENU_ITEMS, NEWS_ITEMS } from './Home.constants'
import { getProfile, ProfileData } from '@/services/profileService'
import { getNotifications, NotificationItem } from '@/services/notificationService'
import { logout } from '@/services/authService'
import { userApi } from '@/api'
import { SolidCardPreview } from '@/features/02-onboarding/components/SolidCardPreview-1'
import { Character, BackgroundColor, Interest, DARK_PATTERNS } from '@/features/02-onboarding/types/card-1'
import { mockInterests } from '@/features/02-onboarding/api/mock-card-1'

const styles = { ...styles1, ...styles2, ...styles3, ...styles4 }

// 프로필 interests(이름 배열)를 Interest 객체 배열로 변환
const getInterestsWithIcons = (interestNames: string[]): Interest[] => {
  return interestNames.map((name, idx) => {
    const found = mockInterests.find(i => i.name === name)
    return found || { id: `interest-${idx}`, name, icon: undefined }
  })
}

// 프로필 데이터를 카드 props로 변환
const buildCardProps = (profile: ProfileData) => {
  const character: Character | null = profile.characterImageUrl
    ? { id: profile.userCharacter, name: '캐릭터', imageUrl: profile.characterImageUrl }
    : null

  const backgroundColor: BackgroundColor | null = profile.backgroundImageUrl
    ? {
        id: profile.backgroundPattern,
        name: '배경',
        imageUrl: profile.backgroundImageUrl,
        theme: DARK_PATTERNS.has(profile.backgroundPattern) ? 'dark' as const : 'light' as const,
      }
    : null

  const interests = getInterestsWithIcons(profile.interests || [])

  return { character, backgroundColor, interests }
}

function HomePage() {
  const navigate = useNavigate()
  const [currentSlide, setCurrentSlide] = useState(0)
  const [isCardModalOpen, setIsCardModalOpen] = useState(false)
  const [isQRModalOpen, setIsQRModalOpen] = useState(false)
  const [profile, setProfile] = useState<ProfileData | null>(null)
  const [region, setRegion] = useState('')
  const [school, setSchool] = useState('')
  const [newsItems, setNewsItems] = useState<NotificationItem[]>([])
  const [, setIsLoading] = useState(true)
  const sliderRef = useRef<HTMLDivElement>(null)
  const isDragging = useRef(false)
  const startX = useRef(0)
  const scrollLeft = useRef(0)

  // 데이터 로드
  useEffect(() => {
    const loadData = async () => {
      setIsLoading(true)
      try {
        // 프로필 + 유저 정보 조회 (각각 실패해도 다른 요청에 영향 없도록)
        const [profileRes, userRes] = await Promise.all([
          getProfile().catch(() => null),
          userApi.getMe().catch(() => null),
        ])
        if (profileRes && profileRes.success) {
          setProfile(profileRes.data)
        }
        // region/school: API 우선, localStorage fallback
        if (userRes && userRes.success && userRes.data) {
          setRegion(userRes.data.region || '')
          setSchool(userRes.data.schoolName || '')
        } else {
          const rd = localStorage.getItem('registerData')
          if (rd) {
            const parsed = JSON.parse(rd)
            setRegion(parsed.region || '')
            setSchool(parsed.schoolName || '')
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

  const cardProps = useMemo(() => {
    if (!profile) return null
    return buildCardProps(profile)
  }, [profile])

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
          <div className={styles.profileCircle} onClick={() => navigate('/mypage')}>
            {profile?.characterImageUrl && (
              <img src={profile.characterImageUrl} alt="프로필" style={{ width: '24px', height: '24px', objectFit: 'contain' }} />
            )}
          </div>
        </div>
      </nav>

      <div className={styles.content}>
        <div style={{ display: 'flex', justifyContent: 'center', paddingTop: '20px' }}>
          <SolidCardPreview
            character={cardProps?.character || null}
            backgroundColor={cardProps?.backgroundColor || null}
            userName={profile?.userName || '사용자'}
            userRole={profile?.solidGoalName || ''}
            interests={cardProps?.interests || []}
            goals={profile?.mainGoals || []}
            region={region}
            school={school}
            sinceYear="2026"
            size="medium"
            onClick={handleCardClick}
          />
        </div>

        <div className={styles.bottomSection}>
          <div className={styles.gradientOverlay} />
          <div className={styles.bottomContent}>
            <div className={styles.quickMenu}>
              {QUICK_MENU_ITEMS.map(item => (
                <div key={item.id} className={styles.quickMenuItem} onClick={() => handleQuickMenuClick(item.label)}>
                  <div className={styles.quickMenuIcon}>
                    {item.icon && <img src={item.icon} alt={item.label} />}
                  </div>
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
                      <div className={styles.newsCardIcon}>
                        {item.icon && <img src={item.icon} alt="" style={{ width: item.iconWidth, height: item.iconHeight }} />}
                      </div>
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
                <button className={`${styles.categoryTab} ${styles.categoryTabActive}`}>전체</button>
                <button className={styles.categoryTab}>인성</button>
                <button className={styles.categoryTab}>사회</button>
                <button className={styles.categoryTab}>과학</button>
                <button className={styles.categoryTab}>창업</button>
                <button className={styles.categoryTab}>취업</button>
              </div>
              <div className={styles.lectureGrid}>
                {LECTURE_ITEMS.map(lecture => (
                  <div key={lecture.id} className={styles.lectureCard}>
                    <div className={styles.lectureBg}>
                      <img src={lecture.image} alt={lecture.category} />
                      <div className={styles.lectureBgOverlay} />
                    </div>
                    <div className={styles.lectureBottom}>
                      <div className={styles.lectureTextGroup}>
                        <span className={styles.lectureCategory}>{lecture.category}</span>
                        <div className={styles.lectureTitle}>{lecture.title}</div>
                      </div>
                      <span className={styles.lectureSpeaker}>{lecture.speaker}</span>
                    </div>
                  </div>
                ))}
              </div>
            </section>

            <footer className={styles.footer}>
              <button className={styles.logoutButton} onClick={handleLogout}>로그아웃</button>
              <div className={styles.footerLogo}>
                <img src={imgFooterLogo} alt="신한장학재단" />
              </div>
            </footer>
          </div>
        </div>
      </div>

      <SolidCardModal
        isOpen={isCardModalOpen}
        onClose={handleCardModalClose}
        onShare={handleShare}
        onEdit={handleEdit}
        onNetwork={handleNetwork}
        character={cardProps?.character || null}
        backgroundColor={cardProps?.backgroundColor || null}
        userName={profile?.userName || '사용자'}
        userRole={profile?.solidGoalName || ''}
        interests={cardProps?.interests || []}
        goals={profile?.mainGoals || []}
        region={region}
        school={school}
        sinceYear="2026"
      />
      <QRCodeModal
        isOpen={isQRModalOpen}
        onClose={handleQRModalClose}
        userName={profile?.userName || '사용자'}
        userRole={profile?.solidGoalName || ''}
      />
    </div>
  )
}

export default HomePage
