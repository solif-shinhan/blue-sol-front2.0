import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import styles1 from './Mentoring-1.module.css'
import styles2 from './Mentoring-2.module.css'
import { mentoringApi } from '@/api'
import type {
  MentorSummary,
  PeerUser,
  MentoringReviewSummary,
} from '@/api'

const styles = { ...styles1, ...styles2 }

import backArrowIcon from '@/assets/images/exchange-mentoring/back-arrow.svg'
import calendarIcon from '@/assets/images/exchange-mentoring/calendar.svg'
import searchIcon from '@/assets/images/exchange-mentoring/search.svg'

const MENTOR_FILTER_TABS = ['전체', '학업고민', '취업고민', '인생의 멘토'] as const
type MentorFilterTab = (typeof MENTOR_FILTER_TABS)[number]

const PEER_TABS = ['응원하기', '경험 나누기'] as const
type PeerTab = (typeof PEER_TABS)[number]

function MentoringPage() {
  const navigate = useNavigate()
  const [activeMentorFilter, setActiveMentorFilter] = useState<MentorFilterTab>('전체')
  const [activePeerTab, setActivePeerTab] = useState<PeerTab>('응원하기')
  const [isSearchMode, setIsSearchMode] = useState(false)
  const [searchQuery, setSearchQuery] = useState('')
  const [isLoading, setIsLoading] = useState(true)

  // API 데이터
  const [allMentors, setAllMentors] = useState<MentorSummary[]>([])
  const [studyMentors, setStudyMentors] = useState<MentorSummary[]>([])
  const [jobMentors, setJobMentors] = useState<MentorSummary[]>([])
  const [lifeMentors, setLifeMentors] = useState<MentorSummary[]>([])
  const [cheerList, setCheerList] = useState<PeerUser[]>([])
  const [helpList, setHelpList] = useState<PeerUser[]>([])
  const [reviews, setReviews] = useState<MentoringReviewSummary[]>([])

  useEffect(() => {
    const fetchHome = async () => {
      try {
        setIsLoading(true)
        const res = await mentoringApi.getHome()
        if (res.success && res.data) {
          setAllMentors(res.data.allMentors ?? [])
          setStudyMentors(res.data.studyMentors ?? [])
          setJobMentors(res.data.jobMentors ?? [])
          setLifeMentors(res.data.lifeMentors ?? [])
          setCheerList(res.data.cheerList?.users ?? [])
          setHelpList(res.data.helpList?.users ?? [])
          setReviews(res.data.reviews ?? [])
        }
      } catch (err) {
        console.error('멘토링 홈 조회 실패:', err)
      } finally {
        setIsLoading(false)
      }
    }
    fetchHome()
  }, [])

  // 필터에 따른 멘토 목록
  const getFilteredMentors = (): MentorSummary[] => {
    switch (activeMentorFilter) {
      case '학업고민':
        return studyMentors
      case '취업고민':
        return jobMentors
      case '인생의 멘토':
        return lifeMentors
      default:
        return allMentors
    }
  }

  // 탭에 따른 선후배 목록
  const getPeerUsers = (): PeerUser[] => {
    return activePeerTab === '응원하기' ? cheerList : helpList
  }

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

  const filteredMentors = getFilteredMentors()
  const peerUsers = getPeerUsers()

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
            {isLoading ? (
              <p style={{ color: '#848484', fontSize: 14, padding: '20px 0' }}>로딩 중...</p>
            ) : filteredMentors.length === 0 ? (
              <p style={{ color: '#848484', fontSize: 14, padding: '20px 0' }}>등록된 멘토가 없습니다.</p>
            ) : (
              filteredMentors.map((mentor) => (
                <div key={mentor.mentorId} className={styles.mentorCard}>
                  <div className={styles.mentorCardImage}>
                    <div className={styles.mentorCardImageInner}>
                      {mentor.profileImageUrl && (
                        <img src={mentor.profileImageUrl} alt={mentor.mentorName} />
                      )}
                    </div>
                    <div className={styles.mentorCardGradient} />
                  </div>
                  <div className={styles.mentorCardBottom}>
                    <div className={styles.mentorInfo}>
                      <div className={styles.mentorNameRow}>
                        <span className={styles.mentorName}>{mentor.mentorName}</span>
                        <span className={styles.mentorRole}>멘토</span>
                      </div>
                      <p className={styles.mentorOrg}>{mentor.mentorTitle}</p>
                    </div>
                    <div className={styles.mentorActionWrapper}>
                      <button
                        className={styles.mentorApplyButton}
                        onClick={() => handleMentoringApply(mentor.mentorId)}
                      >
                        <span>멘토링 신청</span>
                      </button>
                    </div>
                  </div>
                </div>
              ))
            )}
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
            {isLoading ? (
              <p style={{ color: '#848484', fontSize: 14, padding: '20px 0' }}>로딩 중...</p>
            ) : peerUsers.length === 0 ? (
              <p style={{ color: '#848484', fontSize: 14, padding: '20px 0' }}>목록이 비어있습니다.</p>
            ) : (
              peerUsers.map((peer) => (
                <div key={peer.userId} className={styles.peerCard}>
                  <div className={styles.peerCardHeader}>
                    <span className={styles.peerCardBrand}>SOLID</span>
                  </div>
                  <div className={styles.peerCardBody}>
                    <span className={styles.peerName}>{peer.userName}</span>
                    <span className={styles.peerSchool}>{peer.solidGoalName}</span>
                    {peer.interests && peer.interests.length > 0 && (
                      <div className={styles.peerInterests}>
                        {peer.interests.map((interest, idx) => (
                          <span key={idx} className={styles.peerInterestTag}>
                            {interest}
                          </span>
                        ))}
                      </div>
                    )}
                  </div>
                  {peer.status === 'PENDING' && (
                    <div className={styles.peerStatusBadge}>
                      <span>대기중</span>
                    </div>
                  )}
                  {peer.status === 'CONNECTED' && (
                    <div className={styles.peerStatusBadge} style={{ backgroundColor: '#E6FFE6' }}>
                      <span style={{ color: '#2E8B57' }}>연결됨</span>
                    </div>
                  )}
                </div>
              ))
            )}
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
            {isLoading ? (
              <p style={{ color: '#848484', fontSize: 14, padding: '20px 0' }}>로딩 중...</p>
            ) : reviews.length === 0 ? (
              <p style={{ color: '#848484', fontSize: 14, padding: '20px 0' }}>후기가 없습니다.</p>
            ) : (
              reviews.map((review) => (
                <div
                  key={review.postId}
                  className={styles.reviewCard}
                  onClick={() => navigate('/exchange/mentoring/review')}
                  style={{ cursor: 'pointer' }}
                >
                  <div className={styles.reviewContent}>
                    <div className={styles.reviewMeta}>
                      <span className={styles.reviewMentorName}>{review.authorName}</span>
                      <span className={styles.reviewMetaDivider}>|</span>
                      <span className={styles.reviewMetaInfo}>👁 {review.viewCount}</span>
                    </div>
                    <h3 className={styles.reviewTitle}>{review.title}</h3>
                  </div>
                </div>
              ))
            )}
          </div>
        </section>
      </div>
    </div>
  )
}

export default MentoringPage
