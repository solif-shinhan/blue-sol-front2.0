import { useNavigate, useParams } from 'react-router-dom'
import styles from './ActivityDetail.module.css'

// 활동 알림 상세 데이터 타입
interface ActivityDetail {
  id: number
  sender: string
  title: string
  content: string
  time: string
  category: '쪽지' | '교류' | '자치회 활동'
  subTitle?: string
  likes?: number
  comments?: number
}

// 임시 활동 알림 상세 데이터 (추후 API 연동)
const ACTIVITY_DETAILS: ActivityDetail[] = [
  // 쪽지
  {
    id: 101,
    sender: '김민서',
    title: '제주최강신한이들 자치회에 관심 있어 연락드렸습니다!',
    content: '안녕하세요! 저는 한국고등학교 다니고 있는 김민서입니다.\n\n자치회 활동을 보고 정말 멋지다고 생각했어요. 저도 함께 활동하고 싶은데, 가입 방법을 알 수 있을까요?\n\n연락 기다리겠습니다!',
    time: '40분 전',
    category: '쪽지'
  },
  {
    id: 102,
    sender: '김건우',
    title: '최근에 활동하신 스터디에 관심 있습니다!',
    content: '안녕하세요. 저는 한국대학교에 다니고 있는 김건우입니다.\n\n이번에 올리신 스터디 후기를 보고 연락드립니다. 저도 비슷한 분야를 공부하고 있어서 함께하고 싶습니다.\n\n혹시 스터디 인원 모집이 가능할까요?',
    time: '1일 전',
    category: '쪽지'
  },
  // 교류
  {
    id: 201,
    sender: '김솔잎',
    title: '똑똑! 💌 누군가 회원님의 꿈을 응원해요.',
    subTitle: '[김신한]님이 회원님과 친해지고 싶어 해요! 😍',
    content: '작성하신 목표가 정말 멋져 보여요! 서로 좋은 자극을 주고받는 사이가 되고 싶어서 마음을 보냈어요.\n\nSOLID를 확인하고 나의 교류망 친구가 되어보세요!',
    time: '40분 전',
    category: '교류'
  },
  {
    id: 202,
    sender: '김솔잎',
    title: '똑똑! 💌 누군가 회원님의 꿈을 응원해요.',
    subTitle: '[박지민]님이 회원님과 친해지고 싶어 해요! 😍',
    content: '작성하신 목표가 정말 멋져 보여요! 서로 좋은 자극을 주고받는 사이가 되고 싶어서 마음을 보냈어요.\n\nSOLID를 확인하고 나의 교류망 친구가 되어보세요!',
    time: '1일 전',
    category: '교류'
  },
  {
    id: 203,
    sender: '김솔잎',
    title: '도착! 🎁 선배의 경험이 도착했어요.',
    subTitle: '[김성철]님이 #학업을 도와드려요! 😍',
    content: '작성하신 목표, 저도 똑같이 고민했던 기억이 나요. 제가 겪었던 경험과 팁을 나눠드려도 될까요?\n\n\'쪽지\'를 보내 대화를 나눠보세요!',
    time: '40분 전',
    category: '교류'
  },
  {
    id: 204,
    sender: '김솔잎',
    title: '도착! 🎁 선배의 경험이 도착했어요.',
    subTitle: '[이준호]님이 #취업을 도와드려요! 😍',
    content: '작성하신 목표, 저도 똑같이 고민했던 기억이 나요. 제가 겪었던 경험과 팁을 나눠드려도 될까요?\n\n\'쪽지\'를 보내 대화를 나눠보세요!',
    time: '1일 전',
    category: '교류'
  },
  // 자치회 활동
  {
    id: 301,
    sender: '박선우',
    title: '2월 자치회 활동 후기',
    content: '등촌 칼국수를 먹으며 마음까지 따뜻해지는 시간을 보냈습니다.\n\n이번 모임에서 새로운 친구들도 많이 사귀고, 서로의 근황도 나눌 수 있어서 정말 좋았어요.\n\n다음 모임도 기대됩니다!',
    time: '1일 전',
    category: '자치회 활동',
    likes: 25,
    comments: 8
  },
  {
    id: 302,
    sender: '박선호',
    title: '2월 자치회 활동 후기',
    content: '저는 이번 자치회 활동에서 얻어가는 것이 많았는데요!\n\n특히 선배들의 경험담을 들으면서 많은 영감을 받았습니다. 다음번에도 꼭 참석하고 싶어요.\n\n함께해주신 모든 분들께 감사드립니다!',
    time: '2일 전',
    category: '자치회 활동',
    likes: 18,
    comments: 5
  }
]

