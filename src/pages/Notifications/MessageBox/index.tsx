import { useState, useEffect } from 'react'
import { useNavigate, useSearchParams } from 'react-router-dom'
import styles from './MessageBox.module.css'
import {
  getNotifications,
  type NotificationItem,
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

function MessageBox() {
  const navigate = useNavigate()
  const [searchParams] = useSearchParams()
  const [activeTab, setActiveTab] = useState<'received' | 'sent'>('received')
  const [messages, setMessages] = useState<NotificationItem[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [showToast, setShowToast] = useState(false)

  // URL에서 toast 파라미터 확인 (쪽지 전송 후 리다이렉트 시)
  useEffect(() => {
    if (searchParams.get('sent') === 'true') {
      setShowToast(true)
      setActiveTab('sent')
    }
  }, [searchParams])

  // 토스트 자동 숨김
  useEffect(() => {
    if (showToast) {
      const timer = setTimeout(() => setShowToast(false), 3000)
      return () => clearTimeout(timer)
    }
  }, [showToast])

  const fetchMessages = async () => {
    setIsLoading(true)
    try {
      const response = await getNotifications({
        category: 'ACTIVITY',
        subCategory: 'MESSAGE',
        filter: 'ALL',
        page: 0,
        size: 20,
      })
      if (response.success) {
        setMessages(response.data.content)
      }
    } catch (err) {
      console.error('쪽지 조회 실패:', err)
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    fetchMessages()
  }, [activeTab])

  const handleBack = () => {
    navigate(-1)
  }

  const handleMessageClick = (message: NotificationItem) => {
    navigate(`/notifications/activity/${message.notificationId}`)
  }

  const handleCompose = () => {
    navigate('/notifications/message/compose')
  }

  return (
    <div className={styles.container}>
      <header className={styles.header}>
        <button className={styles.backButton} onClick={handleBack}>
          <svg viewBox="0 0 24 24" fill="none" stroke="#848484" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M15 18l-6-6 6-6" />
          </svg>
        </button>
        <span className={styles.headerTitle}>쪽지함</span>
      </header>

      <div className={styles.content}>
        <div className={styles.tabBar}>
          <button
            className={`${styles.tab} ${activeTab === 'received' ? styles.tabActive : ''}`}
            onClick={() => setActiveTab('received')}
          >
            받은 쪽지
          </button>
          <button
            className={`${styles.tab} ${activeTab === 'sent' ? styles.tabActive : ''}`}
            onClick={() => setActiveTab('sent')}
          >
            보낸 쪽지
          </button>
        </div>

        <div className={styles.messageList}>
          {isLoading && (
            <div className={styles.loadingState}>
              <p>로딩 중...</p>
            </div>
          )}

          {!isLoading && messages.map(message => (
            <div
              key={message.notificationId}
              className={styles.messageItem}
              onClick={() => handleMessageClick(message)}
            >
              <div className={styles.messageHeader}>
                <div className={styles.senderInfo}>
                  <div className={styles.senderAvatar}>
                    {message.senderProfileImage ? (
                      <img src={message.senderProfileImage} alt={message.senderName || ''} />
                    ) : (
                      <span className={styles.senderAvatarText}>
                        {(message.senderName || '?').charAt(0)}
                      </span>
                    )}
                  </div>
                  <span className={styles.senderName}>
                    {message.senderName || '알 수 없음'}
                  </span>
                </div>
                <div className={styles.timeAndDot}>
                  <span className={styles.messageTime}>{formatTime(message.createdAt)}</span>
                  {!message.isRead && <div className={styles.unreadDot} />}
                </div>
              </div>

              <div className={styles.messageContent}>
                <p className={styles.messageTitle}>{message.notificationTitle}</p>
                <p className={styles.messageDescription}>{message.notificationContent}</p>
              </div>
            </div>
          ))}

          {!isLoading && messages.length === 0 && (
            <div className={styles.emptyState}>
              <div className={styles.emptyIcon}>📭</div>
              <p className={styles.emptyText}>
                {activeTab === 'received' ? '받은 쪽지가 없습니다' : '보낸 쪽지가 없습니다'}
              </p>
            </div>
          )}
        </div>
      </div>

      <button className={styles.fab} onClick={handleCompose}>
        <svg viewBox="0 0 24 24" fill="none">
          <path d="M16.474 5.408l2.118 2.117m-.756-3.982L12.109 9.27a2.118 2.118 0 00-.58 1.082L11 13l2.648-.53c.41-.082.786-.283 1.082-.579l5.727-5.727a1.853 1.853 0 10-2.621-2.621z" stroke="#FFFFFF" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
          <path d="M19 15v3a2 2 0 01-2 2H6a2 2 0 01-2-2V7a2 2 0 012-2h3" stroke="#FFFFFF" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
        </svg>
      </button>

      {showToast && (
        <div className={styles.toast}>
          <span className={styles.toastText}>
            쪽지가 성공적으로{'\n'}전송되었습니다
          </span>
          <button className={styles.toastClose} onClick={() => setShowToast(false)}>
            닫기
          </button>
        </div>
      )}
    </div>
  )
}

export default MessageBox
