import styles1 from './MyCouncilActivity-1.module.css'
import styles2 from './MyCouncilActivity-2.module.css'
const styles = { ...styles1, ...styles2 }
import characterImg from '@/assets/images/council/05c33597452e16877b22a6b65e9a1498c1d8e724.png'
import newsIconImg from '@/assets/images/council/bbdba2deec99e2a96b161b98577dda532cef5ac0.png'
import thumb1 from '@/assets/images/council/27342ac6292fb7d2b87647841f5fab093bda09f6.png'
import thumb2 from '@/assets/images/council/cab8b7808d1d97f850dd3426c8d0c797a6635086.png'
import thumb3 from '@/assets/images/council/5c7309d017f9e322b8fc44af098ea915ecfa439b.png'
import metaDividerIcon from '@/assets/images/myactivitysummary/Vector 13 (Stroke).svg'

const PAST_ACTIVITIES = [
  {
    id: 1, region: '제주 자치회', title: '공모전 준비 후기',
    description: '공모전을 준비하면서 아이디어를 구체화하는 과정이 가장 어려웠습니다. 처음에는...',
    views: 25, comments: 8, date: '2026.02.19', thumb: thumb1,
  },
  {
    id: 2, region: '제주 자치회', title: '봉사활동 다녀온 후',
    description: '자치회 구성원들과 함께 봉사활동에 참여했습니다. 단순히 활동을 수행하는 것...',
    views: 25, comments: 8, date: '2026.01.28', thumb: thumb2,
  },
  {
    id: 3, region: '제주 자치회', title: '우리들의 첫 만남',
    description: '제주 지역 자치회 구성원들이 처음으로 모이는 자리였습니다. 서로 다른 배경을...',
    views: 25, comments: 8, date: '2025.12.26', thumb: thumb3,
  },
]

function ActivitySummary() {
  return (
    <>
      <div className={styles.activitySummary}>
        <div className={styles.activityCount}>
          <div className={styles.activityCountText}>
            6개월 동안 우리는<br />
            <span className={styles.activityCountHighlight}>4개 활동</span>을 함께 했어요
          </div>
        </div>
        <div className={styles.activityCharacter}>
          <img src={characterImg} alt="" />
        </div>
      </div>

      <div className={styles.budgetSection}>
        <div className={styles.budgetRow}>
          <span className={styles.budgetLabel}>남은 예산</span>
          <span className={styles.budgetValue}>110,840원</span>
        </div>
        <div className={styles.budgetBar}>
          <div className={styles.budgetBarFill} style={{ width: '65%' }} />
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
          <button className={styles.pastSectionLink}>활동 게시판</button>
        </div>
        <div className={styles.pastList}>
          {PAST_ACTIVITIES.map((activity) => (
            <div key={activity.id} className={styles.pastItem}>
              <div className={styles.pastItemContent}>
                <div className={styles.pastItemMeta}>
                  <span className={styles.pastItemRegion}>{activity.region}</span>
                  <img src={metaDividerIcon} alt="" className={styles.pastItemMetaDivider} />
                  <div className={styles.pastItemStats}>
                    <div className={styles.pastItemStat}>
                      <img src="/eyes.svg" alt="" className={styles.pastItemStatIcon} />
                      <span className={styles.pastItemStatText}>{activity.views}</span>
                    </div>
                    <div className={styles.pastItemStat}>
                      <img src="/talk.svg" alt="" className={styles.pastItemStatIcon} />
                      <span className={styles.pastItemStatText}>{activity.comments}</span>
                    </div>
                  </div>
                  <img src={metaDividerIcon} alt="" className={styles.pastItemMetaDivider} />
                  <span className={styles.pastItemDate}>{activity.date}</span>
                </div>
                <div className={styles.pastItemInfo}>
                  <h3 className={styles.pastItemTitle}>{activity.title}</h3>
                  <p className={styles.pastItemDescription}>{activity.description}</p>
                </div>
              </div>
              <img src={activity.thumb} alt="" className={styles.pastItemThumb} />
            </div>
          ))}
        </div>
      </div>
    </>
  )
}

export default ActivitySummary
