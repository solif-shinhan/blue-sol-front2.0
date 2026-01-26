import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import styles from './Mentoring.module.css'

// SVG imports
import backArrowIcon from '@/assets/images/exchange-mentoring/back-arrow.svg'
import calendarIcon from '@/assets/images/exchange-mentoring/calendar.svg'
import profilePlaceholder from '@/assets/images/exchange-mentoring/profile-placeholder.svg'
import statusBadgeIcon from '@/assets/images/exchange-mentoring/status-badge.svg'
import dividerIcon from '@/assets/images/exchange-mentoring/divider.svg'
import searchIcon from '@/assets/images/exchange-mentoring/search.svg'

// 멘토링 상태 탭
const STATUS_TABS = ['응원하기', '경험 나누기']

// 멘토 필터 탭
const MENTOR_FILTER_TABS = ['전체', '학업고민', '취업고민', '인생의 멘토']

// 나의 멘토링 현황 데이터
const MY_MENTORING_STATUS = [
  { id: 1, label: '명함 디자인', status: '수신 확인 중' },
  { id: 2, label: '명함 디자인', status: '교류중' },
]

// 멘토 데이터
const MENTORS = [
  {
    id: 1,
    name: '신한철',
    role: '멘토',
    organization: 'SO&L 글로벌자산운용 대표',
    image: 'https://www.figma.com/api/mcp/asset/a6305e4d-5fab-4a15-8b03-c79e00bcc2a7',
  },
  {
    id: 2,
    name: '한민선',
    role: '멘토',
    organization: 'SO&L 글로벌자산운용 대표',
    image: 'https://www.figma.com/api/mcp/asset/e2e3c557-5201-4881-a68a-cf34c9f3be16',
  },
]

// 멘토 후기 데이터
const MENTOR_REVIEWS = [
  {
    id: 1,
    author: '강**',
    mentorName: '신한철 멘토님',
    content: '신한철 멘토님께 대학 입시 컨설팅을 받았습니다. 제가 생각하지 못했던 지점을 바로 이야기 해주셔서...',
    image: 'https://www.figma.com/api/mcp/asset/24117198-6767-41f5-b3db-33f568bc2f66',
  },
]

