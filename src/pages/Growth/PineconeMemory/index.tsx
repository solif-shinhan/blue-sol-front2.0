import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import styles from './PineconeMemory-1.module.css'
import iconDismiss from '@/assets/images/solid/icon-dismiss.svg'
import imgSolbangul from '@/assets/images/grow/37f121dbe4cfc2a1e72b81c83f885c268ea4b648.png'
import imgMission1 from '@/assets/images/9f76c15a9c0b8660eea02eb71fb37a71c95402c8.png'
import imgMission2 from '@/assets/images/a62597eaf9ed76d2cfcc60e1d7cd6b4915de6157.png'
import imgMission3 from '@/assets/images/7741fb9eacef36e07c7049afab51e81067899bfe.png'
import { missionApi, type MissionProgressResponse, type MissionCategory } from '@/api/api-3'

const CATEGORY_LABELS: Record<MissionCategory, string> = {
  CONNECT: '연결',
  GROW: '성장',
  IMPACT: '기여',
}

interface MissionItem {
  title: string
  icon: string
  canRecall: boolean
}

const FALLBACK_MISSIONS: Record<MissionCategory, MissionItem[]> = {
  CONNECT: [
    { title: 'SOLID 카드 5회\n조회하기!', icon: imgMission1, canRecall: false },
    { title: '친구에게 응원 또는\n경험 나누기 보내기', icon: imgMission2, canRecall: true },
    { title: '첫 쪽지 보내기', icon: imgMission3, canRecall: true },
  ],
  GROW: [
    { title: '나의 SOLID 카드\n100% 완성하기', icon: imgMission1, canRecall: true },
  ],
  IMPACT: [
    { title: '활동 게시글\n작성하기', icon: imgMission1, canRecall: true },
  ],
}

const CATEGORIES: MissionCategory[] = ['CONNECT', 'GROW', 'IMPACT']

// 카테고리 배지 컴포넌트
const CategoryBadge = ({ category, earned, selected, onSelect }: {
  category: MissionCategory
  earned: boolean
  selected: boolean
  onSelect: () => void
}) => (
  <button
    className={`${styles.badge} ${selected ? styles.badgeSelected : ''}`}
    onClick={earned ? onSelect : undefined}
    disabled={!earned}
  >
    <div className={styles.badgeBg} />
    <div className={styles.badgeImageWrapper}>
      <div className={`${styles.badgeImage} ${!earned ? styles.badgeImageFaded : ''}`}>
        <img src={imgSolbangul} alt={`${CATEGORY_LABELS[category]} 솔방울`} />
        {!earned && <div className={styles.badgeImageOverlay} />}
      </div>
    </div>
    <div className={`${styles.badgeLabel} ${!earned ? styles.badgeLabelInactive : ''}`}>
      <p>{CATEGORY_LABELS[category]}</p>
      <p>솔방울</p>
    </div>
  </button>
)

// 미션 카드 컴포넌트
const MissionCard = ({ mission }: { mission: MissionItem }) => (
  <div className={styles.missionCard}>
    <div className={styles.missionCardContent}>
      <div className={styles.missionCardLeft}>
        <div className={styles.missionTitle}>{mission.title}</div>
        <div className={styles.missionStatus}>
          <span className={styles.missionStatusText}>미션 완료</span>
          {!mission.canRecall && (
            <>
              <div className={styles.missionDivider} />
              <span className={styles.missionNote}>추억 회상하기 불가 미션</span>
            </>
          )}
        </div>
      </div>
      <div className={styles.missionCardIcon}>
        <img src={mission.icon} alt="" />
      </div>
    </div>
  </div>
)

function PineconeMemoryPage() {
  const navigate = useNavigate()
  const [missionData, setMissionData] = useState<MissionProgressResponse | null>(null)
  const [selectedCategory, setSelectedCategory] = useState<MissionCategory>('CONNECT')

  useEffect(() => {
    missionApi.getProgress().then(res => {
      if (res?.success && res.data) {
        setMissionData(res.data)
        const firstEarned = res.data.categoryProgress.find(c => c.isPineconeEarned)
        if (firstEarned) setSelectedCategory(firstEarned.category)
      }
    }).catch(() => {})
  }, [])

  const isEarned = (cat: MissionCategory) => {
    const progress = missionData?.categoryProgress.find(c => c.category === cat)
    return progress?.isPineconeEarned ?? false
  }

  const missions = FALLBACK_MISSIONS[selectedCategory] || []

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <div className={styles.headerInner}>
          <div className={styles.headerLeft}>
            <button className={styles.closeButton} onClick={() => navigate(-1)}>
              <img src={iconDismiss} alt="닫기" />
            </button>
            <span className={styles.headerTitle}>추억 회상하기</span>
          </div>
        </div>
      </div>

      <div className={styles.content}>
        <div className={styles.badgeRow}>
          {CATEGORIES.map(cat => (
            <CategoryBadge
              key={cat}
              category={cat}
              earned={isEarned(cat)}
              selected={selectedCategory === cat}
              onSelect={() => setSelectedCategory(cat)}
            />
          ))}
        </div>

        <div className={styles.sectionTitle}>진행했던 미션 리스트</div>

        <div className={styles.missionList}>
          {missions.map((mission, index) => (
            <MissionCard key={index} mission={mission} />
          ))}
        </div>
      </div>
    </div>
  )
}

export default PineconeMemoryPage
