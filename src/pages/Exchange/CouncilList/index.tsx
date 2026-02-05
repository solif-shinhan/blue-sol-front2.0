import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import styles from './CouncilList.module.css'
import councilBg from '@/assets/images/council-activities.png'
import associationCat from '@/assets/images/exchange-mentoring/association-cat.png'
import backArrowIcon from '@/assets/images/Glyph_ undefined.svg'
import { getCouncilList, getMyCouncil, Council } from '@/services'

const flagImage = '/flag1.png'

interface CouncilItem {
  id: number
  region: string
  name: string
  description: string
  date: string
  members: number
  image?: string
}

function formatDate(dateString: string): string {
  const date = new Date(dateString)
  return date.toLocaleDateString('ko-KR', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
  }).replace(/\. /g, '.').replace(/\.$/, '')
}

function mapCouncilToItem(council: Council): CouncilItem {
  return {
    id: council.councilId,
    region: council.region || '지역 미지정',
    name: council.name,
    description: council.description,
    date: formatDate(council.createdAt),
    members: council.memberCount,
    image: associationCat,
  }
}

function CouncilListPage() {
  const navigate = useNavigate()
  const [councils, setCouncils] = useState<CouncilItem[]>([])
  const [myCouncil, setMyCouncil] = useState<CouncilItem | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true)
      try {
        const [listRes, myRes] = await Promise.all([
          getCouncilList(),
          getMyCouncil().catch(() => null),
        ])

        if (listRes.success) {
          setCouncils(listRes.data.map(mapCouncilToItem))
        }

        if (myRes?.success && myRes.data) {
          setMyCouncil(mapCouncilToItem(myRes.data))
        }
      } catch (err) {
        console.error('자치회 조회 실패:', err)
      } finally {
        setIsLoading(false)
      }
    }

    fetchData()
  }, [])

  return (
    <div className={styles.container}>
      <div className={styles.safeZone} />

      <div className={styles.header}>
        <button className={styles.backButton} onClick={() => navigate(-1)}>
          <img src={backArrowIcon} alt="뒤로가기" />
        </button>
        <span className={styles.headerTitle}>자치회 둘러보기</span>
      </div>

      <div className={styles.content}>
        {isLoading ? (
          <div style={{ padding: '40px', textAlign: 'center' }}>로딩 중...</div>
        ) : myCouncil ? (
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

        <div className={styles.councilSection}>
          <h2 className={styles.sectionTitle}>자치회</h2>
          {councils.length === 0 && !isLoading ? (
            <div style={{ padding: '20px', textAlign: 'center', color: '#888' }}>
              등록된 자치회가 없습니다.
            </div>
          ) : (
            <div className={styles.councilGrid}>
              {councils.map((council) => (
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
          )}
        </div>
      </div>
    </div>
  )
}

export default CouncilListPage
