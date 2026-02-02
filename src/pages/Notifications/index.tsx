import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import styles from './Notifications.module.css'

// 알림 데이터 타입
interface Notification {
  id: number
  sender: string
  senderType: 'organization' | 'person'
  title: string
  description: string
  time: string
  isUnread: boolean
}

// 활동 알림 데이터 타입
interface ActivityNotification {
  id: number
  sender: string
  title: string
  description: string
  time: string
  isUnread: boolean
  category: '쪽지' | '교류' | '자치회 활동'
  likes?: number
  comments?: number
}

// 공지사항 알림 데이터
const NOTIFICATIONS: Notification[] = [
  {
    id: 1,
    sender: '신한장학재단',
    senderType: 'organization',
    title: '[공지] 2026년도 신규 장학생 모집 시작!',
    description: '꿈을 향한 여러분의 도전을 응원합니다. 지금 바로 신청자격을 확...',
    time: '15분 전',
    isUnread: true
  },
  {
    id: 2,
    sender: '신한장학재단',
    senderType: 'organization',
    title: '마감 D-1, 서류 제출을 잊지 마세요.',
    description: '오늘 자정 장학생 신청이 마감됩니다. 작성 중인 지원서가 있다면...',
    time: '20분 전',
    isUnread: true
  },
  {
    id: 3,
    sender: '신한장학재단',
    senderType: 'organization',
    title: '1학기 생활비 장학금 지급 완료',
    description: '장학금이 등록된 계좌로 입금되었습니다. 학업에 큰 힘이 되길 바...',
    time: '40분 전',
    isUnread: true
  },
  {
    id: 4,
    sender: '김건우',
    senderType: 'person',
    title: '김솔잎 멘티님, 반가워요! 이번 달 만남 일정 조율...',
    description: '안녕하세요! 이번 학기 멘토를 맡게 된 김건우입니다. 꿈을 향해...',
    time: '1일 전',
    isUnread: false
  },
  {
    id: 5,
    sender: '신한장학재단',
    senderType: 'organization',
    title: '이번 겨울, 따뜻한 연탄 나눔 어때요?',
    description: '보람도 챙기고 친구도 사귀는 기회! 선착순 마감이니 서두르세요.',
    time: '6일 전',
    isUnread: false
  },
  {
    id: 6,
    sender: '신한장학재단',
    senderType: 'organization',
    title: '드디어 오늘! 신한 장학생 홈커밍데이',
    description: '선배들과의 만남이 준비되어 있어요. 오후 5시, 잊지 말고 접속하...',
    time: '6일 전',
    isUnread: false
  }
]

// 활동 알림 데이터
const ACTIVITY_NOTIFICATIONS: ActivityNotification[] = [
  // 쪽지
  {
    id: 101,
    sender: '김민서',
    title: '제주최강신한이들 자치회에 관심 있어 연락드렸습...',
    description: '안녕하세요! 저는 한국고등학교 다니고 있는 김민서입니다.',
    time: '40분 전',
    isUnread: true,
    category: '쪽지'
  },
  {
    id: 102,
    sender: '김건우',
    title: '최근에 활동하신 스터디에 관심 있습니다!',
    description: '안녕하세요. 저는 한국대학교에 다니고 있는 김건우입니다. 이번...',
    time: '1일 전',
    isUnread: false,
    category: '쪽지'
  },
  // 교류
  {
    id: 201,
    sender: '김솔잎',
    title: '똑똑! 💌 누군가 회원님의 꿈을 응원해요.',
    description: '작성하신 목표가 정말 멋져 보여요! 서로 좋은 자극을 주고받는 ...',
    time: '40분 전',
    isUnread: true,
    category: '교류'
  },
  {
    id: 202,
    sender: '김솔잎',
    title: '똑똑! 💌 누군가 회원님의 꿈을 응원해요.',
    description: '작성하신 목표가 정말 멋져 보여요! 서로 좋은 자극을 주고받는 ...',
    time: '1일 전',
    isUnread: false,
    category: '교류'
  },
  {
    id: 203,
    sender: '김솔잎',
    title: '도착! 🎁 선배의 경험이 도착했어요.',
    description: '작성하신 목표, 저도 똑같이 고민했던 기억이 나요. 제가 겪었던...',
    time: '40분 전',
    isUnread: true,
    category: '교류'
  },
  {
    id: 204,
    sender: '김솔잎',
    title: '도착! 🎁 선배의 경험이 도착했어요.',
    description: '작성하신 목표, 저도 똑같이 고민했던 기억이 나요. 제가 겪었던...',
    time: '1일 전',
    isUnread: false,
    category: '교류'
  },
  // 자치회 활동
  {
    id: 301,
    sender: '박선우',
    title: '2월 자치회 활동 후기',
    description: '등촌 칼국수를 먹으며 마음까지 따뜻해지는 시간을 보냈습니다...',
    time: '1일 전',
    isUnread: false,
    category: '자치회 활동',
    likes: 25,
    comments: 8
  },
  {
    id: 302,
    sender: '박선호',
    title: '2월 자치회 활동 후기',
    description: '저는 이번 자치회 활동에서 얻어가는 것이 많았는데요! 다음번과...',
    time: '2일 전',
    isUnread: false,
    category: '자치회 활동',
    likes: 18,
    comments: 5
  }
]

