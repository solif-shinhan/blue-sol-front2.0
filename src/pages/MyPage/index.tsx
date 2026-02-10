import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import styles1 from './MyPage-1.module.css'
import styles2 from './MyPage-2.module.css'
import styles3 from './MyPage-3.module.css'
import { BackHeader } from '@/components/BackHeader'
import dividerSvg from '@/assets/images/mypage/b099e6393132d16bccfec66525724723fa6b700d.svg'
import footerLogoImg from '@/assets/images/mypage/057453724e8f804d5306e38ceabfcf7513cbed10.png'
import { getProfile, ProfileData } from '@/services/profileService'
import { logout } from '@/services/authService'
import { myPageApi, MyPageResponse } from '@/api/api-2'
import DashboardChart from './DashboardChart'

const styles = { ...styles1, ...styles2, ...styles3 }

const API_BASE = import.meta.env.VITE_API_URL || 'https://stg-api.bluesol.site'
const toFullUrl = (path: string | null | undefined): string | undefined => {
  if (!path) return undefined
  if (path.startsWith('http')) return path
  return `${API_BASE}/${path}`
}

function MyPagePage() {
  const navigate = useNavigate()
  const [profile, setProfile] = useState<ProfileData | null>(null)
  const [myPageData, setMyPageData] = useState<MyPageResponse | null>(null)

  useEffect(() => {
    const loadData = async () => {
      const [profileRes, myPageRes] = await Promise.all([
        getProfile().catch(() => null),
        myPageApi.get().catch(() => null),
      ])
      if (profileRes?.success) {
        setProfile(profileRes.data)
      }
      if (myPageRes?.success && myPageRes.data) {
        setMyPageData(myPageRes.data)
      }
    }
    loadData()
  }, [])

  const userName = myPageData?.name || profile?.userName || '사용자'
  const userRole = myPageData?.solidGoalName || profile?.solidGoalName || ''
  const characterImageUrl = profile?.characterImageUrl || ''

  const dashboard = myPageData?.dashboard
  const connection = dashboard?.connection ?? 0
  const growth = dashboard?.growth ?? 0
  const contribution = dashboard?.contribution ?? 0
  const personaType = dashboard?.personaType || ''

  const recentReviews = myPageData?.recentCouncilReviews ?? []

  const handleLogout = async () => {
    await logout()
    navigate('/login')
  }

  const formatDate = (dateStr: string) => {
    if (!dateStr) return ''
    return dateStr.slice(0, 10).replace(/-/g, '.')
  }

  return (
    <div className={styles.container}>
      <BackHeader title="마이페이지" />

      <div className={styles.content}>
        <div className={styles.profileDashboardGroup}>
          <div
            className={styles.profileGradient}
            style={profile?.backgroundImageUrl ? { backgroundImage: `url(${profile.backgroundImageUrl})`, backgroundSize: 'cover', backgroundPosition: 'center' } : undefined}
          >
            <div
              className={styles.avatarFrame}
              style={profile?.backgroundImageUrl ? { backgroundImage: `url(${profile.backgroundImageUrl})`, backgroundSize: 'cover', backgroundPosition: 'center' } : undefined}
            >
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
              <div className={styles.dashboardLeft}>
                <div className={styles.userTypeGroup}>
                  <span className={styles.userTypeLabel}>{userName} 님은</span>
                  <span className={styles.userType}>{personaType || '활동가'}</span>
                </div>
                <div className={styles.statsRow}>
                  <div className={styles.statItem}>
                    <div className={`${styles.statBadge} ${styles.statBadgeBlue}`}>
                      <span className={`${styles.statValue} ${styles.statValueWhite}`}>{connection}</span>
                    </div>
                    <span className={styles.statLabel}>연결</span>
                  </div>
                  <div className={styles.statItem}>
                    <div className={`${styles.statBadge} ${styles.statBadgeLightBlue}`}>
                      <span className={`${styles.statValue} ${styles.statValueWhite}`}>{growth}</span>
                    </div>
                    <span className={styles.statLabel}>성장</span>
                  </div>
                  <div className={styles.statItem}>
                    <div className={`${styles.statBadge} ${styles.statBadgeLightBlueII}`}>
                      <span className={`${styles.statValue} ${styles.statValueBlue}`}>{contribution}</span>
                    </div>
                    <span className={styles.statLabel}>기여</span>
                  </div>
                </div>
              </div>
              <div className={styles.chartArea}>
                <DashboardChart
                  connection={connection}
                  growth={growth}
                  contribution={contribution}
                  characterImageUrl={characterImageUrl}
                />
              </div>
            </div>
          </section>
        </div>

        <section className={styles.activitySection}>
          <div className={styles.activityHeader}>
            <span className={styles.sectionTitle}>나의 지난 활동</span>
            <button className={styles.councilButton} onClick={() => navigate('/exchange/council/activity')}>나의 자치회</button>
          </div>
          <div className={styles.activityList}>
            {recentReviews.length === 0 ? (
              <div style={{ padding: '20px', textAlign: 'center', color: '#848484', fontSize: '14px' }}>
                아직 활동 후기가 없습니다.
              </div>
            ) : (
              recentReviews.map((review) => (
                <div
                  key={review.councilReviewPostId}
                  className={styles.activityRow}
                  onClick={() => navigate(`/exchange/council/review/${review.councilReviewPostId}`)}
                  style={{ cursor: 'pointer' }}
                >
                  <div className={styles.activityRowContent}>
                    <div className={styles.activityMeta}>
                      <span className={styles.activityCategory}>자치회 활동</span>
                      <div className={styles.metaDivider}>
                        <img src={dividerSvg} alt="" />
                      </div>
                      <span className={styles.metaDate}>{formatDate(review.activityDate)}</span>
                    </div>
                    <div className={styles.activityTextGroup}>
                      <span className={styles.activityTitle}>{review.title}</span>
                    </div>
                  </div>
                  {review.thumbnailImageUrl && (
                    <div className={styles.activityThumb}>
                      <img src={toFullUrl(review.thumbnailImageUrl)} alt="" />
                    </div>
                  )}
                </div>
              ))
            )}
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
