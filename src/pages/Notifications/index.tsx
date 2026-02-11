import { useState, useEffect } from 'react'
import { useNavigate, useSearchParams } from 'react-router-dom'
import styles from './Notifications.module.css'
import { BackHeader } from '@/components/BackHeader'
import {
  getNotifications,
  getUnreadCount,
  type NotificationItem,
  type NotificationCategory,
  type NotificationSubCategory,
  type NotificationFilter,
} from '@/services'

// 시간 포맷 함수
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

// 활동 서브카테고리 매핑
const SUB_CATEGORY_MAP: Record<string, NotificationSubCategory> = {
  '쪽지': 'MESSAGE',
  '교류': 'NETWORK',
  '자치회 활동': 'COUNCIL',
  '멘토링': 'MENTORING',
}


function NotificationsPage() {
  const navigate = useNavigate()
  const [searchParams] = useSearchParams()
  const [activeMainTab, setActiveMainTab] = useState<'공지사항' | '활동'>('공지사항')
  const [activeFilterTab, setActiveFilterTab] = useState<'전체' | '안읽음'>('전체')
  const [activeActivityTab, setActiveActivityTab] = useState<'쪽지' | '교류' | '자치회 활동' | '멘토링'>('쪽지')

  const [notifications, setNotifications] = useState<NotificationItem[]>([])
  const [unreadCount, setUnreadCount] = useState(0)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  // URL params에서 탭 상태 초기화
  useEffect(() => {
    const tab = searchParams.get('tab')
    const sub = searchParams.get('sub')
    if (tab === 'activity') {
      setActiveMainTab('활동')
      if (sub === 'message') setActiveActivityTab('쪽지')
      else if (sub === 'network') setActiveActivityTab('교류')
      else if (sub === 'council') setActiveActivityTab('자치회 활동')
      else if (sub === 'mentoring') setActiveActivityTab('멘토링')
    }
  }, [searchParams])

  // 알림 목록 조회
  const fetchNotifications = async () => {
    setIsLoading(true)
    setError(null)

    try {
      const category: NotificationCategory = activeMainTab === '공지사항' ? 'NOTICE' : 'ACTIVITY'
      const filter: NotificationFilter = activeFilterTab === '안읽음' ? 'UNREAD' : 'ALL'
      const subCategory = activeMainTab === '활동' ? SUB_CATEGORY_MAP[activeActivityTab] : undefined

      const response = await getNotifications({
        category,
        subCategory,
        filter,
        page: 0,
        size: 20,
      })

      if (response.success) {
        setNotifications(response.data.content)
      } else {
        setError(response.message || '알림을 불러오는데 실패했습니다.')
      }
    } catch (err: unknown) {
      const status = (err as { status?: number }).status
      if (status === 403) {
        setNotifications([])
      } else {
        setError('알림을 불러오는데 실패했습니다.')
      }
    } finally {
      setIsLoading(false)
    }
  }

  // 안읽은 알림 개수 조회
  const fetchUnreadCount = async () => {
    try {
      const response = await getUnreadCount()
      if (response.success) {
        setUnreadCount(response.data.unreadCount)
      }
    } catch (err) {
      console.error('안읽은 알림 개수 조회 실패:', err)
    }
  }

  useEffect(() => {
    fetchNotifications()
  }, [activeMainTab, activeFilterTab, activeActivityTab])

  useEffect(() => {
    fetchUnreadCount()
  }, [])


  const handleNotificationClick = (notification: NotificationItem) => {
    if (activeMainTab === '공지사항') {
      navigate(`/notifications/${notification.notificationId}`)
    } else {
      navigate(`/notifications/activity/${notification.notificationId}`)
    }
  }

  // 발신자 타입 결정 (공지사항은 organization, 활동은 person)
  const getSenderType = (notification: NotificationItem): 'organization' | 'person' => {
    return notification.notificationType === 'NOTICE' ? 'organization' : 'person'
  }

  // 발신자 이름 (공지사항은 신한장학재단)
  const getSenderName = (notification: NotificationItem): string => {
    return notification.notificationType === 'NOTICE' ? '신한장학재단' : '알림'
  }

  return (
    <div className={styles.container}>
      <BackHeader title="알림" />

      <div className={styles.content}>
        <div className={styles.tabSection}>
          <div className={styles.mainTabs}>
            <button
              className={`${styles.mainTab} ${activeMainTab === '공지사항' ? styles.mainTabActive : ''}`}
              onClick={() => setActiveMainTab('공지사항')}
            >
              공지사항
            </button>
            <button
              className={`${styles.mainTab} ${activeMainTab === '활동' ? styles.mainTabActive : ''}`}
              onClick={() => setActiveMainTab('활동')}
            >
              활동
            </button>
          </div>

          <div className={styles.filterTabs}>
            {activeMainTab === '활동' && (
              <>
                <button
                  className={`${styles.filterTab} ${activeActivityTab === '쪽지' ? styles.filterTabActive : ''}`}
                  onClick={() => setActiveActivityTab('쪽지')}
                >
                  쪽지
                </button>
                <button
                  className={`${styles.filterTab} ${activeActivityTab === '교류' ? styles.filterTabActive : ''}`}
                  onClick={() => setActiveActivityTab('교류')}
                >
                  교류
                </button>
                <button
                  className={`${styles.filterTab} ${activeActivityTab === '자치회 활동' ? styles.filterTabActive : ''}`}
                  onClick={() => setActiveActivityTab('자치회 활동')}
                >
                  자치회 활동
                </button>
                <button
                  className={`${styles.filterTab} ${activeActivityTab === '멘토링' ? styles.filterTabActive : ''}`}
                  onClick={() => setActiveActivityTab('멘토링')}
                >
                  멘토링
                </button>
              </>
            )}
            {activeMainTab === '공지사항' && (
              <>
                <button
                  className={`${styles.filterTab} ${activeFilterTab === '전체' ? styles.filterTabActive : ''}`}
                  onClick={() => setActiveFilterTab('전체')}
                >
                  전체
                </button>
                <button
                  className={`${styles.filterTab} ${activeFilterTab === '안읽음' ? styles.filterTabActive : ''}`}
                  onClick={() => setActiveFilterTab('안읽음')}
                >
                  안읽음 {unreadCount}
                </button>
              </>
            )}
          </div>
        </div>

        <div className={styles.notificationList}>
          {isLoading && (
            <div className={styles.loadingState}>
              <p>로딩 중...</p>
            </div>
          )}

          {error && (
            <div className={styles.errorState}>
              <p>{error}</p>
              <button onClick={fetchNotifications}>다시 시도</button>
            </div>
          )}

          {!isLoading && !error && notifications.map(notification => (
            <div
              key={notification.notificationId}
              className={styles.notificationItem}
              onClick={() => handleNotificationClick(notification)}
            >
              <div className={styles.notificationHeader}>
                <div className={styles.senderInfo}>
                  <div className={`${styles.senderAvatar} ${getSenderType(notification) === 'person' ? styles.senderAvatarPerson : ''}`}>
                    {getSenderType(notification) === 'organization' ? (
                      <svg width="14" height="14" viewBox="0 0 24 24" fill="none">
                        <path d="M12 2L2 7V17L12 22L22 17V7L12 2Z" fill="white"/>
                      </svg>
                    ) : (
                      <span className={styles.senderAvatarText}>{getSenderName(notification).charAt(0)}</span>
                    )}
                  </div>
                  <span className={styles.senderName}>{getSenderName(notification)}</span>
                </div>
                <span className={styles.notificationTime}>{formatTime(notification.createdAt)}</span>
                {!notification.isRead && <div className={styles.unreadDot} />}
              </div>

              <div className={styles.notificationContent}>
                <p className={styles.notificationTitle}>{notification.notificationTitle}</p>
                <p className={styles.notificationDescription}>{notification.notificationContent}</p>
              </div>

              {activeMainTab === '활동' && notification.notificationType === 'COUNCIL' && (
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
          ))}

          {!isLoading && !error && notifications.length === 0 && (
            <div className={styles.emptyState}>
              <div className={styles.emptyIcon}>📭</div>
              <p className={styles.emptyText}>알림이 없습니다</p>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default NotificationsPage
