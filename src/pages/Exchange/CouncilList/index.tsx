import { useNavigate } from 'react-router-dom'
import styles from './CouncilList.module.css'
import searchIcon from '@/assets/images/exchange-mentoring/search.svg'
import councilBg from '@/assets/images/council-activities.png'
import { useCouncilStatus } from '@/hooks'

interface CouncilItem {
  id: number
  region: string
  name: string
  description: string
  date: string
  members: number
  image?: string
}

const COUNCIL_LIST: CouncilItem[] = [
  { id: 1, region: '제주 자치회', name: '제주 최강 신한이들', description: '한달에 한번 봉사활동!', date: '2025.02.19', members: 9 },
  { id: 2, region: '서울 자치회', name: '서울 자치회가 세상을', description: '바꾼다!', date: '2025.02.19', members: 9 },
  { id: 3, region: '경북 자치회', name: '경북 자치회/우리는 영어', description: '공부 열심히 해요 :)', date: '2025.02.19', members: 9 },
  { id: 4, region: '서울 자치회', name: '우리는 열심히 하면서', description: '즐겁게 하는 자치회', date: '2025.02.19', members: 9 },
  { id: 5, region: '충남 자치회', name: '어떤 일이든 서로 의지하', description: '고 도우면서 함께해요!', date: '2025.02.19', members: 9 },
  { id: 6, region: '부산 자치회', name: '공기 좋고 인프가 좋은', description: '부산 자치회로 GO!', date: '2025.02.19', members: 9 },
  { id: 7, region: '경남 자치회', name: '우리 자치회는 서로의 멘', description: '토이자 멘티에요~', date: '2025.02.19', members: 9 },
  { id: 8, region: '서울 자치회', name: '우리의 우정은 10년 이상', description: '까지 함께하자!', date: '2025.02.19', members: 9 },
]

function CouncilListPage() {
  const navigate = useNavigate()
  const { hasCouncil } = useCouncilStatus()

  const myCouncil = hasCouncil
    ? { name: '제주 최강 신한이들', date: '2025.02.19', members: 9 }
    : null

  return (
    <div className={styles.container}>
      {/* Safe Zone */}
      <div className={styles.safeZone} />

      {/* Header */}
      <div className={styles.header}>
        <button className={styles.backButton} onClick={() => navigate(-1)}>
          <img src="/←.svg" alt="뒤로가기" />
        </button>
        <span className={styles.headerTitle}>자치회 둘러보기</span>
        <button className={styles.searchButton}>
          <img src={searchIcon} alt="검색" />
        </button>
      </div>

      {/* Content */}
      <div className={styles.content}>
        {/* 나의 자치회 - only when registered */}
        {myCouncil && (
          <div className={styles.myCouncilCard} onClick={() => navigate('/exchange/council/activity')}>
            <div className={styles.myCouncilBg}>
              <img src={councilBg} alt="" />
              <div className={styles.myCouncilOverlay} />
            </div>
            <div className={styles.myCouncilContent}>
              <div className={styles.myCouncilTitles}>
                <p className={styles.myCouncilLabel}>나의 자치회</p>
                <p className={styles.myCouncilName}>{myCouncil.name}</p>
              </div>
              <div className={styles.myCouncilMeta}>
                <span className={styles.myCouncilMetaText}>{myCouncil.date}</span>
                <div className={styles.metaDivider} />
                <span className={styles.myCouncilMetaText}>{myCouncil.members}명</span>
              </div>
            </div>
          </div>
        )}

        {/* 자치회 리스트 */}
        <div className={styles.councilSection}>
          <h2 className={styles.sectionTitle}>자치회</h2>
          <div className={styles.councilGrid}>
            {COUNCIL_LIST.map((council) => (
              <div key={council.id} className={styles.councilCard}>
                <div className={styles.cardBg}>
                  {council.image && <img src={council.image} alt="" />}
                  <div className={styles.cardGradient} />
                </div>
                <div className={styles.cardContent}>
                  <div className={styles.cardInfo}>
                    <div className={styles.cardTexts}>
                      <p className={styles.cardRegion}>{council.region}</p>
                      <p className={styles.cardTitle}>
                        {council.name}{council.description ? `\n${council.description}` : ''}
                      </p>
                    </div>
                    <div className={styles.cardMeta}>
                      <span className={styles.cardMetaText}>{council.date}</span>
                      <div className={styles.cardMetaDivider} />
                      <span className={styles.cardMetaText}>{council.members}명</span>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}

export default CouncilListPage
