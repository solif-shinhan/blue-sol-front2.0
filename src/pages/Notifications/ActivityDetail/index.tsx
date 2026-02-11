import { useState, useEffect } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import styles1 from './ActivityDetail.module.css'
import styles2 from './ActivityDetail-2.module.css'
import { BackHeader } from '@/components/BackHeader'
import {
  getNotificationDetail,
  markNotificationAsRead,
  deleteMessage,
  type NotificationDetail,
} from '@/services'

const styles = { ...styles1, ...styles2 }

const API_BASE = import.meta.env.VITE_API_URL || ''
const toFullUrl = (path: string | null | undefined): string | undefined => {
  if (!path) return undefined
  if (path.startsWith('http') || path.startsWith('blob')) return path
  return `${API_BASE}/${path}`
}

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
    if (notification?.targetId) {
      navigate(`/exchange/network/add/${notification.targetId}`)
    }
  }

  const handleSendMessage = () => {
    if (!notification) return
    const name = notification.senderName || ''
    const userId = notification.targetId || ''
    navigate(`/notifications/message/compose?to=${encodeURIComponent(name)}&userId=${userId}`)
  }

  const handleDelete = async () => {
    if (!id) return
    if (!confirm('쪽지를 삭제하시겠습니까?')) return
    try {
      const res = await deleteMessage(Number(id))
      if (res.success) {
        navigate('/notifications?tab=activity&sub=message')
      }
    } catch {
      alert('삭제에 실패했습니다.')
    }
  }

  const handleReply = () => {
    if (!notification) return
    const name = notification.senderName || ''
    const targetId = notification.targetId || ''
    navigate(`/notifications/message/compose?to=${encodeURIComponent(name)}&userId=${targetId}`)
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
    : (notification.notificationType === 'NETWORK' || notification.notificationType === 'HELP') ? '교류'
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

  // 교류 (경험 나누기, 응원하기) 상세 - Figma 매칭
  if (category === '교류') {
    const headerTitle = notification.notificationTitle?.includes('경험') ? '경험 나누기'
      : notification.notificationTitle?.includes('응원') ? '응원하기'
      : '교류'

    const renderContentWithHighlights = (text: string) => {
      const parts = text.split(/(#\S+)/g)
      return parts.map((part, i) =>
        part.startsWith('#')
          ? <span key={i} className={styles.networkHighlight}>{part}</span>
          : part
      )
    }

    return (
      <div className={styles.container}>
        <BackHeader title={headerTitle} />

        <div className={styles.networkContent}>
          <div className={styles.networkSenderSection}>
            <div className={styles.networkSenderInfo}>
              <div className={styles.networkSenderLeft}>
                <div className={styles.networkAvatar}>
                  {notification.senderProfileImage ? (
                    <img src={toFullUrl(notification.senderProfileImage)} alt="" />
                  ) : (
                    <span className={styles.networkAvatarText}>
                      {(notification.senderName || '?').charAt(0)}
                    </span>
                  )}
                </div>
                <span className={styles.networkSenderName}>
                  {notification.senderName || '알 수 없음'}
                </span>
              </div>
              <span className={styles.networkTime}>
                {formatTime(notification.createdAt)}
              </span>
            </div>
            <h1 className={styles.networkTitle}>
              {notification.notificationTitle}
            </h1>
          </div>

          <div className={styles.networkBody}>
            <p className={styles.networkBodyText}>
              {renderContentWithHighlights(notification.notificationContent)}
            </p>
          </div>
        </div>

        <div className={styles.networkCtaSection}>
          <button className={styles.networkCtaPrimary} onClick={handleViewSolid}>
            SOLID 보기
          </button>
          <button className={styles.networkCtaSecondary} onClick={handleSendMessage}>
            쪽지
          </button>
        </div>
      </div>
    )
  }

  // 자치회 활동 등 기타 활동 상세
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
      </div>
    </div>
  )
}

export default ActivityDetailPage
