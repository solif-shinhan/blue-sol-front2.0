import styles from './Notifications.module.css'

function NotificationsPage() {
  return (
    <div className={styles.container}>
      <header className={styles.header}>
        <h1 className={styles.title}>알림</h1>
      </header>

      <div className={styles.tabs}>
        <button className={`${styles.tab} ${styles.active}`}>
          전체
        </button>
        <button className={styles.tab}>
          쪽지
          <span className={styles.badge}>3</span>
        </button>
        <button className={styles.tab}>
          소식
        </button>
      </div>

      <section className={styles.section}>
        <div className={styles.notificationList}>
          <div className={styles.notificationItem} data-unread="true">
            <div className={styles.notificationIcon}>💌</div>
            <div className={styles.notificationContent}>
              <p className={styles.notificationText}>
                <strong>김멘토</strong>님이 쪽지를 보냈습니다.
              </p>
              <span className={styles.notificationTime}>방금 전</span>
            </div>
            <div className={styles.notificationDot} />
          </div>

          <div className={styles.notificationItem} data-unread="true">
            <div className={styles.notificationIcon}>📢</div>
            <div className={styles.notificationContent}>
              <p className={styles.notificationText}>
                새로운 프로그램 <strong>"AI 역량 강화"</strong> 신청이 시작되었습니다.
              </p>
              <span className={styles.notificationTime}>1시간 전</span>
            </div>
            <div className={styles.notificationDot} />
          </div>

          <div className={styles.notificationItem}>
            <div className={styles.notificationIcon}>🎉</div>
            <div className={styles.notificationContent}>
              <p className={styles.notificationText}>
                축하합니다! 버킷리스트 목표를 달성했습니다.
              </p>
              <span className={styles.notificationTime}>어제</span>
            </div>
          </div>

          <div className={styles.notificationItem}>
            <div className={styles.notificationIcon}>👥</div>
            <div className={styles.notificationContent}>
              <p className={styles.notificationText}>
                <strong>이장학</strong>님이 친구 요청을 수락했습니다.
              </p>
              <span className={styles.notificationTime}>2일 전</span>
            </div>
          </div>

          <div className={styles.notificationItem}>
            <div className={styles.notificationIcon}>📝</div>
            <div className={styles.notificationContent}>
              <p className={styles.notificationText}>
                멘토링 후기를 작성해주세요.
              </p>
              <span className={styles.notificationTime}>3일 전</span>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}

export default NotificationsPage
