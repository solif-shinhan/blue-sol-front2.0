import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import styles1 from './Mentoring-1.module.css'
import styles2 from './Mentoring-2.module.css'

const styles = { ...styles1, ...styles2 }

import backArrowIcon from '@/assets/images/exchange-mentoring/back-arrow.svg'
import calendarIcon from '@/assets/images/exchange-mentoring/calendar.svg'
import searchIcon from '@/assets/images/exchange-mentoring/search.svg'

const MENTOR_FILTER_TABS = ['전체', '학업고민', '취업고민', '인생의 멘토']

const PEER_TABS = ['응원하기', '경험 나누기']

// TODO: API 연동 시 교체 - GET 전문가 멘토 목록 조회
const MENTORS = [
  {
    id: 1,
    name: '선석근',
    role: '멘토',
    organization: '신한금융희망재단 동행 팀장',
    image: '',
  },
  {
    id: 2,
    name: '고석헌',
    role: '멘토',
    organization: '신한금융지주 부사장',
    image: '',
  },
]

// TODO: API 연동 시 교체 - 선후배 멘토링 (SOLID 카드)
const PEER_MENTORS = [
  {
    id: 1,
    name: '한동영',
    school: '체육고사장나무',
    interests: ['농구', '봉사활동'],
    status: '대기중',
    image: '',
  },
  {
    id: 2,
    name: '박지원',
    school: '체육고사장나무',
    interests: ['농구', '봉사활동'],
    details: ['한체대 27학번으로 입학하기', '체육대회 우승하기', '가족 여행 가기'],
    schoolFull: '서울 영문고등학교',
    image: '',
  },
]

// TODO: API 연동 시 교체 - 멘토링 후기
const MENTOR_REVIEWS = [
  {
    id: 1,
    mentorName: '신한철 멘토님',
    views: 25,
    likes: 8,
    date: '2026.02.19',
    title: '진로진학 멘토링 후기',
    content:
      '신한철 멘토님께 대학 입시 컨설팅을 받았습니다. 제가 생각하지 못했던 지점을 바로...',
    image: '',
  },
  {
    id: 2,
    mentorName: '박준호 멘토님',
    views: 25,
    likes: 8,
    date: '2025.12.26',
    title: '박준호 강사님 멘토링 후기',
    content:
      '대학원 진학과 취업 사이의 선택에 대해 상담을 받았습니다. 단순히 선택 문제...',
    image: '',
  },
  {
    id: 3,
    mentorName: '최민지 멘토님',
    views: 0,
    likes: 0,
    date: '2025.11.27',
    title: '자기소개서와 면접 멘토링',
    content:
      '표현 방식보다 논리 구조가 더 중요하다는 점을 인식했고, 경험을 \'성과 중심\'으...',
    image: '',
  },
]

