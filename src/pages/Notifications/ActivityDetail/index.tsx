import { useState, useEffect } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import styles from './ActivityDetail.module.css'
import {
  getNotificationDetail,
  markNotificationAsRead,
  type NotificationDetail,
} from '@/services'

function formatTime(dateString: string): string {
  const date = new Date(dateString)
  const now = new Date()
  const diffMs = now.getTime() - date.getTime()
  const diffMin = Math.floor(diffMs / (1000 * 60))
  const diffHour = Math.floor(diffMs / (1000 * 60 * 60))
  const diffDay = Math.floor(diffMs / (1000 * 60 * 60 * 24))

  if (diffMin < 1) return '방금 전'
  if (diffMin < 60) return `${diffMin}분 전`
  if (diffHour < 24) return `${diffHour}시간 전`
  if (diffDay < 7) return `${diffDay}일 전`
  return date.toLocaleDateString('ko-KR')
}

function ActivityDetailPage() {
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
        const response = await getNotificationDetail(Number(id))

        if (response.success) {
          setNotification(response.data)
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

  const handleViewSolid = () => {
    navigate('/home')
  }

  const handleSendMessage = () => {
    console.log('Send message')
  }

  const handleDelete = () => {
    // TODO: 쪽지 삭제 API 호출
    console.log('Delete message', id)
  }

  const handleReply = () => {
    const name = notification?.senderName || ''
    navigate(`/notifications/message/compose${name ? `?to=${encodeURIComponent(name)}` : ''}`)
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
        </header>
        <div className={styles.emptyState}>
          <div className={styles.emptyIcon}>404</div>
          <p className={styles.emptyText}>{error || '알림을 찾을 수 없습니다'}</p>
        </div>
      </div>
    )
  }

  const category = notification.notificationType === 'MESSAGE' ? '쪽지'
    : notification.notificationType === 'NETWORK' ? '교류'
    : notification.notificationType === 'COUNCIL' ? '자치회 활동'
    : '활동'

  // 쪽지 상세 렌더링
  if (category === '쪽지') {
    return (
      <div className={styles.container}>
        <header className={styles.messageHeader}>
          <button className={styles.backButton} onClick={handleBack}>
            <svg viewBox="0 0 24 24" fill="none" stroke="#848484" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M15 18l-6-6 6-6" />
            </svg>
          </button>
          <button className={styles.deleteButton} onClick={handleDelete}>
            <svg viewBox="0 0 24 24" fill="none" stroke="#848484" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
              <path d="M3 6h18" />
              <path d="M8 6V4a2 2 0 012-2h4a2 2 0 012 2v2" />
              <path d="M19 6l-1 14a2 2 0 01-2 2H8a2 2 0 01-2-2L5 6" />
              <path d="M10 11v6" />
              <path d="M14 11v6" />
            </svg>
          </button>
        </header>

        <div className={styles.content}>
          <div className={styles.messageSenderSection}>
            <div className={styles.messageSenderLeft}>
              <div className={styles.messageSenderAvatar}>
                {notification.senderProfileImage ? (
                  <img src={notification.senderProfileImage} alt={notification.senderName || ''} />
                ) : (
                  <span className={styles.messageSenderAvatarText}>
                    {(notification.senderName || '?').charAt(0)}
                  </span>
                )}
              </div>
              <span className={styles.messageSenderName}>
                {notification.senderName || '알 수 없음'}
              </span>
            </div>
            <span className={styles.messageSenderTime}>{formatTime(notification.createdAt)}</span>
          </div>

          <div className={styles.messageTitleSection}>
            <h1 className={styles.messageDetailTitle}>{notification.notificationTitle}</h1>
          </div>

          <div className={styles.messageBodySection}>
            <p className={styles.messageBodyText}>{notification.notificationContent}</p>
          </div>
        </div>

        <div className={styles.messageCtaSection}>
          <button className={styles.replyButton} onClick={handleReply}>
            답장하기
          </button>
        </div>
      </div>
    )
  }

  // 교류, 자치회 활동 등 기존 활동 상세
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
          <div className={styles.senderAvatar}>
            <span className={styles.senderAvatarText}>알</span>
          </div>
          <div className={styles.senderInfo}>
            <span className={styles.senderName}>알림</span>
            <span className={styles.senderTime}>{formatTime(notification.createdAt)}</span>
          </div>
        </div>

        <div className={styles.titleSection}>
          <h1 className={styles.activityTitle}>{notification.notificationTitle}</h1>
        </div>

        <div className={styles.bodySection}>
          <p className={styles.contentText}>{notification.notificationContent}</p>

          {notification.images && notification.images.length > 0 && (
            <div>
              {notification.images.map(image => (
                <img key={image.imageId} src={image.imageUrl} alt="" style={{ width: '100%', borderRadius: '12px' }} />
              ))}
            </div>
          )}

          {category === '자치회 활동' && (
            <div className={styles.activityStats}>
              <div className={styles.statItem}>
                <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
                  <path d="M9 16C9 16 2 11 2 6.5C2 4 4 2 6.5 2C7.5 2 8.5 2.5 9 3C9.5 2.5 10.5 2 11.5 2C14 2 16 4 16 6.5C16 11 9 16 9 16Z" stroke="#C8C8C8" strokeWidth="1.5" fill="none"/>
                </svg>
                <span>0</span>
              </div>
              <div className={styles.statItem}>
                <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
                  <path d="M16 9C16 12.866 12.866 16 9 16C7.5 16 6.1 15.6 5 14.9L2 16L3.1 13C2.4 11.9 2 10.5 2 9C2 5.134 5.134 2 9 2C12.866 2 16 5.134 16 9Z" stroke="#C8C8C8" strokeWidth="1.5" fill="none"/>
                </svg>
                <span>0</span>
              </div>
            </div>
          )}
        </div>

        {category === '교류' && (
          <div className={styles.ctaSection}>
            <button className={styles.ctaButtonPrimary} onClick={handleViewSolid}>
              SOLID 보기
            </button>
            <button className={styles.ctaButtonSecondary} onClick={handleSendMessage}>
              쪽지
            </button>
          </div>
        )}
      </div>
    </div>
  )
}

export default ActivityDetailPage
