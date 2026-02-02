import { useNavigate } from 'react-router-dom'
import styles from './CouncilList.module.css'
import councilBg from '@/assets/images/council-activities.png'
import associationCat from '@/assets/images/exchange-mentoring/association-cat.png'
import backArrowIcon from '@/assets/images/Glyph_ undefined.svg'
// flag1.png is in public folder, use direct path
const flagImage = '/flag1.png'
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
  { id: 1, region: '제주 자치회', name: '제주 최강 신한이들', description: '한달에 한번 봉사활동!', date: '2025.02.19', members: 9, image: associationCat },
  { id: 2, region: '서울 자치회', name: '서울 자치회가 세상을', description: '바꾼다!', date: '2025.02.19', members: 9, image: associationCat },
  { id: 3, region: '경북 자치회', name: '경북 자치회/우리는 영어', description: '공부 열심히 해요 :)', date: '2025.02.19', members: 9, image: associationCat },
  { id: 4, region: '서울 자치회', name: '우리는 열심히 하면서', description: '즐겁게 하는 자치회', date: '2025.02.19', members: 9, image: associationCat },
  { id: 5, region: '충남 자치회', name: '어떤 일이든 서로 의지하', description: '고 도우면서 함께해요!', date: '2025.02.19', members: 9, image: associationCat },
  { id: 6, region: '부산 자치회', name: '공기 좋고 인프가 좋은', description: '부산 자치회로 GO!', date: '2025.02.19', members: 9, image: associationCat },
  { id: 7, region: '경남 자치회', name: '우리 자치회는 서로의 멘', description: '토이자 멘티에요~', date: '2025.02.19', members: 9, image: associationCat },
  { id: 8, region: '서울 자치회', name: '우리의 우정은 10년 이상', description: '까지 함께하자!', date: '2025.02.19', members: 9, image: associationCat },
]

function CouncilListPage() {
  const navigate = useNavigate()
  const { hasCouncil } = useCouncilStatus()

  // For testing/visuals, if the user context implies no council, we show the registration card.
  // The user hook dictates this.
  // TEMP: Force null to show Register Card as per user request for design implementation
  const myCouncil: any = null
  /* hasCouncil
    ? { name: '제주 최강 신한이들', date: '2025.02.19', members: 9 }
    : null */

  return (
    <div className={styles.container}>
      {/* Safe Zone */}
      <div className={styles.safeZone} />

      {/* Header */}
      <div className={styles.header}>
        <button className={styles.backButton} onClick={() => navigate(-1)}>
          <img src={backArrowIcon} alt="뒤로가기" />
        </button>
        <span className={styles.headerTitle}>자치회 둘러보기</span>
      </div>

      {/* Content */}
      <div className={styles.content}>
        {/* 나의 자치회 or 등록하기 카드 */}
        {myCouncil ? (
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
        ) : (
          <section className={styles.councilSection}>
            <div className={styles.councilHeader}>
              <h2 className={styles.sectionTitle}>자치회 활동</h2>
              <button className={styles.browseButton} onClick={() => navigate('/exchange/council')}>둘러보기</button>
            </div>
            <div className={styles.councilRegisterCard} onClick={() => navigate('/exchange/council/register')}>
              <div className={styles.councilRegisterTextGroup}>
                <p className={styles.councilRegisterSubtitle}>아직 자치회에 등록하지 않았어요</p>
                <p className={styles.councilRegisterTitle}>나의 자치회 등록하기</p>
                <p className={styles.councilRegisterDesc}>너와 내가 만드는 우리의 울타리</p>
              </div>
              <img src={flagImage} alt="" className={styles.councilRegisterImage} />
            </div>
          </section>
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
