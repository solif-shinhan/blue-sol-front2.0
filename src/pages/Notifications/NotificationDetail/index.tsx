import { useNavigate, useParams } from 'react-router-dom'
import styles from './NotificationDetail.module.css'

// 알림 상세 데이터 타입
interface NotificationDetail {
  id: number
  sender: string
  senderType: 'organization' | 'person'
  title: string
  time: string
  sections: {
    title: string
    content?: string
    list?: string[]
  }[]
  image?: string
  ctaText?: string
  ctaLink?: string
}

// 임시 알림 상세 데이터 (추후 API 연동)
const NOTIFICATION_DETAILS: NotificationDetail[] = [
  {
    id: 1,
    sender: '신한장학재단',
    senderType: 'organization',
    title: '[공지] 2026년도 신규 장학생 모집 시작!',
    time: '2026.01.27 10:30',
    sections: [
      {
        title: '선발 개요',
        content: '신한장학재단은 미래를 이끌어갈 인재 양성을 위해 2026년도 신규 장학생을 모집합니다. 학업에 대한 열정과 사회 공헌 의지가 있는 대학생 여러분의 많은 지원 바랍니다.'
      },
      {
        title: '지원 자격',
        list: [
          '국내 4년제 대학교 재학생 (2026년 1학기 기준)',
          '직전 학기 성적 3.5/4.5 이상',
          '가구 소득 기준 충족자',
          '타 장학금 미수혜자'
        ]
      },
      {
        title: '장학 혜택',
        list: [
          '등록금 전액 지원 (최대 8학기)',
          '생활비 월 50만원 지급',
          '멘토링 프로그램 참여 기회',
          '해외 연수 프로그램 지원'
        ]
      },
      {
        title: '신청 방법',
        content: '푸른SOL 앱 내 장학금 신청 메뉴에서 온라인 접수\n신청 기간: 2026.02.01 ~ 2026.02.28\n서류 심사 → 면접 → 최종 발표'
      }
    ],
    ctaText: '장학금 신청하기',
    ctaLink: '/growth'
  },
  {
    id: 2,
    sender: '신한장학재단',
    senderType: 'organization',
    title: '마감 D-1, 서류 제출을 잊지 마세요.',
    time: '2026.01.27 10:15',
    sections: [
      {
        title: '서류 제출 안내',
        content: '2026년도 신규 장학생 신청 마감이 내일로 다가왔습니다. 아직 서류를 제출하지 않으신 분들은 오늘 자정까지 반드시 제출해 주세요.'
      },
      {
        title: '필수 제출 서류',
        list: [
          '재학증명서 1부',
          '성적증명서 1부',
          '소득금액증명원 1부',
          '자기소개서 (양식 다운로드)'
        ]
      },
      {
        title: '제출 방법',
        content: '푸른SOL 앱 → 마이페이지 → 서류 제출\n문의: scholarship@shinhan.org'
      }
    ],
    ctaText: '서류 제출하기'
  },
  {
    id: 3,
    sender: '신한장학재단',
    senderType: 'organization',
    title: '1학기 생활비 장학금 지급 완료',
    time: '2026.01.27 09:45',
    sections: [
      {
        title: '지급 안내',
        content: '2026년 1학기 생활비 장학금이 등록된 계좌로 입금되었습니다.'
      },
      {
        title: '지급 내역',
        list: [
          '지급 금액: 500,000원',
          '입금 계좌: 신한 ***-***-******',
          '지급일: 2026.01.27'
        ]
      },
      {
        title: '유의사항',
        content: '장학금은 학업 및 생활 목적으로만 사용하여 주시기 바랍니다. 입금 확인이 되지 않는 경우 고객센터로 문의해 주세요.'
      }
    ]
  },
  {
    id: 4,
    sender: '김건우',
    senderType: 'person',
    title: '김솔잎 멘티님, 반가워요! 이번 달 만남 일정 조율...',
    time: '2026.01.26 14:20',
    sections: [
      {
        title: '멘토 인사',
        content: '안녕하세요! 이번 학기 멘토를 맡게 된 김건우입니다. 꿈을 향해 달려가는 솔잎님을 응원하며, 함께 성장할 수 있는 시간이 되었으면 좋겠습니다.'
      },
      {
        title: '이번 달 일정',
        content: '첫 만남 일정을 잡고 싶습니다. 아래 시간 중 가능한 시간을 알려주세요.\n\n- 2/5(수) 오후 3시\n- 2/7(금) 오후 5시\n- 2/8(토) 오전 11시'
      },
      {
        title: '연락처',
        content: '카카오톡 ID: mentor_gunwoo\n이메일: gunwoo@example.com'
      }
    ],
    ctaText: '멘토에게 답장하기',
    ctaLink: '/exchange/mentoring'
  },
  {
    id: 5,
    sender: '신한장학재단',
    senderType: 'organization',
    title: '이번 겨울, 따뜻한 연탄 나눔 어때요?',
    time: '2026.01.21 09:00',
    sections: [
      {
        title: '봉사활동 안내',
        content: '신한장학재단과 함께하는 겨울 연탄 나눔 봉사활동에 여러분을 초대합니다. 보람도 챙기고 친구도 사귀는 기회!'
      },
      {
        title: '활동 정보',
        list: [
          '일시: 2026.02.15(토) 오전 9시',
          '장소: 서울시 성북구 (상세 위치 별도 안내)',
          '활동 내용: 연탄 배달 봉사',
          '모집 인원: 선착순 50명'
        ]
      },
      {
        title: '참가 신청',
        content: '앱 내 봉사활동 메뉴에서 신청\n마감: 2026.02.10까지 (선착순)'
      }
    ],
    ctaText: '봉사활동 신청하기',
    ctaLink: '/exchange'
  },
  {
    id: 6,
    sender: '신한장학재단',
    senderType: 'organization',
    title: '드디어 오늘! 신한 장학생 홈커밍데이',
    time: '2026.01.21 08:00',
    sections: [
      {
        title: '행사 안내',
        content: '오늘은 기다리던 신한 장학생 홈커밍데이입니다! 선배들과의 만남이 준비되어 있어요.'
      },
      {
        title: '프로그램',
        list: [
          '오후 5시: 온라인 접속 (Zoom 링크 별도 발송)',
          '오후 5시 30분: 선배 특강',
          '오후 6시 30분: 네트워킹 세션',
          '오후 7시 30분: 마무리'
        ]
      },
      {
        title: '참여 방법',
        content: '이메일로 발송된 Zoom 링크로 접속해 주세요.\n문의: event@shinhan.org'
      }
    ],
    ctaText: '홈커밍데이 참여하기'
  }
]

