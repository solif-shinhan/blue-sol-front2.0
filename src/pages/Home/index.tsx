import { useState, useRef, useEffect, useCallback } from 'react'
import { useNavigate } from 'react-router-dom'
import styles1 from './Home-1.module.css'
import styles2 from './Home-2.module.css'
import styles3 from './Home-3.module.css'
import styles4 from './Home-4.module.css'
import bellIcon from '@/assets/images/bell.svg'
import { SolidCardModal } from './components/SolidCardModal'
import { QRCodeModal } from './components/QRCodeModal'
import { NEWS_ITEMS, LECTURE_ITEMS, QUICK_MENU_ITEMS } from './Home.constants'

const styles = { ...styles1, ...styles2, ...styles3, ...styles4 }

function HomePage() {
  const navigate = useNavigate()
  const [currentSlide, setCurrentSlide] = useState(0)
  const [isCardModalOpen, setIsCardModalOpen] = useState(false)
  const [isQRModalOpen, setIsQRModalOpen] = useState(false)
  const sliderRef = useRef<HTMLDivElement>(null)
  const isDragging = useRef(false)
  const startX = useRef(0)
  const scrollLeft = useRef(0)

  const handleTabClick = (tab: string) => {
    if (tab === '교류') navigate('/exchange')
    else if (tab === '성장') navigate('/growth')
  }

  const handleCardClick = () => setIsCardModalOpen(true)
  const handleCardModalClose = () => setIsCardModalOpen(false)
  const handleShare = () => setIsQRModalOpen(true)
  const handleQRModalClose = () => setIsQRModalOpen(false)
  const handleEdit = () => console.log('Edit clicked')
  const handleNetwork = () => console.log('Network clicked')

  const getSlideWidth = useCallback(() => sliderRef.current?.offsetWidth || 360, [])

  const goToSlide = useCallback((index: number) => {
    let targetIndex = index
    if (index < 0) targetIndex = NEWS_ITEMS.length - 1
    else if (index >= NEWS_ITEMS.length) targetIndex = 0
    setCurrentSlide(targetIndex)
    sliderRef.current?.scrollTo({ left: targetIndex * getSlideWidth(), behavior: 'smooth' })
  }, [getSlideWidth])

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
      if (newSlide !== currentSlide && newSlide >= 0 && newSlide < NEWS_ITEMS.length) setCurrentSlide(newSlide)
    }
    slider.addEventListener('scroll', handleScroll)
    return () => slider.removeEventListener('scroll', handleScroll)
  }, [currentSlide, getSlideWidth])

  return (
    <div className={styles.container}>
      <nav className={styles.tabNav}>
        <div className={styles.tabs}>
          <button className={`${styles.tab} ${styles.tabActive}`}>홈</button>
          <button className={styles.tab} onClick={() => handleTabClick('교류')}>교류</button>
          <button className={styles.tab} onClick={() => handleTabClick('성장')}>성장</button>
        </div>
        <div className={styles.tabNavRight}>
          <button className={styles.iconButton}>
            <img src={bellIcon} alt="알림" width={28} height={28} />
          </button>
          <div className={styles.profileCircle}></div>
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
            <h1 className={styles.headerTitle}>한체대 27학번으로<br />입학하기</h1>
          </header>

          <div className={styles.goalBadge}>
            <span className={styles.goalLabel}>나의 목표</span>
            <div className={styles.goalCount}>
              <span className={styles.goalCurrent}>03</span>
              <span className={styles.goalDivider}>/</span>
              <span className={styles.goalTotal}>10</span>
            </div>
          </div>
        </div>

        <div className={styles.solidCard} onClick={handleCardClick} style={{ cursor: 'pointer' }}>
          <div className={styles.solidLogo}>
            <span className={styles.solidLogoSol}>SOL</span>
            <span className={styles.solidLogoId}>ID</span>
          </div>
          <div className={styles.profileSection}>
            <span className={styles.profileName}>김솔잎</span>
            <span className={styles.profileBadge}>솔방울</span>
            <span className={styles.profileTag}>체육교사꿈나무</span>
          </div>
          <div className={styles.goalList}>
            <p className={styles.goalItem1}>한체대 27학번으로 입학하기</p>
            <p className={styles.goalItem2}>체육대회 우승하기</p>
            <p className={styles.goalItem3}>가족 여행 가기</p>
          </div>
          <div className={styles.interestTags}>
            <div className={styles.interestTag}><div className={styles.tagIcon}></div><span>농구</span></div>
            <div className={styles.interestTag}><div className={styles.tagIcon}></div><span>봉사활동</span></div>
          </div>
        </div>

        <div className={styles.bottomSection}>
          <div className={styles.bottomContent}>
            <div className={styles.quickMenu}>
              {QUICK_MENU_ITEMS.map(item => (
                <div key={item.id} className={styles.quickMenuItem}>
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
              <button className={styles.logoutButton}>로그아웃</button>
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
