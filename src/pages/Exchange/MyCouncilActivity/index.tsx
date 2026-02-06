import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import styles1 from './MyCouncilActivity-1.module.css'
import styles2 from './MyCouncilActivity-2.module.css'
const styles = { ...styles1, ...styles2 }
import { BackHeader } from '@/components/BackHeader'
import heroBgImg from '@/assets/images/myactivitysummary/Frame 2147230564.png'
import editIcon from '@/assets/images/myactivitysummary/Union.svg'
import ActivitySummary from './ActivitySummary'
import ActivityMembers from './ActivityMembers'
import ActivityRules from './ActivityRules'
import { getMyCouncil, Council, logout } from '@/services'

function MyCouncilActivityPage() {
  const navigate = useNavigate()
  const [activeTab, setActiveTab] = useState('활동 요약')
  const [council, setCouncil] = useState<Council | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const fetchCouncil = async () => {
      setIsLoading(true)
      try {
        const response = await getMyCouncil()
        if (response.success && response.data) {
          setCouncil(response.data)
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
      <div className={styles.hero}>
        <div className={styles.heroBg}>
          <img src={heroBgImg} alt="" />
        </div>
        <div className={styles.heroGradient} />

        <BackHeader
          theme="dark"
          title="나의 자치회"
          rightContent={
            <button className={styles.editButton}>
              <img src={editIcon} alt="편집" />
            </button>
          }
        />

        <div className={styles.heroContent}>
          <h1 className={styles.heroTitle}>{council.name}</h1>
        </div>

        <p className={styles.heroDescription}>
          {council.description || council.goal || '자치회 설명이 없습니다.'}
        </p>
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
        {activeTab === '활동 요약' && <ActivitySummary />}
        {activeTab === '활동 멤버' && <ActivityMembers councilId={council.councilId} />}
        {activeTab === '활동 규칙' && <ActivityRules councilId={council.councilId} />}
      </div>

      <footer className={styles.footer}>
        <button type="button" className={styles.logoutButton} onClick={handleLogout}>로그아웃</button>
        <div className={styles.footerLogo}>
          <img src="/shinhan-logo.svg" alt="신한장학재단" />
        </div>
      </footer>
    </div>
  )
}

export default MyCouncilActivityPage
