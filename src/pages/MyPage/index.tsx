import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import styles1 from './MyPage-1.module.css'
import styles2 from './MyPage-2.module.css'
import styles3 from './MyPage-3.module.css'
import backArrowIcon from '@/assets/images/mypage/23dfd6e669ddf936888f8270626f127c011faae6.svg'
import arcChartSvg from '@/assets/images/mypage/f075883f52928d0600a872719ed3b430bdb9ef2e.svg'
import eyeIcon from '@/assets/images/mypage/5ee4482a7735287a01617616a79602ddf46984c6.svg'
import chatIcon from '@/assets/images/mypage/636ff7bb5ea9cb72d6a37d3ba76abca29b6facbd.svg'
import dividerSvg from '@/assets/images/mypage/b099e6393132d16bccfec66525724723fa6b700d.svg'
import footerLogoImg from '@/assets/images/mypage/057453724e8f804d5306e38ceabfcf7513cbed10.png'
import { getProfile, ProfileData } from '@/services/profileService'
import { logout } from '@/services/authService'
import { getMyCouncil } from '@/services'
import { councilReviewPostApi, CouncilReviewPostSummary } from '@/api/api-3'

const styles = { ...styles1, ...styles2, ...styles3 }

function MyPagePage() {
  const navigate = useNavigate()
  const [profile, setProfile] = useState<ProfileData | null>(null)
  const [activities, setActivities] = useState<CouncilReviewPostSummary[]>([])
  const [councilName, setCouncilName] = useState('')

  useEffect(() => {
    const loadData = async () => {
      const profileRes = await getProfile().catch(() => null)
      if (profileRes?.success) {
        setProfile(profileRes.data)
      }

      const councilRes = await getMyCouncil().catch(() => null)
      if (councilRes?.success && councilRes.data) {
        setCouncilName(councilRes.data.name)
        const postsRes = await councilReviewPostApi.getList(councilRes.data.councilId, { page: 0, size: 10 }).catch(() => null)
        if (postsRes?.success && postsRes.data) {
          const raw = postsRes.data
          const list = raw?.content ?? (Array.isArray(raw) ? raw : [])
          setActivities(list)
        }
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
                  <span className={styles.userType}>마당발 네트워커</span>
                </div>
                <div className={styles.statsRow}>
                  <div className={styles.statItem}>
                    <div className={`${styles.statBadge} ${styles.statBadgeBlue}`}>
                      <span className={`${styles.statValue} ${styles.statValueWhite}`}>30</span>
                    </div>
                    <span className={styles.statLabel}>연결</span>
                  </div>
                  <div className={styles.statItem}>
                    <div className={`${styles.statBadge} ${styles.statBadgeLightBlue}`}>
                      <span className={`${styles.statValue} ${styles.statValueWhite}`}>20</span>
                    </div>
                    <span className={styles.statLabel}>성장</span>
                  </div>
                  <div className={styles.statItem}>
                    <div className={`${styles.statBadge} ${styles.statBadgeLightBlueII}`}>
                      <span className={`${styles.statValue} ${styles.statValueBlue}`}>10</span>
                    </div>
                    <span className={styles.statLabel}>기여</span>
                  </div>
                </div>
              </div>
              <div className={styles.chartArea}>
                <div className={styles.chartCharacter}>
                  {characterImageUrl && (
                    <img src={characterImageUrl} alt="" />
                  )}
                </div>
                <div className={styles.chartArc}>
                  <img src={arcChartSvg} alt="" />
                </div>
              </div>
            </div>
          </section>
        </div>

        <section className={styles.activitySection}>
          <div className={styles.activityHeader}>
            <span className={styles.sectionTitle}>나의 지난 활동</span>
            <button className={styles.councilButton}>나의 자치회</button>
          </div>
          <div className={styles.activityList}>
            {activities.map((post) => (
              <div key={post.councilReviewPostId} className={styles.activityRow}>
                <div className={styles.activityRowContent}>
                  <div className={styles.activityMeta}>
                    <span className={styles.activityCategory}>{councilName}</span>
                    <div className={styles.metaDivider}>
                      <img src={dividerSvg} alt="" />
                    </div>
                    <div className={styles.metaStats}>
                      <div className={styles.metaStatGroup}>
                        <div className={styles.metaIcon}>
                          <img src={eyeIcon} alt="" />
                        </div>
                        <span className={styles.metaStatValue}>{post.viewCount}</span>
                      </div>
                      <div className={styles.metaStatGroup}>
                        <div className={styles.metaIcon}>
                          <img src={chatIcon} alt="" />
                        </div>
                        <span className={styles.metaStatValue}>{post.commentCount}</span>
                      </div>
                    </div>
                    <div className={styles.metaDivider}>
                      <img src={dividerSvg} alt="" />
                    </div>
                    <span className={styles.metaDate}>{post.createdAt?.slice(0, 10).replace(/-/g, '.')}</span>
                  </div>
                  <div className={styles.activityTextGroup}>
                    <span className={styles.activityTitle}>{post.postTitle}</span>
                    <p className={styles.activityDesc}>{post.activityLocation || ''}</p>
                  </div>
                </div>
                {post.thumbnailImageUrl && (
                  <div className={styles.activityThumb}>
                    <img src={post.thumbnailImageUrl} alt="" />
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