function MentoringPage() {
  const navigate = useNavigate()
  const [activeMentorFilter, setActiveMentorFilter] = useState('전체')
  const [activePeerTab, setActivePeerTab] = useState('응원하기')
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
              src={calendarIcon}
              alt="캘린더"
              className={styles.headerIcon}
              onClick={() => navigate('/exchange/mentoring/history')}
              style={{ cursor: 'pointer' }}
            />
            <img
              src={searchIcon}
              alt="검색"
              className={styles.headerSearchIcon}
              onClick={handleSearchClick}
            />
          </div>
        </header>
      )}

      <div className={styles.content}>
        {/* 전문가 멘토링 */}
        <section className={styles.section}>
          <div className={styles.sectionHeader}>
            <h2 className={styles.sectionTitle}>전문가 멘토링</h2>
          </div>

          <div className={styles.filterTabs}>
            {MENTOR_FILTER_TABS.map((tab) => (
              <button
                key={tab}
                className={`${styles.filterTab} ${activeMentorFilter === tab ? styles.filterTabActiveBlue : ''}`}
                onClick={() => setActiveMentorFilter(tab)}
              >
                {tab}
              </button>
            ))}
          </div>

          <div className={styles.mentorCardsContainer}>
            {MENTORS.map((mentor) => (
              <div key={mentor.id} className={styles.mentorCard}>
                <div className={styles.mentorCardImage}>
                  <div className={styles.mentorCardImageInner}>
                    {mentor.image && <img src={mentor.image} alt={mentor.name} />}
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
                      <span>멘토링 신청</span>
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* 선후배 멘토링 */}
        <section className={styles.section}>
          <div className={styles.sectionHeader}>
            <h2 className={styles.sectionTitle}>선후배 멘토링</h2>
            <button className={styles.moreButton} onClick={() => navigate('/exchange/network')}>나의 교류망</button>
          </div>

          <div className={styles.filterTabs}>
            {PEER_TABS.map((tab) => (
              <button
                key={tab}
                className={`${styles.filterTab} ${activePeerTab === tab ? styles.filterTabActiveBlue : ''}`}
                onClick={() => setActivePeerTab(tab)}
              >
                {tab}
              </button>
            ))}
          </div>

          <div className={styles.peerCardsContainer}>
            {PEER_MENTORS.map((peer) => (
              <div key={peer.id} className={styles.peerCard}>
                <div className={styles.peerCardHeader}>
                  <span className={styles.peerCardBrand}>SOLID</span>
                </div>
                <div className={styles.peerCardBody}>
                  <span className={styles.peerName}>{peer.name}</span>
                  <span className={styles.peerSchool}>{peer.school}</span>
                  {peer.interests && (
                    <div className={styles.peerInterests}>
                      {peer.interests.map((interest, idx) => (
                        <span key={idx} className={styles.peerInterestTag}>
                          {interest}
                        </span>
                      ))}
                    </div>
                  )}
                  {peer.details && (
                    <div className={styles.peerDetails}>
                      {peer.details.map((detail, idx) => (
                        <p key={idx} className={styles.peerDetailText}>{detail}</p>
                      ))}
                    </div>
                  )}
                </div>
                {peer.status && (
                  <div className={styles.peerStatusBadge}>
                    <span>{peer.status}</span>
                  </div>
                )}
                {peer.schoolFull && (
                  <div className={styles.peerSchoolFull}>
                    <span>{peer.schoolFull}</span>
                    <span className={styles.peerSince}>SINCE</span>
                  </div>
                )}
              </div>
            ))}
          </div>
        </section>

        {/* 맞춤 멘토링 신청 엽서 */}
        <section className={styles.section}>
          <div className={styles.sectionHeader}>
            <h2 className={styles.sectionTitle}>원하는 멘토가 없다면, 신한이 도와줄께!</h2>
          </div>
          <div
            className={styles.customMentoringCard}
            onClick={() => navigate('/exchange/mentoring/postcard')}
            style={{ cursor: 'pointer' }}
          >
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
            <div className={styles.customMentoringIconWrapper}>
              <img src="" alt="우편함" className={styles.customMentoringMailbox} />
            </div>
          </div>
        </section>

        {/* 멘토링 후기 */}
        <section className={styles.section}>
          <div className={styles.sectionHeader}>
            <h2 className={styles.sectionTitle}>멘토링 후기</h2>
            <button
              className={styles.moreButton}
              onClick={() => navigate('/exchange/mentoring/review')}
            >
              전체보기
            </button>
          </div>

          <div className={styles.reviewList}>
            {MENTOR_REVIEWS.map((review) => (
              <div
                key={review.id}
                className={styles.reviewCard}
                onClick={() => navigate('/exchange/mentoring/review')}
                style={{ cursor: 'pointer' }}
              >
                <div className={styles.reviewContent}>
                  <div className={styles.reviewMeta}>
                    <span className={styles.reviewMentorName}>{review.mentorName}</span>
                    <span className={styles.reviewMetaDivider}>|</span>
                    <span className={styles.reviewMetaInfo}>👁 {review.views}</span>
                    <span className={styles.reviewMetaInfo}>♡ {review.likes}</span>
                    <span className={styles.reviewMetaDivider}>|</span>
                    <span className={styles.reviewMetaInfo}>{review.date}</span>
                  </div>
                  <h3 className={styles.reviewTitle}>{review.title}</h3>
                  <p className={styles.reviewText}>{review.content}</p>
                </div>
                {review.image && (
                  <div className={styles.reviewImageThumb}>
                    <img src={review.image} alt="" />
                  </div>
                )}
              </div>
            ))}
          </div>
        </section>
      </div>
    </div>
  )
}

export default MentoringPage
