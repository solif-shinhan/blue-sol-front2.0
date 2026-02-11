import { useState, useEffect } from 'react'
import { useNavigate, useSearchParams } from 'react-router-dom'
import styles from './MessageBox.module.css'
import { BackHeader } from '@/components/BackHeader'
import {
  getReceivedMessages,
  getSentMessages,
  type MessageListItem,
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
  const [messages, setMessages] = useState<MessageListItem[]>([])
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
      const fetcher = activeTab === 'received' ? getReceivedMessages : getSentMessages
      const response = await fetcher({ page: 0, size: 20 })
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

  const handleMessageClick = (message: MessageListItem) => {
    navigate(`/notifications/activity/${message.messageId}`, {
      state: { fromMessage: true },
    })
  }

  const handleCompose = () => {
    navigate('/notifications/message/compose')
  }

  return (
    <div className={styles.container}>
      <BackHeader title="쪽지함" onBack={handleBack} />

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

          {!isLoading && messages.map(message => {
            const displayName = activeTab === 'received' ? message.senderName : message.receiverName
            const displayImage = activeTab === 'received' ? message.senderProfileImage : message.receiverProfileImage
            return (
              <div
                key={message.messageId}
                className={styles.messageItem}
                onClick={() => handleMessageClick(message)}
              >
                <div className={styles.messageHeader}>
                  <div className={styles.senderInfo}>
                    <div className={styles.senderAvatar}>
                      {displayImage ? (
                        <img src={displayImage} alt={displayName || ''} />
                      ) : (
                        <span className={styles.senderAvatarText}>
                          {(displayName || '?').charAt(0)}
                        </span>
                      )}
                    </div>
                    <span className={styles.senderName}>
                      {displayName || '알 수 없음'}
                    </span>
                  </div>
                  <div className={styles.timeAndDot}>
                    <span className={styles.messageTime}>{formatTime(message.createdAt)}</span>
                    {!message.isRead && activeTab === 'received' && <div className={styles.unreadDot} />}
                  </div>
                </div>

                <div className={styles.messageContent}>
                  <p className={styles.messageTitle}>{message.messageTitle}</p>
                  <p className={styles.messageDescription}>{message.messageContent}</p>
                </div>
              </div>
            )
          })}

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

      <div className={styles.composeButtonWrap}>
        <button className={styles.composeButton} onClick={handleCompose}>
          쪽지 보내기
        </button>
      </div>

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
