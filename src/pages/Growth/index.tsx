import { useState, useRef, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import styles1 from './Growth-1.module.css'
import styles2 from './Growth-2.module.css'
import styles4 from './Growth-4.module.css'

// 이미지 imports
import bellIcon from '@/assets/images/bell.svg'
import imgCharacter from '@/assets/images/e27e5ea17e8d7342655407961c49cef99027dd5a.png'
import imgGradientFade from '@/assets/images/4fe43b8fc2dc1a748e8b748d5c7ae4ef6fedd022.png'
import imgDaysLabel from '@/assets/images/grow/frame2147230658.svg'
import imgSolbangul from '@/assets/images/grow/37f121dbe4cfc2a1e72b81c83f885c268ea4b648.png'
import imgSolbangulEmpty from '@/assets/images/grow/image 183.png'
import imgSolbangulGray from '@/assets/images/839768862f205adce3f620b3c1365ab7bc7774af.png'
import imgMission1 from '@/assets/images/9f76c15a9c0b8660eea02eb71fb37a71c95402c8.png'
import imgMission2 from '@/assets/images/a62597eaf9ed76d2cfcc60e1d7cd6b4915de6157.png'
import imgMission3 from '@/assets/images/7741fb9eacef36e07c7049afab51e81067899bfe.png'

// 영상 imports
import videoTree from '@/assets/videos/tree1.mp4'
import videoTree2 from '@/assets/videos/tree2.mp4'

// 하단 섹션 imports
import { StrengthSection, ProgramSection, Footer } from './GrowthSections'
import { getProfile, ProfileData } from '@/services/profileService'
import { goalApi } from '@/api/api-2'
import { userApi } from '@/api'

type AnimationPhase = 'idle' | 'playing' | 'completed'

// 상단 그래픽 배경
const TopBackground = ({ phase, onPhaseEnd, onCloseUp, onShrinkStart }: {
  phase: AnimationPhase
  onPhaseEnd: () => void
  onCloseUp: () => void
  onShrinkStart: () => void
}) => {
  const tree1Ref = useRef<HTMLVideoElement>(null)
  const tree2Ref = useRef<HTMLVideoElement>(null)
  const [videoReady, setVideoReady] = useState(false)
  const closeUpFired = useRef(false)
  const shrinkFired = useRef(false)
  const isPlaying = phase === 'playing'

  useEffect(() => {
    const v = tree1Ref.current
    if (!v) return
    // 모바일 브라우저 autoplay 강제 실행
    v.muted = true
    v.setAttribute('webkit-playsinline', 'true')
    v.play().catch(() => {})

    // 자동재생 실패 시 첫 터치에서 재생
    const playOnTouch = () => {
      if (v.paused) {
        v.muted = true
        v.play().catch(() => {})
      }
      document.removeEventListener('touchstart', playOnTouch)
      document.removeEventListener('click', playOnTouch)
    }
    document.addEventListener('touchstart', playOnTouch, { once: true })
    document.addEventListener('click', playOnTouch, { once: true })

    return () => {
      document.removeEventListener('touchstart', playOnTouch)
      document.removeEventListener('click', playOnTouch)
    }
  }, [])

  useEffect(() => {
    if (isPlaying && tree2Ref.current) {
      closeUpFired.current = false
      shrinkFired.current = false
      tree2Ref.current.currentTime = 0
      tree2Ref.current.muted = true
      tree2Ref.current.play().catch(() => {})
    }
  }, [isPlaying])

  const handleTimeUpdate = () => {
    const v = tree2Ref.current
    if (!v || !v.duration) return
    const progress = v.currentTime / v.duration
    // 클로즈업 완료, 흔들리기 직전 (~25%)
    if (progress >= 0.25 && !closeUpFired.current) {
      closeUpFired.current = true
      onCloseUp()
    }
    // 솔방울 다시 작아지기 시작 (~70%)
    if (progress >= 0.70 && !shrinkFired.current) {
      shrinkFired.current = true
      onShrinkStart()
    }
  }

  return (
    <>
      <div className={styles1.topBackground} />
      <div className={styles1.topGraphic} style={{ opacity: videoReady ? 1 : 0, transition: 'opacity 0.5s ease' }}>
        {/* 기본 루프 영상 (항상 재생) */}
        <video
          ref={tree1Ref}
          autoPlay
          loop
          muted
          playsInline
          className={styles1.topGraphicVideo}
          onCanPlay={() => setVideoReady(true)}
        >
          <source src={videoTree} type="video/mp4" />
        </video>
        {/* 솔방울 영상 (위에 겹쳐서 opacity로 전환) */}
        <video
          ref={tree2Ref}
          muted
          playsInline
          preload="auto"
          className={styles1.topGraphicVideo}
          style={{
            opacity: isPlaying ? 1 : 0,
            transition: 'opacity 0.4s ease',
            zIndex: 1,
          }}
          onEnded={onPhaseEnd}
          onTimeUpdate={handleTimeUpdate}
        >
          <source src={videoTree2} type="video/mp4" />
        </video>
      </div>
    </>
  )
}

// 상단 네비게이션 - 홈과 동일 구조
const TopNav = ({ profile }: { profile: ProfileData | null }) => {
  const navigate = useNavigate()
  return (
    <nav className={styles1.tabNav}>
      <div className={styles1.tabs}>
        <button className={styles1.tab} onClick={() => navigate('/home')}>홈</button>
        <button className={styles1.tab} onClick={() => navigate('/exchange')}>교류</button>
        <button className={`${styles1.tab} ${styles1.tabActive}`}>성장</button>
      </div>
      <div className={styles1.tabNavRight}>
        <button className={styles1.iconButton} onClick={() => navigate('/notifications')}>
          <img src={bellIcon} alt="알림" width={28} height={28} />
        </button>
        <div
          className={styles1.profileCircle}
          onClick={() => navigate('/mypage')}
          style={profile?.backgroundImageUrl ? { backgroundImage: `url(${profile.backgroundImageUrl})`, backgroundSize: 'cover', backgroundPosition: 'center' } : undefined}
        >
          {profile?.characterImageUrl ? (
            <img src={profile.characterImageUrl} alt="프로필" style={{ width: '24px', height: '24px', objectFit: 'contain' }} />
          ) : (
            <img src={imgCharacter} alt="프로필" style={{ width: '24px', height: '24px', objectFit: 'contain' }} />
          )}
        </div>
      </div>
    </nav>
  )
}

// 사용자 정보 섹션
const UserSection = ({ visible, userName, days, goalCurrent, goalTotal }: {
  visible: boolean
  userName: string
  days: number
  goalCurrent: number
  goalTotal: number
}) => (
  <div className={`${styles1.userSection} ${styles4.transition} ${visible ? '' : styles4.fadeOut}`}>
    <div className={styles1.userInfo}>
      <div className={styles1.daysLabel}>
        {days > 0 ? (
          <span className={styles1.daysText}>푸른SOL과 함께한지 {days}일</span>
        ) : (
          <img src={imgDaysLabel} alt="푸른SOL과 함께한지" />
        )}
      </div>
      <h1 className={styles1.userName}>{userName} 님의 소나무</h1>
    </div>
    <div className={styles1.goalSection}>
      <div className={styles1.goalBadge}>
        <span>나의 목표</span>
      </div>
      <div className={styles1.goalCount}>
        <span className={styles1.goalCurrent}>{goalCurrent}</span>
        <span className={styles1.goalDivider}>/</span>
        <span className={styles1.goalTotal}>{goalTotal}</span>
      </div>
    </div>
  </div>
)

// 솔방울 장식 버튼
const SolbangulButton = ({ visible, collectedCount }: { visible: boolean; collectedCount: number }) => {
  return (
    <button className={`${styles2.solbangulButton} ${styles4.transition} ${visible ? '' : styles4.fadeOut}`}>
      <div className={styles2.solbangulIcon}>
        <img
          src={collectedCount >= 1 ? imgSolbangul : imgSolbangulEmpty}
          alt="솔방울"
        />
      </div>
      <div className={styles2.solbangulIcon}>
        <img
          src={collectedCount >= 2 ? imgSolbangul : imgSolbangulEmpty}
          alt="솔방울"
        />
      </div>
      <div className={styles2.solbangulIcon}>
        <img
          src={collectedCount >= 3 ? imgSolbangul : imgSolbangulEmpty}
          alt="솔방울"
        />
      </div>
    </button>
  )
}

// 솔방울 획득 토스트
const AcquisitionToast = ({ visible, collectedCount }: { visible: boolean; collectedCount: number }) => {
  const remaining = 3 - collectedCount
  const message = remaining > 0
    ? `연결 솔방울을 획득했어요!\n명함 받기 보상까지 ${remaining}번 남았어요.`
    : '모든 솔방울을 획득했어요!'

  return (
    <div className={`${styles4.toast} ${visible ? styles4.toastVisible : ''}`}>
      <span className={styles4.toastText}>{message}</span>
    </div>
  )
}

// 상반기 미션 리스트
const HalfYearMission = ({ onCollect, collectedCount }: {
  onCollect: (index: number) => void
  collectedCount: number
}) => (
  <div className={styles2.missionSection}>
    <div className={styles2.missionHeader}>
      <div className={styles2.missionTitle}>상반기 미션 리스트</div>
      <div className={styles2.missionDday}>D-30</div>
    </div>
    <div className={styles2.progressContainer}>
      <div className={styles2.progressBar}>
        <div className={styles2.progressBg} />
        <div className={styles2.progressFill} />
      </div>
      <div className={styles2.rewardItems}>
        <div className={styles2.rewardItem}>
          <span className={collectedCount >= 1 ? styles2.rewardLabel : `${styles2.rewardLabel} ${styles2.rewardLabelInactive}`}>솔방울 받기</span>
          <button
            className={`${styles2.rewardButton} ${collectedCount >= 1 ? styles2.rewardButtonInactive : ''}`}
            onClick={collectedCount < 1 ? () => onCollect(0) : undefined}
          >
            <div className={styles2.rewardButtonContent}>
              <div className={styles2.rewardIcon}>
                <img src={collectedCount >= 1 ? imgSolbangulGray : imgSolbangul} alt="솔방울" />
              </div>
              <span className={styles2.rewardText}>{collectedCount >= 1 ? '완료' : '받기'}</span>
            </div>
          </button>
        </div>
        <div className={styles2.rewardItem}>
          <span className={collectedCount >= 2 ? styles2.rewardLabel : `${styles2.rewardLabel} ${styles2.rewardLabelInactive}`}>솔방울 받기</span>
          <button
            className={`${styles2.rewardButton} ${collectedCount >= 2 ? styles2.rewardButtonInactive : ''}`}
            onClick={collectedCount >= 1 && collectedCount < 2 ? () => onCollect(1) : undefined}
            disabled={collectedCount < 1}
          >
            <div className={styles2.rewardButtonContent}>
              <div className={styles2.rewardIcon}><img src={collectedCount >= 2 ? imgSolbangulGray : imgSolbangul} alt="솔방울" /></div>
              <span className={styles2.rewardText}>{collectedCount >= 2 ? '완료' : '받기'}</span>
            </div>
          </button>
        </div>
        <div className={styles2.rewardItem}>
          <span className={collectedCount >= 3 ? styles2.rewardLabel : `${styles2.rewardLabel} ${styles2.rewardLabelInactive}`}>솔방울 받기</span>
          <button
            className={`${styles2.rewardButton} ${collectedCount >= 3 ? styles2.rewardButtonInactive : ''}`}
            onClick={collectedCount >= 2 && collectedCount < 3 ? () => onCollect(2) : undefined}
            disabled={collectedCount < 2}
          >
            <div className={styles2.rewardButtonContent}>
              <div className={styles2.rewardIcon}><img src={collectedCount >= 3 ? imgSolbangulGray : imgSolbangul} alt="솔방울" /></div>
              <span className={styles2.rewardText}>{collectedCount >= 3 ? '완료' : '받기'}</span>
            </div>
          </button>
        </div>
      </div>
    </div>
  </div>
)

// 이번주 미션 리스트
const WeeklyMission = () => {
  const missions = [
    { category: '연결', title: 'SOLID 카드 5회\n조회하기!', status: '참여 중', icon: imgMission1 },
    { category: '성장', title: '나의 SOLID 카드 100% 완성하기', status: '완료', icon: imgMission2 },
    { category: '기여', title: '활동 게시글 작성하기', status: '참여 가능', icon: imgMission3 },
  ]
  return (
    <div className={styles2.weeklyMissionSection}>
      <div className={styles2.missionTitle} style={{ padding: '0 5px' }}>이번주 미션 리스트</div>
      <div className={styles2.weeklyMissionCards}>
        {missions.map((mission, index) => (
          <div key={index} className={styles2.missionCard}>
            <div className={styles2.missionCardIcon}>
              <img src={mission.icon} alt={mission.category} />
            </div>
            <div className={styles2.missionCardContent}>
              <div className={styles2.missionCardInfo}>
                <div className={styles2.missionCardTexts}>
                  <span className={styles2.missionCardCategory}>{mission.category}</span>
                  <div className={styles2.missionCardTitle}>{mission.title}</div>
                </div>
                <div className={styles2.missionCardStatus}>
                  <span>{mission.status}</span>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

// 메인 페이지 컴포넌트
function GrowthPage() {
  const [phase, setPhase] = useState<AnimationPhase>('idle')
  const [collectedCount, setCollectedCount] = useState(0)
  const [showToast, setShowToast] = useState(false)
  const [profile, setProfile] = useState<ProfileData | null>(null)
  const [days, setDays] = useState(0)
  const [goalCurrent, setGoalCurrent] = useState(0)
  const [goalTotal, setGoalTotal] = useState(0)
  const [isDataLoaded, setIsDataLoaded] = useState(false)
  const containerRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const loadData = async () => {
      const [profileRes, userRes, goalRes] = await Promise.all([
        getProfile().catch(() => null),
        userApi.getMe().catch(() => null),
        goalApi.getFirst().catch(() => null),
      ])
      if (profileRes?.success) setProfile(profileRes.data)
      if (userRes?.success && userRes.data?.createdAt) {
        const created = new Date(userRes.data.createdAt)
        const diff = Math.floor((Date.now() - created.getTime()) / (1000 * 60 * 60 * 24))
        setDays(diff)
      }
      if (goalRes?.success && goalRes.data) {
        setGoalCurrent(goalRes.data.currentIndex)
        setGoalTotal(goalRes.data.totalCount)
      }
      setIsDataLoaded(true)
    }
    loadData()
  }, [])

  const isAnimating = phase === 'playing'
  const isUserVisible = isDataLoaded && phase === 'idle'
  const isSolbangulVisible = isDataLoaded && phase === 'idle'

  const handleCollect = (index: number) => {
    if (phase !== 'idle' || collectedCount > index) return
    containerRef.current?.scrollTo({ top: 0, behavior: 'smooth' })
    setTimeout(() => setPhase('playing'), 300)
  }

  // 클로즈업 완료 시점: 카운트 증가 + 토스트 표시
  const handleCloseUp = () => {
    setCollectedCount(prev => Math.min(prev + 1, 3))
    setShowToast(true)
  }

  // 솔방울 축소 시작 시점: 토스트 자연스럽게 사라짐
  const handleShrinkStart = () => {
    setShowToast(false)
  }

  // 영상 종료: idle로 복귀
  const handlePhaseEnd = () => {
    if (phase === 'playing') {
      setPhase('idle')
    }
  }

  // 스크롤 잠금 (애니메이션 중)
  useEffect(() => {
    if (containerRef.current) {
      containerRef.current.style.overflowY = isAnimating ? 'hidden' : 'auto'
    }
  }, [isAnimating])

  return (
    <div className={styles1.container} ref={containerRef}>
      <div className={styles1.scrollContent}>
        <TopBackground phase={phase} onPhaseEnd={handlePhaseEnd} onCloseUp={handleCloseUp} onShrinkStart={handleShrinkStart} />
        <img
          src={imgGradientFade}
          alt=""
          className={styles1.gradientFade}
          style={{ position: 'absolute', top: 520, left: 0, width: 393, height: 185, objectFit: 'cover' }}
        />
        <TopNav profile={profile} />
        <UserSection
          visible={isUserVisible}
          userName={profile?.userName || '사용자'}
          days={days}
          goalCurrent={goalCurrent}
          goalTotal={goalTotal}
        />
        <SolbangulButton visible={isSolbangulVisible} collectedCount={collectedCount} />
        <AcquisitionToast visible={showToast} collectedCount={collectedCount} />

        <div className={styles2.mainContent}>
          <HalfYearMission onCollect={handleCollect} collectedCount={collectedCount} />
          <WeeklyMission />
          <StrengthSection />
          <ProgramSection />
          <Footer />
        </div>
      </div>
    </div>
  )
}

export default GrowthPage