function NotificationsPage() {
  const navigate = useNavigate()
  const [activeMainTab, setActiveMainTab] = useState<'공지사항' | '활동'>('공지사항')
  const [activeFilterTab, setActiveFilterTab] = useState<'전체' | '안읽음'>('전체')
  const [activeActivityTab, setActiveActivityTab] = useState<'쪽지' | '교류' | '자치회 활동'>('쪽지')

  const handleBack = () => {
    navigate(-1)
  }

  const handleNotificationClick = (id: number) => {
    navigate(`/notifications/${id}`)
  }

  const handleActivityClick = (notification: ActivityNotification) => {
    // 각 카테고리별 클릭 핸들링
    if (notification.category === '쪽지') {
      // 쪽지 상세 페이지로 이동 (추후 구현)
      navigate(`/notifications/activity/${notification.id}`)
    } else if (notification.category === '교류') {
      // 교류 상세 페이지로 이동
      navigate(`/notifications/activity/${notification.id}`)
    } else if (notification.category === '자치회 활동') {
      // 자치회 활동 상세 페이지로 이동
      navigate(`/notifications/activity/${notification.id}`)
    }
  }

  // 공지사항 필터링
  const filteredNotifications = NOTIFICATIONS.filter(notification => {
    if (activeFilterTab === '안읽음') {
      return notification.isUnread
    }
    return true
  })

  // 활동 알림 필터링
  const filteredActivityNotifications = ACTIVITY_NOTIFICATIONS.filter(notification => {
    if (notification.category !== activeActivityTab) return false
    if (activeFilterTab === '안읽음') {
      return notification.isUnread
    }
    return true
  })

  const unreadCount = activeMainTab === '공지사항'
    ? NOTIFICATIONS.filter(n => n.isUnread).length
    : ACTIVITY_NOTIFICATIONS.filter(n => n.category === activeActivityTab && n.isUnread).length

  return (
    <div className={styles.container}>
      {/* Header */}
      <header className={styles.header}>
        <button className={styles.backButton} onClick={handleBack}>
          <svg viewBox="0 0 24 24" fill="none" stroke="#848484" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M15 18l-6-6 6-6" />
          </svg>
        </button>
        <span className={styles.headerTitle}>알림</span>
      </header>

      {/* Content */}
      <div className={styles.content}>
        {/* Tab Section */}
        <div className={styles.tabSection}>
          {/* Main Tabs */}
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

          {/* Filter Tabs */}
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

        {/* Notification List */}
        <div className={styles.notificationList}>
          {activeMainTab === '공지사항' && filteredNotifications.map(notification => (
            <div key={notification.id} className={styles.notificationItem} onClick={() => handleNotificationClick(notification.id)}>
              {/* Header Row */}
              <div className={styles.notificationHeader}>
                <div className={styles.senderInfo}>
                  <div className={`${styles.senderAvatar} ${notification.senderType === 'person' ? styles.senderAvatarPerson : ''}`}>
                    {notification.senderType === 'organization' ? (
                      <svg width="14" height="14" viewBox="0 0 24 24" fill="none">
                        <path d="M12 2L2 7V17L12 22L22 17V7L12 2Z" fill="white"/>
                      </svg>
                    ) : (
                      <span className={styles.senderAvatarText}>{notification.sender.charAt(0)}</span>
                    )}
                  </div>
                  <span className={styles.senderName}>{notification.sender}</span>
                </div>
                <span className={styles.notificationTime}>{notification.time}</span>
                {notification.isUnread && <div className={styles.unreadDot} />}
              </div>

              {/* Content */}
              <div className={styles.notificationContent}>
                <p className={styles.notificationTitle}>{notification.title}</p>
                <p className={styles.notificationDescription}>{notification.description}</p>
              </div>
            </div>
          ))}

          {activeMainTab === '활동' && filteredActivityNotifications.map(notification => (
            <div key={notification.id} className={styles.notificationItem} onClick={() => handleActivityClick(notification)}>
              {/* Header Row */}
              <div className={styles.notificationHeader}>
                <div className={styles.senderInfo}>
                  <div className={`${styles.senderAvatar} ${styles.senderAvatarPerson}`}>
                    <span className={styles.senderAvatarText}>{notification.sender.charAt(0)}</span>
                  </div>
                  <span className={styles.senderName}>{notification.sender}</span>
                </div>
                <span className={styles.notificationTime}>{notification.time}</span>
                {notification.isUnread && <div className={styles.unreadDot} />}
              </div>

              {/* Content */}
              <div className={styles.notificationContent}>
                <p className={styles.notificationTitle}>{notification.title}</p>
                <p className={styles.notificationDescription}>{notification.description}</p>
              </div>

              {/* Stats for 자치회 활동 */}
              {notification.category === '자치회 활동' && (
                <div className={styles.activityStats}>
                  <div className={styles.statItem}>
                    <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
                      <path d="M9 16C9 16 2 11 2 6.5C2 4 4 2 6.5 2C7.5 2 8.5 2.5 9 3C9.5 2.5 10.5 2 11.5 2C14 2 16 4 16 6.5C16 11 9 16 9 16Z" stroke="#C8C8C8" strokeWidth="1.5" fill="none"/>
                    </svg>
                    <span>{notification.likes}</span>
                  </div>
                  <div className={styles.statItem}>
                    <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
                      <path d="M16 9C16 12.866 12.866 16 9 16C7.5 16 6.1 15.6 5 14.9L2 16L3.1 13C2.4 11.9 2 10.5 2 9C2 5.134 5.134 2 9 2C12.866 2 16 5.134 16 9Z" stroke="#C8C8C8" strokeWidth="1.5" fill="none"/>
                    </svg>
                    <span>{notification.comments}</span>
                  </div>
                </div>
              )}
            </div>
          ))}

          {((activeMainTab === '공지사항' && filteredNotifications.length === 0) ||
            (activeMainTab === '활동' && filteredActivityNotifications.length === 0)) && (
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
