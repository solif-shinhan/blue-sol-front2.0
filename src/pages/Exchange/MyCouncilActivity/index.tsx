import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import styles1 from './MyCouncilActivity-1.module.css'
import styles2 from './MyCouncilActivity-2.module.css'
const styles = { ...styles1, ...styles2 }
import { BackHeader } from '@/components/BackHeader'
import heroBgImg from '@/assets/images/council/00833882333ac227511e63c448cbca38a45a2f25.png'
import shinhanLogoImg from '@/assets/images/council/057453724e8f804d5306e38ceabfcf7513cbed10.png'
import ActivitySummary from './ActivitySummary'
import ActivityMembers from './ActivityMembers'
import ActivityRules from './ActivityRules'
import { getMyCouncil, getCouncilDetail, CouncilDetail, logout } from '@/services'

function MyCouncilActivityPage() {
  const navigate = useNavigate()
  const [activeTab, setActiveTab] = useState('활동 요약')
  const [council, setCouncil] = useState<CouncilDetail | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [isCardCollapsed, setIsCardCollapsed] = useState(false)

  useEffect(() => {
    const fetchCouncil = async () => {
      setIsLoading(true)
      try {
        const myRes = await getMyCouncil()
        if (myRes.success && myRes.data) {
          const detailRes = await getCouncilDetail(myRes.data.councilId)
          if (detailRes.success && detailRes.data) {
            setCouncil(detailRes.data)
          }
        }
      } catch (err) {
        console.error('자치회 조회 실패:', err)
      } finally {
        setIsLoading(false)
      }
    }

    fetchCouncil()
  }, [])

  const handleLogout = async () => {
    await logout()
    navigate('/login')
  }

  const formatDate = (dateStr: string) => {
    if (!dateStr) return ''
    const d = new Date(dateStr)
    const y = d.getFullYear()
    const m = String(d.getMonth() + 1).padStart(2, '0')
    return `${y}.${m}`
  }

  if (isLoading) {
    return (
      <div className={styles.container}>
        <div style={{ padding: '100px 20px', textAlign: 'center' }}>로딩 중...</div>
      </div>
    )
  }

  if (!council) {
    return (
      <div className={styles.container}>
        <div style={{ padding: '100px 20px', textAlign: 'center' }}>자치회 정보를 찾을 수 없습니다.</div>
      </div>
    )
  }

  return (
    <div className={styles.container}>
      <div className={styles.headerOverlay}>
        <BackHeader
          title="나의 자치회"
          backTo="/exchange"
          rightContent={
            <button className={styles.editButton}>편집</button>
          }
        />
      </div>

      <div className={styles.hero}>
        <div className={styles.heroBg}>
          <img src={heroBgImg} alt="" />
        </div>
        <div className={styles.heroGradient} />

        <div className={`${styles.heroCard} ${isCardCollapsed ? styles.heroCardCollapsed : ''}`}>
          <div className={styles.heroCardHeader}>
            <h1 className={styles.heroCardName}>{council.councilName}</h1>
            <div className={styles.heroCardRight}>
              <span className={styles.heroCardDate}>{formatDate(council.createdAt)}</span>
              <button
                className={styles.heroCardToggle}
                onClick={() => setIsCardCollapsed(!isCardCollapsed)}
              >
                {isCardCollapsed ? '자세히보기' : '간략히 보기'}
              </button>
            </div>
          </div>
          {!isCardCollapsed && (
            <p className={styles.heroCardDescription}>
              {council.description || '자치회 설명이 없습니다.'}
            </p>
          )}
        </div>
      </div>

      <div className={styles.tabBar}>
        {['활동 요약', '활동 멤버', '활동 규칙'].map((tab) => (
          <button
            key={tab}
            className={`${styles.tabItem} ${activeTab === tab ? styles.tabItemActive : ''}`}
            onClick={() => setActiveTab(tab)}
          >
            {tab}
          </button>
        ))}
      </div>

      <div className={styles.content}>
        {activeTab === '활동 요약' && (
          <ActivitySummary
            councilId={council.councilId}
            councilName={council.councilName}
            currentBudget={council.currentBudget}
            totalBudget={council.totalBudget}
            activityCount={council.activityCount}
            monthsSinceCreation={council.monthsSinceCreation}
          />
        )}
        {activeTab === '활동 멤버' && <ActivityMembers councilId={council.councilId} />}
        {activeTab === '활동 규칙' && <ActivityRules councilId={council.councilId} />}
      </div>

      <footer className={styles.footer}>
        <button type="button" className={styles.logoutButton} onClick={handleLogout}>로그아웃</button>
        <div className={styles.footerLogo}>
          <img src={shinhanLogoImg} alt="신한장학재단" />
        </div>
      </footer>
    </div>
  )
}

export default MyCouncilActivityPage
