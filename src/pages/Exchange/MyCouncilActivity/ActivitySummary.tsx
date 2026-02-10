import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import styles1 from './MyCouncilActivity-1.module.css'
import styles2 from './MyCouncilActivity-2.module.css'
const styles = { ...styles1, ...styles2 }
import characterImg from '@/assets/images/council/05c33597452e16877b22a6b65e9a1498c1d8e724.png'
import newsIconImg from '@/assets/images/council/bbdba2deec99e2a96b161b98577dda532cef5ac0.png'
import metaDividerIcon from '@/assets/images/myactivitysummary/Vector 13 (Stroke).svg'
import { councilReviewPostApi, CouncilReviewPostSummary } from '@/api/api-3'

interface ActivitySummaryProps {
  councilId: number
  councilName: string
  currentBudget: number
  totalBudget: number
  activityCount: number
  monthsSinceCreation: number
}

const API_BASE = import.meta.env.VITE_API_URL || 'https://stg-api.bluesol.site'
const toFullUrl = (path: string | null | undefined): string | undefined => {
  if (!path) return undefined
  if (path.startsWith('http')) return path
  return `${API_BASE}/${path}`
}

function ActivitySummary({ councilId, councilName, currentBudget, totalBudget, activityCount, monthsSinceCreation }: ActivitySummaryProps) {
  const navigate = useNavigate()
  const [pastActivities, setPastActivities] = useState<CouncilReviewPostSummary[]>([])

  useEffect(() => {
    const fetchActivities = async () => {
      try {
        const res = await councilReviewPostApi.getList(councilId, { page: 0, size: 5 })
        if (res.success && res.data) {
          const raw = res.data
          const list = (raw as any)?.content ?? (Array.isArray(raw) ? raw : [])
          setPastActivities(list)
        }
      } catch (err) {
        console.error('활동 후기 조회 실패:', err)
      }
    }
    fetchActivities()
  }, [councilId])

  const budgetUsedPercent = totalBudget > 0
    ? Math.round(((totalBudget - currentBudget) / totalBudget) * 100)
    : 0
  const budgetRemainingPercent = 100 - budgetUsedPercent

  const formatCurrency = (value: number) => {
    return value.toLocaleString('ko-KR') + '원'
  }

  const formatDate = (dateStr: string) => {
    if (!dateStr) return ''
    return dateStr.slice(0, 10).replace(/-/g, '.')
  }

  return (
    <>
      <div className={styles.activitySummary}>
        <div className={styles.activityCount}>
          <div className={styles.activityCountText}>
            {monthsSinceCreation}개월 동안 우리는<br />
            <span className={styles.activityCountHighlight}>{activityCount}개 활동</span>을 함께 했어요
          </div>
        </div>
        <div className={styles.activityCharacter}>
          <img src={characterImg} alt="" />
        </div>
      </div>

      <div className={styles.budgetSection}>
        <div className={styles.budgetRow}>
          <span className={styles.budgetLabel}>남은 예산</span>
          <span className={styles.budgetValue}>{formatCurrency(currentBudget)}</span>
        </div>
        <div className={styles.budgetBar}>
          <div className={styles.budgetBarFill} style={{ width: `${budgetRemainingPercent}%` }} />
        </div>
      </div>

      <div className={styles.newsSection}>
        <h2 className={styles.newsSectionTitle}>새로운 소식</h2>
        <div className={styles.newsCard}>
          <div className={styles.newsCardContent}>
            <p className={styles.newsCardTitle}>따뜻한 활동 후기가 도착했어요</p>
            <p className={styles.newsCardSubtitle}>릴레이로 후기를 작성해볼까요?</p>
          </div>
          <div className={styles.newsCardIcon}>
            <img src={newsIconImg} alt="" />
          </div>
        </div>
      </div>

      <div className={styles.pastSection}>
        <div className={styles.pastSectionHeader}>
          <h2 className={styles.pastSectionTitle}>지난 활동</h2>
          <button className={styles.pastSectionLink} onClick={() => navigate('/exchange/board')}>활동 게시판</button>
        </div>
        <div className={styles.pastList}>
          {pastActivities.length === 0 ? (
            <div style={{ padding: '20px', textAlign: 'center', color: '#848484', fontSize: '14px' }}>
              아직 활동 후기가 없습니다.
            </div>
          ) : (
            pastActivities.map((activity) => (
              <div
                key={activity.councilReviewPostId}
                className={styles.pastItem}
                onClick={() => navigate(`/exchange/council/review/${activity.councilReviewPostId}`)}
                style={{ cursor: 'pointer' }}
              >
                <div className={styles.pastItemContent}>
                  <div className={styles.pastItemMeta}>
                    <span className={styles.pastItemRegion}>{councilName}</span>
                    <img src={metaDividerIcon} alt="" className={styles.pastItemMetaDivider} />
                    <div className={styles.pastItemStats}>
                      <div className={styles.pastItemStat}>
                        <img src="/eyes.svg" alt="" className={styles.pastItemStatIcon} />
                        <span className={styles.pastItemStatText}>{activity.viewCount}</span>
                      </div>
                      <div className={styles.pastItemStat}>
                        <img src="/talk.svg" alt="" className={styles.pastItemStatIcon} />
                        <span className={styles.pastItemStatText}>{activity.commentCount}</span>
                      </div>
                    </div>
                    <img src={metaDividerIcon} alt="" className={styles.pastItemMetaDivider} />
                    <span className={styles.pastItemDate}>{formatDate(activity.createdAt)}</span>
                  </div>
                  <div className={styles.pastItemInfo}>
                    <h3 className={styles.pastItemTitle}>{activity.postTitle}</h3>
                    <p className={styles.pastItemDescription}>{activity.activityLocation || ''}</p>
                  </div>
                </div>
                {activity.thumbnailImageUrl && (
                  <img src={toFullUrl(activity.thumbnailImageUrl)} alt="" className={styles.pastItemThumb} />
                )}
              </div>
            ))
          )}
        </div>
      </div>
    </>
  )
}

export default ActivitySummary