function ActivityDetailPage() {
  const navigate = useNavigate()
  const { id } = useParams<{ id: string }>()

  const handleBack = () => {
    navigate(-1)
  }

  // ID로 활동 알림 상세 데이터 찾기
  const activity = ACTIVITY_DETAILS.find(a => a.id === Number(id))

  if (!activity) {
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
          <p className={styles.emptyText}>알림을 찾을 수 없습니다</p>
        </div>
      </div>
    )
  }

  const handleViewSolid = () => {
    navigate('/home')
  }

  const handleSendMessage = () => {
    // 쪽지 보내기 기능 (추후 구현)
    console.log('Send message')
  }

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
        {/* Sender Info */}
        <div className={styles.senderSection}>
          <div className={styles.senderAvatar}>
            <span className={styles.senderAvatarText}>{activity.sender.charAt(0)}</span>
          </div>
          <div className={styles.senderInfo}>
            <span className={styles.senderName}>{activity.sender}</span>
            <span className={styles.senderTime}>{activity.time}</span>
          </div>
        </div>

        {/* Title */}
        <div className={styles.titleSection}>
          <h1 className={styles.activityTitle}>{activity.title}</h1>
        </div>

        {/* Body Content */}
        <div className={styles.bodySection}>
          {activity.subTitle && (
            <p className={styles.subTitle}>{activity.subTitle}</p>
          )}
          <p className={styles.contentText}>{activity.content}</p>

          {/* Stats for 자치회 활동 */}
          {activity.category === '자치회 활동' && (
            <div className={styles.activityStats}>
              <div className={styles.statItem}>
                <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
                  <path d="M9 16C9 16 2 11 2 6.5C2 4 4 2 6.5 2C7.5 2 8.5 2.5 9 3C9.5 2.5 10.5 2 11.5 2C14 2 16 4 16 6.5C16 11 9 16 9 16Z" stroke="#C8C8C8" strokeWidth="1.5" fill="none"/>
                </svg>
                <span>{activity.likes}</span>
              </div>
              <div className={styles.statItem}>
                <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
                  <path d="M16 9C16 12.866 12.866 16 9 16C7.5 16 6.1 15.6 5 14.9L2 16L3.1 13C2.4 11.9 2 10.5 2 9C2 5.134 5.134 2 9 2C12.866 2 16 5.134 16 9Z" stroke="#C8C8C8" strokeWidth="1.5" fill="none"/>
                </svg>
                <span>{activity.comments}</span>
              </div>
            </div>
          )}
        </div>

        {/* CTA Buttons for 교류 */}
        {activity.category === '교류' && (
          <div className={styles.ctaSection}>
            <button className={styles.ctaButtonPrimary} onClick={handleViewSolid}>
              SOLID 보기
            </button>
            <button className={styles.ctaButtonSecondary} onClick={handleSendMessage}>
              쪽지
            </button>
          </div>
        )}

        {/* CTA Buttons for 쪽지 */}
        {activity.category === '쪽지' && (
          <div className={styles.ctaSectionSingle}>
            <button className={styles.ctaButtonFull} onClick={handleSendMessage}>
              답장하기
            </button>
          </div>
        )}
      </div>
    </div>
  )
}

export default ActivityDetailPage
