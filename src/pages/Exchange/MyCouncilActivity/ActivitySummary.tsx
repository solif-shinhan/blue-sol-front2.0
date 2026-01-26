import styles from './MyCouncilActivity.module.css'
import councilBg from '@/assets/images/council-activities.png'
import activityDotsImg from '@/assets/images/myactivitysummary/Frame 2087338740.svg'
import newsIcon from '@/assets/images/myactivitysummary/Frame 17.svg'
import metaDividerIcon from '@/assets/images/myactivitysummary/Vector 13 (Stroke).svg'

const PAST_ACTIVITIES = [
  { id: 1, region: '제주 자치회', title: '우리들의 첫 만남', views: 25, comments: 8, date: '2025.02.19' },
  { id: 2, region: '제주 자치회', title: '친구들과 함께하는 스터디', views: 25, comments: 8, date: '2025.02.19' },
  { id: 3, region: '제주 자치회', title: '봉사활동 다녀온 후', views: 25, comments: 8, date: '2025.02.19' },
]

function ActivitySummary() {
  return (
    <>
      {/* 활동 요약 */}
      <div className={styles.activitySummary}>
        <div className={styles.activityCount}>
          <div className={styles.activityCountText}>
            <span>6개월 동안 우리는</span><br />
            <span className={styles.activityCountHighlight}>8개 활동</span>
            <span>을 함께 했어요</span>
          </div>
          <div className={styles.activityDots}>
            <img src={activityDotsImg} alt="" />
          </div>
        </div>

        <div className={styles.budgetSection}>
          <div className={styles.budgetRow}>
            <span>남은 예산</span>
            <span>110,840원</span>
          </div>
          <div className={styles.budgetBar}>
            <div className={styles.budgetBarFill} style={{ width: '65%' }} />
          </div>
        </div>
      </div>

      {/* 새로운 소식 */}
      <div className={styles.newsSection}>
        <h2 className={styles.newsSectionTitle}>새로운 소식</h2>
        <div className={styles.newsCard}>
          <div className={styles.newsCardContent}>
            <p className={styles.newsCardTitle}>따뜻한 활동 후기가 도착했어요</p>
            <p className={styles.newsCardSubtitle}>릴레이로 후기를 작성해볼까요?</p>
          </div>
          <div className={styles.newsCardIcon}>
            <img src={newsIcon} alt="" />
          </div>
        </div>
      </div>

      {/* 지난 활동 */}
      <div className={styles.pastSection}>
        <div className={styles.pastSectionHeader}>
          <h2 className={styles.pastSectionTitle}>지난 활동</h2>
          <button className={styles.pastSectionLink}>활동 게시판</button>
        </div>
        <div className={styles.pastList}>
          {PAST_ACTIVITIES.map((activity) => (
            <div key={activity.id} className={styles.pastCard}>
              <div className={styles.pastCardBg}>
                <img src={councilBg} alt="" />
                <div className={styles.pastCardOverlay} />
              </div>
              <div className={styles.pastCardContent}>
                <div className={styles.pastCardTitles}>
                  <p className={styles.pastCardRegion}>{activity.region}</p>
                  <p className={styles.pastCardName}>{activity.title}</p>
                </div>
                <div className={styles.pastCardMeta}>
                  <div className={styles.pastCardStats}>
                    <div className={styles.pastCardStat}>
                      <img src="/eyes.svg" alt="" className={styles.pastCardStatIcon} />
                      <span className={styles.pastCardStatText}>{activity.views}</span>
                    </div>
                    <div className={styles.pastCardStat}>
                      <img src="/talk.svg" alt="" className={styles.pastCardStatIcon} />
                      <span className={styles.pastCardStatText}>{activity.comments}</span>
                    </div>
                  </div>
                  <img src={metaDividerIcon} alt="" className={styles.pastCardMetaDivider} />
                  <span className={styles.pastCardDate}>{activity.date}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </>
  )
}

export default ActivitySummary