function NotificationDetailPage() {
  const navigate = useNavigate()
  const { id } = useParams<{ id: string }>()

  const handleBack = () => {
    navigate(-1)
  }

  // ID로 알림 상세 데이터 찾기
  const notification = NOTIFICATION_DETAILS.find(n => n.id === Number(id))

  if (!notification) {
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

  const handleCtaClick = () => {
    if (notification.ctaLink) {
      navigate(notification.ctaLink)
    }
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
          <div className={`${styles.senderAvatar} ${notification.senderType === 'person' ? styles.senderAvatarPerson : ''}`}>
            {notification.senderType === 'organization' ? (
              <svg viewBox="0 0 24 24" fill="none">
                <path d="M12 2L2 7V17L12 22L22 17V7L12 2Z" fill="white"/>
              </svg>
            ) : (
              <span className={styles.senderAvatarText}>{notification.sender.charAt(0)}</span>
            )}
          </div>
          <div className={styles.senderInfo}>
            <span className={styles.senderName}>{notification.sender}</span>
            <span className={styles.senderTime}>{notification.time}</span>
          </div>
        </div>

        {/* Title */}
        <div className={styles.titleSection}>
          <h1 className={styles.notificationTitle}>{notification.title}</h1>
        </div>

        {/* Body Sections */}
        <div className={styles.bodySection}>
          {notification.sections.map((section, index) => (
            <div key={index} className={styles.contentSection}>
              <h2 className={styles.sectionTitle}>{section.title}</h2>
              {section.content && (
                <p className={styles.sectionContent}>{section.content}</p>
              )}
              {section.list && (
                <ul className={styles.sectionList}>
                  {section.list.map((item, itemIndex) => (
                    <li key={itemIndex} className={styles.sectionListItem}>{item}</li>
                  ))}
                </ul>
              )}
            </div>
          ))}

          {/* Image (if exists) */}
          {notification.image && (
            <div className={styles.imageSection}>
              <img src={notification.image} alt="" />
            </div>
          )}
        </div>

        {/* CTA Button */}
        {notification.ctaText && (
          <div className={styles.ctaSection}>
            <button className={styles.ctaButton} onClick={handleCtaClick}>
              {notification.ctaText}
            </button>
          </div>
        )}
      </div>
    </div>
  )
}

export default NotificationDetailPage
