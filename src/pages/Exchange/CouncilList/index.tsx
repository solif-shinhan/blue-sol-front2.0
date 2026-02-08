import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import styles from './CouncilList.module.css'
import councilBg from '@/assets/images/council-activities.png'
import backArrowIcon from '@/assets/images/Glyph_ undefined.svg'
import { getCouncilList, CouncilListItem, CouncilMyResponse } from '@/services'

const flagImage = '/flag1.png'
const defaultThumbnail = '/image.png'

function CouncilListPage() {
  const navigate = useNavigate()
  const [councils, setCouncils] = useState<CouncilListItem[]>([])
  const [myCouncil, setMyCouncil] = useState<CouncilMyResponse | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true)
      try {
        const res = await getCouncilList()
        if (res.success && res.data) {
          setMyCouncil(res.data.myCouncil)
          setCouncils(res.data.councils)
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
                <p className={styles.myCouncilName}>{myCouncil.councilName}</p>
              </div>
              <div className={styles.myCouncilMeta}>
                <span className={styles.myCouncilMetaText}>{myCouncil.memberCount}명</span>
              </div>
            </div>
          </div>
        ) : (
          <div className={styles.councilRegisterCard} onClick={() => navigate('/exchange/council/register')}>
            <div className={styles.councilRegisterTextGroup}>
              <p className={styles.councilRegisterSubtitle}>아직 자치회에 등록하지 않았어요</p>
              <p className={styles.councilRegisterTitle}>나의 자치회 등록하기</p>
              <p className={styles.councilRegisterDesc}>너와 내가 만드는 우리의 울타리</p>
            </div>
            <img src={flagImage} alt="" className={styles.councilRegisterImage} />
          </div>
        )}

        <div className={styles.councilSection}>
          <h2 className={styles.sectionTitle}>자치회 리스트</h2>
          {councils.length === 0 && !isLoading ? (
            <div style={{ padding: '20px', textAlign: 'center', color: '#888' }}>
              등록된 자치회가 없습니다.
            </div>
          ) : (
            <div className={styles.councilList}>
              {councils.map((council) => (
                <div key={council.councilId} className={styles.councilListItem}>
                  <img
                    src={council.profileImageUrl || defaultThumbnail}
                    alt=""
                    className={styles.councilItemThumbnail}
                  />
                  <div className={styles.councilItemInfo}>
                    <div className={styles.councilItemRegionRow}>
                      <span className={styles.councilItemRegion}>
                        {council.region || '지역 미지정'} 자치회
                      </span>
                      <div className={styles.councilItemDivider} />
                      <span className={styles.councilItemMembers}>{council.memberCount}명</span>
                    </div>
                    <div className={styles.councilItemNameGroup}>
                      <p className={styles.councilItemName}>{council.councilName}</p>
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
