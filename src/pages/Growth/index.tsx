import { useState, useRef, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import styles1 from './Growth-1.module.css'
import styles2 from './Growth-2.module.css'
import styles4 from './Growth-4.module.css'

// 이미지 imports
import imgCharacter from '@/assets/images/e27e5ea17e8d7342655407961c49cef99027dd5a.png'
import imgGradientFade from '@/assets/images/4fe43b8fc2dc1a748e8b748d5c7ae4ef6fedd022.png'
import imgDaysLabel from '@/assets/images/grow/frame2147230658.svg'
import imgSolbangul from '@/assets/images/37f121dbe4cfc2a1e72b81c83f885c268ea4b648.png'
import imgSolbangulGray from '@/assets/images/839768862f205adce3f620b3c1365ab7bc7774af.png'
import imgMission1 from '@/assets/images/9f76c15a9c0b8660eea02eb71fb37a71c95402c8.png'
import imgMission2 from '@/assets/images/a62597eaf9ed76d2cfcc60e1d7cd6b4915de6157.png'
import imgMission3 from '@/assets/images/7741fb9eacef36e07c7049afab51e81067899bfe.png'

// 영상 imports
import videoTree from '@/assets/videos/tree1.mp4'
import videoTreeBig from '@/assets/videos/treebig.mp4'
import videoSolWind from '@/assets/videos/solwind.mp4'
import videoSolBack from '@/assets/videos/solback.mp4'

// 하단 섹션 imports
import { StrengthSection, ProgramSection, Footer } from './GrowthSections'

type AnimationPhase = 'idle' | 'zoomIn' | 'pinecone' | 'zoomOut' | 'completed'

const VIDEO_MAP: Record<AnimationPhase, string> = {
  idle: videoTree,
  zoomIn: videoTreeBig,
  pinecone: videoSolWind,
  zoomOut: videoSolBack,
  completed: videoTree,
}

// 상단 그래픽 배경
const TopBackground = ({ phase, onPhaseEnd }: {
  phase: AnimationPhase
  onPhaseEnd: () => void
}) => {
  const isLoop = phase === 'idle' || phase === 'completed'
  return (
    <>
      <div className={styles1.topBackground} />
      <div className={styles1.topGraphic}>
        <video
          key={phase}
          autoPlay
          loop={isLoop}
          muted
          playsInline
          className={styles1.topGraphicVideo}
          onEnded={() => { if (!isLoop) onPhaseEnd() }}
        >
          <source src={VIDEO_MAP[phase]} type="video/mp4" />
        </video>
      </div>
    </>
  )
}

// 상단 네비게이션
const TopNav = () => {
  const navigate = useNavigate()
  return (
    <div className={styles1.topNav}>
      <div className={styles1.tabMenu}>
        <button className={styles1.tabItem} onClick={() => navigate('/')}>
          <span>홈</span>
        </button>
        <button className={styles1.tabItem} onClick={() => navigate('/exchange')}>
          <span>교류</span>
        </button>
        <button className={`${styles1.tabItem} ${styles1.tabItemActive}`}>
          <span>성장</span>
        </button>
      </div>
      <div className={styles1.rightIcons}>
        <button className={styles1.bellIcon}>
          <svg width="28" height="28" viewBox="0 0 28 28" fill="none">
            <path d="M14 3C10.134 3 7 6.134 7 10V15L5 17V18H23V17L21 15V10C21 6.134 17.866 3 14 3Z" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
            <path d="M11 21C11 22.657 12.343 24 14 24C15.657 24 17 22.657 17 21" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        </button>
        <div className={styles1.profileIcon}>
          <img src={imgCharacter} alt="프로필" />
        </div>
      </div>
    </div>
  )
}

// 사용자 정보 섹션
const UserSection = ({ visible }: { visible: boolean }) => (
  <div className={`${styles1.userSection} ${styles4.transition} ${visible ? '' : styles4.fadeOut}`}>
    <div className={styles1.userInfo}>
      <div className={styles1.daysLabel}>
        <img src={imgDaysLabel} alt="푸른SOL과 함께한지 374일" />
      </div>
      <h1 className={styles1.userName}>김솔잎 님의 소나무</h1>
    </div>
    <div className={styles1.goalSection}>
      <div className={styles1.goalBadge}>
        <span>나의 목표</span>
      </div>
      <div className={styles1.goalCount}>
        <span className={styles1.goalCurrent}>3</span>
        <span className={styles1.goalDivider}>/</span>
        <span className={styles1.goalTotal}>4</span>
      </div>
    </div>
  </div>
)

// 솔방울 장식 버튼
const SolbangulButton = ({ visible }: { visible: boolean }) => (
  <button className={`${styles2.solbangulButton} ${styles4.transition} ${visible ? '' : styles4.fadeOut}`}>
    <div className={styles2.solbangulIcon}><img src={imgSolbangul} alt="솔방울" /></div>
    <div className={styles2.solbangulIcon}><img src={imgSolbangul} alt="솔방울" /></div>
    <div className={styles2.solbangulIcon}><img src={imgSolbangul} alt="솔방울" /></div>
  </button>
)

// 솔방울 획득 토스트
const AcquisitionToast = ({ visible }: { visible: boolean }) => (
  <div className={`${styles4.toast} ${visible ? styles4.toastVisible : ''}`}>
    <span className={styles4.toastText}>
      연결 솔방울을 획득했어요!{'\n'}명함 받기 보상까지 2번 남았어요.
    </span>
  </div>
)

// 상반기 미션 리스트
const HalfYearMission = ({ onCollect, collected }: {
  onCollect: () => void
  collected: boolean
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
          <span className={styles2.rewardLabel}>솔방울 받기</span>
          <button
            className={`${styles2.rewardButton} ${collected ? styles2.rewardButtonInactive : ''}`}
            onClick={!collected ? onCollect : undefined}
          >
            <div className={styles2.rewardButtonContent}>
              <div className={styles2.rewardIcon}>
                <img src={collected ? imgSolbangulGray : imgSolbangul} alt="솔방울" />
              </div>
              <span className={styles2.rewardText}>{collected ? '완료' : '받기'}</span>
            </div>
          </button>
        </div>
        <div className={styles2.rewardItem}>
          <span className={`${styles2.rewardLabel} ${styles2.rewardLabelInactive}`}>솔방울 받기</span>
          <button className={`${styles2.rewardButton} ${styles2.rewardButtonInactive}`}>
            <div className={styles2.rewardButtonContent}>
              <div className={styles2.rewardIcon}><img src={imgSolbangulGray} alt="솔방울" /></div>
              <span className={styles2.rewardText}>받기</span>
            </div>
          </button>
        </div>
        <div className={styles2.rewardItem}>
          <span className={`${styles2.rewardLabel} ${styles2.rewardLabelInactive}`}>명함 받기</span>
          <button className={`${styles2.rewardButton} ${styles2.rewardButtonInactive}`}>
            <div className={styles2.rewardButtonContent}>
              <div className={styles2.rewardIcon}><img src={imgSolbangulGray} alt="솔방울" /></div>
              <span className={styles2.rewardText}>받기</span>
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
  const [collected, setCollected] = useState(false)
  const [showToast, setShowToast] = useState(false)
  const containerRef = useRef<HTMLDivElement>(null)

  const isAnimating = phase !== 'idle' && phase !== 'completed'
  const isUserVisible = phase === 'idle' || phase === 'zoomOut' || phase === 'completed'
  const isSolbangulVisible = phase === 'idle' || phase === 'completed'

  const handleCollect = () => {
    if (phase !== 'idle' || collected) return
    containerRef.current?.scrollTo({ top: 0, behavior: 'smooth' })
    setTimeout(() => setPhase('zoomIn'), 300)
  }

  const handlePhaseEnd = () => {
    if (phase === 'zoomIn') setPhase('pinecone')
    else if (phase === 'pinecone') setPhase('zoomOut')
    else if (phase === 'zoomOut') {
      setPhase('completed')
      setCollected(true)
    }
  }

  // 스크롤 잠금 (애니메이션 중)
  useEffect(() => {
    if (containerRef.current) {
      containerRef.current.style.overflowY = isAnimating ? 'hidden' : 'auto'
    }
  }, [isAnimating])

  // 토스트 표시 제어
  useEffect(() => {
    if (phase === 'pinecone') {
      const t = setTimeout(() => setShowToast(true), 500)
      return () => clearTimeout(t)
    }
    if (phase === 'zoomOut') {
      setShowToast(false)
    }
    if (phase === 'completed') {
      setShowToast(true)
      const t = setTimeout(() => setShowToast(false), 3000)
      return () => clearTimeout(t)
    }
  }, [phase])

  return (
    <div className={styles1.container} ref={containerRef}>
      <div className={styles1.scrollContent}>
        <TopBackground phase={phase} onPhaseEnd={handlePhaseEnd} />
        <img
          src={imgGradientFade}
          alt=""
          className={styles1.gradientFade}
          style={{ position: 'absolute', top: 520, left: 0, width: 393, height: 185, objectFit: 'cover' }}
        />
        <TopNav />
        <UserSection visible={isUserVisible} />
        <SolbangulButton visible={isSolbangulVisible} />
        <AcquisitionToast visible={showToast} />

        <div className={styles2.mainContent}>
          <HalfYearMission onCollect={handleCollect} collected={collected} />
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