function MentoringPage() {
  const navigate = useNavigate()
  const [activeStatusTab, setActiveStatusTab] = useState('응원하기')
  const [activeMentorFilter, setActiveMentorFilter] = useState('전체')
  const [isSearchMode, setIsSearchMode] = useState(false)
  const [searchQuery, setSearchQuery] = useState('')

  const handleBack = () => {
    if (isSearchMode) {
      setIsSearchMode(false)
      setSearchQuery('')
    } else {
      navigate(-1)
    }
  }

  const handleSearchClick = () => {
    setIsSearchMode(true)
  }

  const handleMentoringApply = (mentorId: number) => {
    navigate(`/exchange/mentoring/apply?mentorId=${mentorId}`)
  }

  return (
    <div className={styles.container}>
      {/* 헤더 */}
      {isSearchMode ? (
        <header className={styles.searchHeader}>
          <button className={styles.backButton} onClick={handleBack} style={{ position: 'static' }}>
            <img src={backArrowIcon} alt="뒤로가기" />
          </button>
          <div className={styles.searchInputWrapper}>
            <input
              type="text"
              className={styles.searchInput}
              placeholder="검색어를 입력하세요"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              autoFocus
            />
            <img src={searchIcon} alt="검색" className={styles.searchIcon} />
          </div>
        </header>
      ) : (
        <header className={styles.header}>
          <button className={styles.backButton} onClick={handleBack}>
            <img src={backArrowIcon} alt="뒤로가기" />
          </button>
          <h1 className={styles.headerTitle}>멘토링 성장의 숲</h1>
          <div className={styles.headerRight}>
            <img
              src={searchIcon}
              alt="검색"
              className={styles.headerSearchIcon}
              onClick={handleSearchClick}
            />
            <img
              src={calendarIcon}
              alt="캘린더"
              className={styles.headerIcon}
              onClick={() => navigate('/exchange/mentoring/history')}
              style={{ cursor: 'pointer' }}
            />
            <img src={profilePlaceholder} alt="프로필" className={styles.headerIcon} />
          </div>
        </header>
      )}

      {/* 메인 콘텐츠 */}
      <div className={styles.content}>
        {/* 나의 멘토링 현황 */}
        <section className={styles.section}>
          <div className={styles.sectionHeader}>
            <h2 className={styles.sectionTitle}>나의 멘토링 현황</h2>
            <button className={styles.moreButton}>더보기</button>
          </div>

          {/* 상태 탭 */}
          <div className={styles.filterTabs}>
            {STATUS_TABS.map((tab) => (
              <button
                key={tab}
                className={`${styles.filterTab} ${activeStatusTab === tab ? styles.filterTabActive : ''}`}
                onClick={() => setActiveStatusTab(tab)}
              >
                {tab}
              </button>
            ))}
          </div>

          {/* 멘토링 상태 카드들 */}
          <div className={styles.statusCardsContainer}>
            {MY_MENTORING_STATUS.map((item) => (
              <div key={item.id} className={styles.statusCard}>
                <div className={styles.statusCardGradient} />
                <p className={styles.statusCardLabel}>{item.label}</p>
                <div className={styles.statusCardContent}>
                  <div className={styles.statusBadge}>
                    <img src={statusBadgeIcon} alt="" className={styles.statusBadgeIcon} />
                    <span className={styles.statusBadgeText}>{item.status}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* 성장의 숲 멘토 섹션 */}
        <section className={styles.section}>
          <div className={styles.sectionHeader}>
            <h2 className={styles.sectionTitle}>성장의 숲에 10명의 멘토가 있어요</h2>
            <button className={styles.moreButton}>더보기</button>
          </div>

          {/* 멘토 필터 탭 */}
          <div className={styles.filterTabs}>
            {MENTOR_FILTER_TABS.map((tab) => (
              <button
                key={tab}
                className={`${styles.filterTab} ${activeMentorFilter === tab ? styles.filterTabActive : ''}`}
                onClick={() => setActiveMentorFilter(tab)}
              >
                {tab}
              </button>
            ))}
          </div>

          {/* 멘토 카드들 */}
          <div className={styles.mentorCardsContainer}>
            {MENTORS.map((mentor) => (
              <div key={mentor.id} className={styles.mentorCard}>
                <div className={styles.mentorCardImage}>
                  <div className={styles.mentorCardImageInner}>
                    <img src={mentor.image} alt={mentor.name} />
                  </div>
                  <div className={styles.mentorCardGradient} />
                </div>
                <div className={styles.mentorCardBottom}>
                  <div className={styles.mentorInfo}>
                    <div className={styles.mentorNameRow}>
                      <span className={styles.mentorName}>{mentor.name}</span>
                      <span className={styles.mentorRole}>{mentor.role}</span>
                    </div>
                    <p className={styles.mentorOrg}>{mentor.organization}</p>
                  </div>
                  <div className={styles.mentorActionWrapper}>
                    <button
                      className={styles.mentorApplyButton}
                      onClick={() => handleMentoringApply(mentor.id)}
                    >
                      <span>멘토링 신청하기</span>
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* 맞춤 멘토링 신청 엽서 */}
        <section className={styles.section}>
          <div className={styles.sectionHeader}>
            <h2 className={styles.sectionTitle}>원하는 멘토가 없다면, 신한이 도와줄께!</h2>
          </div>
          <div className={styles.customMentoringCard} onClick={() => navigate('/exchange/mentoring/postcard')} style={{ cursor: 'pointer' }}>
            <img src={profilePlaceholder} alt="" className={styles.customMentoringIcon} />
            <div className={styles.customMentoringContent}>
              <div className={styles.customMentoringInner}>
                <div className={styles.customMentoringText}>
                  <p className={styles.customMentoringSubtitle}>내 꿈을 만날 수 있는</p>
                  <p className={styles.customMentoringTitle}>맞춤 멘토링 신청 엽서</p>
                  <p className={styles.customMentoringDescription}>
                    진솔한 마음을 담아 보내면 연결될 수 있어요
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* 멘토링 후기 */}
        <section className={styles.section}>
          <div className={styles.sectionHeader}>
            <h2 className={styles.sectionTitle}>멘토링 후기</h2>
            <button className={styles.moreButton}>전체보기</button>
          </div>
          {MENTOR_REVIEWS.map((review) => (
            <div
              key={review.id}
              className={styles.reviewCard}
              onClick={() => navigate('/exchange/mentoring/review')}
              style={{ cursor: 'pointer' }}
            >
              <div className={styles.reviewImage}>
                <img src={review.image} alt="" />
              </div>
              <div className={styles.reviewContent}>
                <div className={styles.reviewAuthorRow}>
                  <span className={styles.reviewAuthor}>{review.author}</span>
                  <img src={dividerIcon} alt="" className={styles.reviewDivider} />
                  <span className={styles.reviewMentor}>{review.mentorName}</span>
                </div>
                <p className={styles.reviewText}>{review.content}</p>
              </div>
            </div>
          ))}
        </section>
      </div>
    </div>
  )
}

export default MentoringPage
