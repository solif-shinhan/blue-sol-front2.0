import { useState } from 'react'
import styles1 from './MyCouncilActivity-1.module.css'
import styles2 from './MyCouncilActivity-2.module.css'
const styles = { ...styles1, ...styles2 }
import { BackHeader } from '@/components/BackHeader'
import heroBgImg from '@/assets/images/myactivitysummary/Frame 2147230564.png'
import editIcon from '@/assets/images/myactivitysummary/Union.svg'
import ActivitySummary from './ActivitySummary'
import ActivityMembers from './ActivityMembers'
import ActivityRules from './ActivityRules'

function MyCouncilActivityPage() {
  const [activeTab, setActiveTab] = useState('활동 요약')

  return (
    <div className={styles.container}>
      {/* Hero Section */}
      <div className={styles.hero}>
        <div className={styles.heroBg}>
          <img src={heroBgImg} alt="" />
        </div>
        <div className={styles.heroGradient} />

        {/* Header - BackHeader 컴포넌트 사용 (dark 테마) */}
        <BackHeader
          theme="dark"
          title="나의 자치회"
          rightContent={
            <button className={styles.editButton}>
              <img src={editIcon} alt="편집" />
            </button>
          }
        />

        {/* Hero Content */}
        <div className={styles.heroContent}>
          <h1 className={styles.heroTitle}>제주최강신한이들</h1>
        </div>

        <p className={styles.heroDescription}>
          제주 감귤보다 상큼하고 현무암보다 단단한 결속력! 장학재단의 든든한 지원 아래 제주를 누비는 우리는 어벤져스! 서로의 꿈을 응원하며 제주에서의 낭만과 성장을 모두 잡고 싶어요.
        </p>
      </div>

      {/* Tab Bar */}
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

      {/* Content */}
      <div className={styles.content}>
        {activeTab === '활동 요약' && <ActivitySummary />}
        {activeTab === '활동 멤버' && <ActivityMembers />}
        {activeTab === '활동 규칙' && <ActivityRules />}
      </div>

      {/* Footer */}
      <footer className={styles.footer}>
        <button className={styles.logoutButton}>로그아웃</button>
        <div className={styles.footerLogo}>
          <img src="/shinhan-logo.svg" alt="신한장학재단" />
        </div>
      </footer>
    </div>
  )
}

export default MyCouncilActivityPage
