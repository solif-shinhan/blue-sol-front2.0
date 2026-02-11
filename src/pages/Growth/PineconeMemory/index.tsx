import { useState, useEffect } from 'react'
import styles from './PineconeMemory-1.module.css'
import { BackHeader } from '@/components/BackHeader'
import imgSolbangul from '@/assets/images/grow/image 184.png'
import imgMission1 from '@/assets/images/9f76c15a9c0b8660eea02eb71fb37a71c95402c8.png'
import imgMission2 from '@/assets/images/a62597eaf9ed76d2cfcc60e1d7cd6b4915de6157.png'
import imgMission3 from '@/assets/images/7741fb9eacef36e07c7049afab51e81067899bfe.png'
import { missionApi, type MissionProgressResponse, type MissionCategory, type CompletedMission } from '@/api/api-3'

const CATEGORY_LABELS: Record<MissionCategory, string> = {
  CONNECT: '연결',
  GROW: '성장',
  IMPACT: '기여',
}

const CATEGORY_ICON_MAP: Record<MissionCategory, string> = {
  CONNECT: imgMission1,
  GROW: imgMission2,
  IMPACT: imgMission3,
}

const CATEGORIES: MissionCategory[] = ['CONNECT', 'GROW', 'IMPACT']

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

const MissionCard = ({ mission, categoryIcon }: { mission: CompletedMission; categoryIcon: string }) => (
  <div className={styles.missionCard}>
    <div className={styles.missionCardContent}>
      <div className={styles.missionCardLeft}>
        <div className={styles.missionTitle}>{mission.missionTitle}</div>
        <div className={styles.missionStatus}>
          <span className={styles.missionStatusText}>
            {mission.isCompleted ? '미션 완료' : '진행 중'}
          </span>
          {!mission.hasMemoryDetail && (
            <>
              <div className={styles.missionDivider} />
              <span className={styles.missionNote}>추억 회상하기 불가 미션</span>
            </>
          )}
        </div>
      </div>
      <div className={styles.missionCardIcon}>
        <img src={categoryIcon} alt="" />
      </div>
    </div>
  </div>
)

function PineconeMemoryPage() {
  const [missionData, setMissionData] = useState<MissionProgressResponse | null>(null)
  const [selectedCategory, setSelectedCategory] = useState<MissionCategory>('CONNECT')
  const [missions, setMissions] = useState<CompletedMission[]>([])
  const [isLoadingMemories, setIsLoadingMemories] = useState(false)

  useEffect(() => {
    missionApi.getProgress().then(res => {
      if (res?.success && res.data) {
        setMissionData(res.data)
        const firstEarned = res.data.categoryProgress.find(c => c.isPineconeEarned)
        if (firstEarned) setSelectedCategory(firstEarned.category)
      }
    }).catch(() => {})
  }, [])

  useEffect(() => {
    const isEarned = missionData?.categoryProgress.find(
      c => c.category === selectedCategory
    )?.isPineconeEarned

    if (!isEarned) {
      setMissions([])
      return
    }

    setIsLoadingMemories(true)
    missionApi.getMemories(selectedCategory).then(res => {
      if (res?.success && res.data?.completedMissions) {
        setMissions(res.data.completedMissions)
      } else {
        setMissions([])
      }
    }).catch(() => {
      setMissions([])
    }).finally(() => {
      setIsLoadingMemories(false)
    })
  }, [selectedCategory, missionData])

  const isEarned = (cat: MissionCategory) => {
    const progress = missionData?.categoryProgress.find(c => c.category === cat)
    return progress?.isPineconeEarned ?? false
  }

  return (
    <div className={styles.container}>
      <BackHeader title="추억 회상하기" icon="close" />

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
          {isLoadingMemories ? (
            <div style={{ padding: '20px', textAlign: 'center', color: '#848484', fontSize: '14px' }}>
              로딩 중...
            </div>
          ) : missions.length === 0 ? (
            <div style={{ padding: '20px', textAlign: 'center', color: '#848484', fontSize: '14px' }}>
              완료된 미션이 없습니다.
            </div>
          ) : (
            missions.map((mission, index) => (
              <MissionCard
                key={index}
                mission={mission}
                categoryIcon={CATEGORY_ICON_MAP[selectedCategory]}
              />
            ))
          )}
        </div>
      </div>
    </div>
  )
}

export default PineconeMemoryPage
