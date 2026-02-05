import { useMemo } from 'react'
import { useNavigate } from 'react-router-dom'
import styles from './MyPage.module.css'
import bellIcon from '@/assets/images/bell.svg'

const ACTIVITIES = [
  {
    id: 1,
    category: '제주 자치회',
    title: '우리들의 첫 만남',
    likes: 25,
    comments: 8,
    date: '2025.02.19',
    image: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=400'
  },
  {
    id: 2,
    category: '제주 자치회',
    title: '친구들과 함께하는 스터디',
    likes: 25,
    comments: 8,
    date: '2025.02.19',
    image: 'https://images.unsplash.com/photo-1519681393784-d120267933ba?w=400'
  },
  {
    id: 3,
    category: '제주 자치회',
    title: '봉사활동 다녀온 후',
    likes: 25,
    comments: 8,
    date: '2025.02.19',
    image: 'https://images.unsplash.com/photo-1501785888041-af3ef285b470?w=400'
  }
]

function MyPagePage() {
  const navigate = useNavigate()

  const userData = useMemo(() => {
    const userName = localStorage.getItem('userName')
    const registerData = localStorage.getItem('registerData')
    const parsed = registerData ? JSON.parse(registerData) : {}

    return {
      name: userName || parsed.name || '사용자',
      userType: '밸런스형 리더형',
      stats: {
        connection: 70,
        growth: 20,
        contribution: 10
      }
    }
  }, [])

  const handleTabClick = (tab: string) => {
    if (tab === '홈') navigate('/home')
    else if (tab === '교류') navigate('/exchange')
    else if (tab === '성장') navigate('/growth')
  }

  const handleEditSolid = () => {
    navigate('/home')
  }

  return (
    <div className={styles.container}>
      <nav className={styles.tabNav}>
        <div className={styles.tabs}>
          <button className={styles.tab} onClick={() => handleTabClick('홈')}>홈</button>
          <button className={styles.tab} onClick={() => handleTabClick('교류')}>교류</button>
          <button className={styles.tab} onClick={() => handleTabClick('성장')}>성장</button>
        </div>
        <div className={styles.tabNavRight}>
          <button className={styles.iconButton} onClick={() => navigate('/notifications')}>
            <img src={bellIcon} alt="알림" width={28} height={28} />
          </button>
          <div className={styles.profileCircle}></div>
        </div>
      </nav>

      <div className={styles.content}>
        <div className={styles.profileSection}>
          <div className={styles.avatar}></div>
          <div className={styles.profileInfo}>
            <span className={styles.profileName}>{userData.name}</span>
            <button className={styles.editSolidButton} onClick={handleEditSolid}>
              <span>나의 SOLID 수정</span>
            </button>
          </div>
        </div>

        <div className={styles.divider}></div>

        <div className={styles.dashboardSection}>
          <div className={styles.sectionHeader}>
            <span className={styles.sectionTitle}>활동 대시보드</span>
          </div>
          <div className={styles.dashboardCard}>
            <div className={styles.dashboardContent}>
              <div className={styles.userTypeSection}>
                <span className={styles.userTypeLabel}>{userData.name} 님은</span>
                <span className={styles.userType}>{userData.userType}</span>
              </div>
              <div className={styles.statsRow}>
                <div className={styles.statItem}>
                  <span className={styles.statValue}>{userData.stats.connection}</span>
                  <span className={styles.statLabel}>연결</span>
                </div>
                <div className={styles.statItem}>
                  <span className={styles.statValue}>{userData.stats.growth}</span>
                  <span className={styles.statLabel}>성장</span>
                </div>
                <div className={styles.statItem}>
                  <span className={styles.statValue}>{userData.stats.contribution}</span>
                  <span className={styles.statLabel}>기여</span>
                </div>
              </div>
            </div>
            <div className={styles.pieChart}>
              <svg viewBox="0 0 126 126" fill="none">
                <circle cx="63" cy="63" r="50" stroke="#E6E6E6" strokeWidth="20" fill="none" />
                <circle
                  cx="63"
                  cy="63"
                  r="50"
                  stroke="#074ED8"
                  strokeWidth="20"
                  fill="none"
                  strokeDasharray="220 314"
                  strokeLinecap="round"
                  transform="rotate(-90 63 63)"
                />
                <circle
                  cx="63"
                  cy="63"
                  r="50"
                  stroke="#C5ED52"
                  strokeWidth="20"
                  fill="none"
                  strokeDasharray="63 314"
                  strokeDashoffset="-220"
                  strokeLinecap="round"
                  transform="rotate(-90 63 63)"
                />
                <circle
                  cx="63"
                  cy="63"
                  r="50"
                  stroke="#848484"
                  strokeWidth="20"
                  fill="none"
                  strokeDasharray="31 314"
                  strokeDashoffset="-283"
                  strokeLinecap="round"
                  transform="rotate(-90 63 63)"
                />
              </svg>
            </div>
          </div>
        </div>

        <div className={styles.activitySection}>
          <div className={styles.activityHeader}>
            <span className={styles.sectionTitle}>나의 지난 활동</span>
            <button className={styles.moreButton}>더보기</button>
          </div>
          <div className={styles.activityList}>
            {ACTIVITIES.map(activity => (
              <div key={activity.id} className={styles.activityCard}>
                <div className={styles.activityCardBg}>
                  <img src={activity.image} alt="" />
                </div>
                <div className={styles.activityCardOverlay}></div>
                <div className={styles.activityCardContent}>
                  <div className={styles.activityInfo}>
                    <div className={styles.activityTextGroup}>
                      <span className={styles.activityCategory}>{activity.category}</span>
                      <span className={styles.activityTitle}>{activity.title}</span>
                    </div>
                    <div className={styles.activityMeta}>
                      <div className={styles.activityStats}>
                        <svg className={styles.activityStatIcon} viewBox="0 0 18 18" fill="none">
                          <path d="M9 16C9 16 2 11 2 6.5C2 4 4 2 6.5 2C7.5 2 8.5 2.5 9 3C9.5 2.5 10.5 2 11.5 2C14 2 16 4 16 6.5C16 11 9 16 9 16Z" stroke="#C8C8C8" strokeWidth="1.5" fill="none"/>
                        </svg>
                        <span className={styles.activityStatValue}>{activity.likes}</span>
                      </div>
                      <div className={styles.activityStats}>
                        <svg className={styles.activityStatIcon} viewBox="0 0 18 18" fill="none">
                          <path d="M16 9C16 12.866 12.866 16 9 16C7.5 16 6.1 15.6 5 14.9L2 16L3.1 13C2.4 11.9 2 10.5 2 9C2 5.134 5.134 2 9 2C12.866 2 16 5.134 16 9Z" stroke="#C8C8C8" strokeWidth="1.5" fill="none"/>
                        </svg>
                        <span className={styles.activityStatValue}>{activity.comments}</span>
                      </div>
                      <div className={styles.activityDivider}></div>
                      <span className={styles.activityDate}>{activity.date}</span>
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

export default MyPagePage
