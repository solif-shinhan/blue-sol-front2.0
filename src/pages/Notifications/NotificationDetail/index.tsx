import { useState, useEffect } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import styles from './NotificationDetail.module.css'
import {
  getNotificationDetail,
  markNotificationAsRead,
  type NotificationDetail,
} from '@/services'

// 시간 포맷 함수
function formatDateTime(dateString: string): string {
  const date = new Date(dateString)
  return date.toLocaleString('ko-KR', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
  }).replace(/\. /g, '.').replace(/, /g, ' ')
}

function NotificationDetailPage() {
  const navigate = useNavigate()
  const { id } = useParams<{ id: string }>()

  const [notification, setNotification] = useState<NotificationDetail | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchDetail = async () => {
      if (!id) return

      setIsLoading(true)
      setError(null)

      try {
        // 알림 상세 조회
        const response = await getNotificationDetail(Number(id))

        if (response.success) {
          setNotification(response.data)

          // 읽음 처리
          await markNotificationAsRead(Number(id))
        } else {
          setError(response.message || '알림을 불러오는데 실패했습니다.')
        }
      } catch (err) {
        console.error('알림 상세 조회 실패:', err)
        setError('알림을 불러오는데 실패했습니다.')
      } finally {
        setIsLoading(false)
      }
    }

    fetchDetail()
  }, [id])

  const handleBack = () => {
    navigate(-1)
  }

  if (isLoading) {
    return (
      <div className={styles.container}>
        <header className={styles.header}>
          <button className={styles.backButton} onClick={handleBack}>
            <svg viewBox="0 0 24 24" fill="none" stroke="#848484" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M15 18l-6-6 6-6" />
            </svg>
          </button>
          <span className={styles.headerTitle}>알림</span>
        </header>
        <div className={styles.loadingState}>
          <p>로딩 중...</p>
        </div>
      </div>
    )
  }

  if (error || !notification) {
    return (
      <div className={styles.container}>
        <header className={styles.header}>
          <button className={styles.backButton} onClick={handleBack}>
            <svg viewBox="0 0 24 24" fill="none" stroke="#848484" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M15 18l-6-6 6-6" />
            </svg>
          </button>
          <span className={styles.headerTitle}>알림</span>
        </header>
        <div className={styles.emptyState}>
          <div className={styles.emptyIcon}>404</div>
          <p className={styles.emptyText}>{error || '알림을 찾을 수 없습니다'}</p>
        </div>
      </div>
    )
  }

  // 발신자 타입 결정
  const senderType = notification.notificationType === 'NOTICE' ? 'organization' : 'person'
  const senderName = notification.notificationType === 'NOTICE' ? '신한장학재단' : '알림'

  return (
    <div className={styles.container}>
      <header className={styles.header}>
        <button className={styles.backButton} onClick={handleBack}>
          <svg viewBox="0 0 24 24" fill="none" stroke="#848484" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M15 18l-6-6 6-6" />
          </svg>
        </button>
        <span className={styles.headerTitle}>알림</span>
      </header>

      <div className={styles.content}>
        <div className={styles.senderSection}>
          <div className={`${styles.senderAvatar} ${senderType === 'person' ? styles.senderAvatarPerson : ''}`}>
            {senderType === 'organization' ? (
              <svg viewBox="0 0 24 24" fill="none">
                <path d="M12 2L2 7V17L12 22L22 17V7L12 2Z" fill="white"/>
              </svg>
            ) : (
              <span className={styles.senderAvatarText}>{senderName.charAt(0)}</span>
            )}
          </div>
          <div className={styles.senderInfo}>
            <span className={styles.senderName}>{senderName}</span>
            <span className={styles.senderTime}>{formatDateTime(notification.createdAt)}</span>
          </div>
        </div>

        <div className={styles.titleSection}>
          <h1 className={styles.notificationTitle}>{notification.notificationTitle}</h1>
        </div>

        <div className={styles.bodySection}>
          <div className={styles.contentSection}>
            <p className={styles.sectionContent}>{notification.notificationContent}</p>
          </div>

          {notification.images && notification.images.length > 0 && (
            <div className={styles.imageSection}>
              {notification.images.map(image => (
                <img key={image.imageId} src={image.imageUrl} alt="" />
              ))}
            </div>
          )}
        </div>

        {notification.targetType && notification.targetId && (
          <div className={styles.ctaSection}>
            <button
              className={styles.ctaButton}
              onClick={() => {
                // targetType에 따라 적절한 페이지로 이동
                if (notification.targetType === 'MESSAGE') {
                  navigate(`/notifications/activity/${notification.targetId}`)
                } else {
                  navigate('/home')
                }
              }}
            >
              자세히 보기
            </button>
          </div>
        )}
      </div>
    </div>
  )
}

export default NotificationDetailPage
