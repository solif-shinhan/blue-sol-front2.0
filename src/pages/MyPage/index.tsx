import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import styles from './MyPage.module.css'
import backArrowIcon from '@/assets/images/mypage/23dfd6e669ddf936888f8270626f127c011faae6.svg'
import chartDonutSvg from '@/assets/images/mypage/8b23fd361e57d34d2357c54920ff44e4c609c123.svg'
import chartSubtractImg from '@/assets/images/mypage/39327194044d48aceaa2afe1017c4efd5babb5ef.png'
import eyeIcon from '@/assets/images/mypage/5ee4482a7735287a01617616a79602ddf46984c6.svg'
import chatIcon from '@/assets/images/mypage/636ff7bb5ea9cb72d6a37d3ba76abca29b6facbd.svg'
import dividerSvg from '@/assets/images/mypage/b099e6393132d16bccfec66525724723fa6b700d.svg'
import footerLogoImg from '@/assets/images/mypage/057453724e8f804d5306e38ceabfcf7513cbed10.png'
import { getProfile, ProfileData } from '@/services/profileService'
import { logout } from '@/services/authService'

const ACTIVITIES = [
  {
    id: 1,
    category: '제주 자치회',
    title: '우리들의 첫 만남',
    description: '제주 지역 자치회 구성원들이 처음으로 모이는 자리였습니다. 서로 다른 배경을..',
    likes: 25,
    comments: 8,
    date: '2025.12.26',
    thumbnail: '/board-thumb-3.jpg',
  },
  {
    id: 2,
    category: '제주 자치회',
    title: '공모전 준비 후기',
    description: '공모전을 준비하면서 아이디어를 구체화하는 과정이 가장 어려웠습니다. 처음에는..',
    likes: 25,
    comments: 8,
    date: '2026.02.19',
    thumbnail: '/board-thumb-1.jpg',
  },
  {
    id: 3,
    category: '제주 자치회',
    title: '봉사활동 다녀온 후',
    description: '자치회 구성원들과 함께 봉사활동에 참여했습니다. 단순히 활동을 수행하는 것..',
    likes: 25,
    comments: 8,
    date: '2026.01.28',
    thumbnail: '/board-thumb-2.jpg',
  },
]

function MyPagePage() {
  const navigate = useNavigate()
  const [profile, setProfile] = useState<ProfileData | null>(null)

  useEffect(() => {
    const loadData = async () => {
      const profileRes = await getProfile().catch(() => null)
      if (profileRes?.success) {
        setProfile(profileRes.data)
      }
    }
    loadData()
  }, [])

  const userName = profile?.userName || '사용자'
  const userRole = profile?.solidGoalName || ''
  const characterImageUrl = profile?.characterImageUrl || ''

  const handleLogout = async () => {
    await logout()
    navigate('/login')
  }

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <div className={styles.headerInner}>
          <div className={styles.headerLeft}>
            <button className={styles.backButton} onClick={() => navigate(-1)}>
              <img src={backArrowIcon} alt="뒤로" />
            </button>
            <span className={styles.headerTitle}>마이페이지</span>
          </div>
        </div>
      </div>

      <div className={styles.content}>
        <div className={styles.profileGradient}>
          <div className={styles.avatarFrame}>
            {characterImageUrl && (
              <img src={characterImageUrl} alt="" className={styles.avatarImage} />
            )}
          </div>
          <div className={styles.profileBottom}>
            <div className={styles.profileNameGroup}>
              <span className={styles.profileName}>{userName}</span>
              <span className={styles.profileRole}>{userRole}</span>
            </div>
            <button className={styles.editSolidButton} onClick={() => navigate('/onboarding')}>
              <span>나의 SOLID 수정</span>
            </button>
          </div>
        </div>

        <section className={styles.dashboardSection}>
          <div className={styles.sectionHeader}>
            <span className={styles.sectionTitle}>활동 대시보드</span>
          </div>
          <div className={styles.dashboardCard}>
            <div className={styles.dashboardInner}>
              <div className={styles.dashboardLeft}>
                <div className={styles.userTypeGroup}>
                  <span className={styles.userTypeLabel}>{userName} 님은</span>
                  <span className={styles.userType}>마당발 네트워커</span>
                </div>
                <div className={styles.statsRow}>
                  <div className={styles.statItem}>
                    <span className={styles.statValue}>70</span>
                    <span className={styles.statLabel}>연결</span>
                  </div>
                  <div className={styles.statItem}>
                    <span className={styles.statValue}>10</span>
                    <span className={styles.statLabel}>성장</span>
                  </div>
                  <div className={styles.statItem}>
                    <span className={styles.statValue}>20</span>
                    <span className={styles.statLabel}>기여</span>
                  </div>
                </div>
              </div>
              <div className={styles.chartArea}>
                <div className={styles.chartDonut}>
                  <img src={chartDonutSvg} alt="" />
                </div>
                <div className={styles.chartSubtract}>
                  <img src={chartSubtractImg} alt="" />
                </div>
                <div className={`${styles.chartTag} ${styles.chartTagConnection}`}>
                  <span>연결</span>
                </div>
                <div className={`${styles.chartTag} ${styles.chartTagGrowth}`}>
                  <span>성장</span>
                </div>
                <div className={`${styles.chartTag} ${styles.chartTagContribution}`}>
                  <span>기여</span>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section className={styles.activitySection}>
          <div className={styles.activityHeader}>
            <span className={styles.sectionTitle}>나의 지난 활동</span>
            <button className={styles.councilButton}>나의 자치회</button>
          </div>
          <div className={styles.activityList}>
            {ACTIVITIES.map((activity) => (
              <div key={activity.id} className={styles.activityRow}>
                <div className={styles.activityRowContent}>
                  <div className={styles.activityMeta}>
                    <span className={styles.activityCategory}>{activity.category}</span>
                    <div className={styles.metaDivider}>
                      <img src={dividerSvg} alt="" />
                    </div>
                    <div className={styles.metaStats}>
                      <div className={styles.metaStatGroup}>
                        <div className={styles.metaIcon}>
                          <img src={eyeIcon} alt="" />
                        </div>
                        <span className={styles.metaStatValue}>{activity.likes}</span>
                      </div>
                      <div className={styles.metaStatGroup}>
                        <div className={styles.metaIcon}>
                          <img src={chatIcon} alt="" />
                        </div>
                        <span className={styles.metaStatValue}>{activity.comments}</span>
                      </div>
                    </div>
                    <div className={styles.metaDivider}>
                      <img src={dividerSvg} alt="" />
                    </div>
                    <span className={styles.metaDate}>{activity.date}</span>
                  </div>
                  <div className={styles.activityTextGroup}>
                    <span className={styles.activityTitle}>{activity.title}</span>
                    <p className={styles.activityDesc}>{activity.description}</p>
                  </div>
                </div>
                {activity.thumbnail && (
                  <div className={styles.activityThumb}>
                    <img src={activity.thumbnail} alt="" />
                  </div>
                )}
              </div>
            ))}
          </div>
        </section>

        <footer className={styles.footer}>
          <button className={styles.footerButton} onClick={handleLogout}>
            <span className={styles.footerButtonText}>로그아웃</span>
          </button>
          <button className={styles.footerButton}>
            <img src={footerLogoImg} alt="신한장학재단" className={styles.footerLogoImg} />
          </button>
        </footer>
      </div>
    </div>
  )
}

export default MyPagePage
