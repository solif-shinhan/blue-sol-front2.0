import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import styles from './NetworkAdd.module.css'
import { INTEREST_USERS } from '../constants'

// SOLID 카드 데이터
const SOLID_CARDS = [
  {
    id: 1,
    name: '강건우',
    badge: '새싹',
    goal: '한체대 27학번 입학하기',
    tags: [
      { label: '활동적', type: 'primary' },
      { label: '스터디', type: 'primary' },
      { label: '전공과', type: 'secondary' },
    ],
  },
  {
    id: 2,
    name: '김민서',
    badge: '새싹',
    goal: '1학기 학점 4.4점 달성하기',
    tags: [
      { label: '한국대', type: 'primary' },
      { label: '경영학과', type: 'secondary' },
    ],
  },
  {
    id: 3,
    name: '안솔인',
    badge: '새싹',
    goal: '지속적인 봉사 활동하기',
    tags: [
      { label: '봉사', type: 'primary' },
      { label: '한국대', type: 'primary' },
      { label: '개발', type: 'secondary' },
    ],
  },
  {
    id: 4,
    name: '김철수',
    badge: '새싹',
    goal: '한체대 27학번 입학하기',
    tags: [
      { label: '활동적', type: 'primary' },
      { label: '컴퓨터공학과', type: 'secondary' },
    ],
  },
]

function NetworkAddPage() {
  const navigate = useNavigate()
  const [isSearchActive, setIsSearchActive] = useState(false)
  const [searchQuery, setSearchQuery] = useState('')

  const handleBack = () => {
    navigate(-1)
  }

  const handleSearchClick = () => {
    setIsSearchActive(true)
  }

  const handleSearchBack = () => {
    setIsSearchActive(false)
    setSearchQuery('')
  }

  return (
    <div className={styles.container}>
      {/* 헤더 */}
      <header className={styles.header}>
        <button className={styles.backButton} onClick={isSearchActive ? handleSearchBack : handleBack}>
          <svg width="10" height="18" viewBox="0 0 10 18" fill="none">
            <path d="M9 1L1 9L9 17" stroke="#222222" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        </button>
        {isSearchActive ? (
          <div className={styles.searchInputWrapper}>
            <input
              type="text"
              className={styles.searchInput}
              placeholder="검색어를 입력하세요"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              autoFocus
            />
          </div>
        ) : (
          <h1 className={styles.headerTitle}>교류망 추가하기</h1>
        )}
        <button className={styles.searchButton} onClick={handleSearchClick}>
          <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
            <circle cx="8.5" cy="8.5" r="7" stroke="#222222" strokeWidth="1.8"/>
            <path d="M14 14L18 18" stroke="#222222" strokeWidth="1.8" strokeLinecap="round"/>
          </svg>
        </button>
      </header>

      {/* 나와 같은 관심사 섹션 */}
      <section className={styles.interestSection}>
        <h2 className={styles.sectionTitle}>나와 같은 관심사를 가지고 있어요</h2>
        <div className={styles.interestScroll}>
          {INTEREST_USERS.map((user) => (
            <div key={user.id} className={styles.interestUser}>
              <div className={styles.interestAvatar}></div>
              <span className={styles.interestName}>{user.name}</span>
            </div>
          ))}
        </div>
      </section>

      {/* 다른 사람들의 SOLID 둘러보기 */}
      <section className={styles.solidSection}>
        <h2 className={styles.sectionTitle}>다른 사람들의 SOLID 둘러보기</h2>
        <div className={styles.cardList}>
          {SOLID_CARDS.map((card) => (
            <div key={card.id} className={styles.solidCard}>
              <div className={styles.cardContent}>
                <div className={styles.cardHeader}>
                  <span className={styles.cardName}>{card.name}</span>
                  <span className={styles.cardDivider}>|</span>
                  <span className={styles.cardBadge}>{card.badge}</span>
                </div>
                <p className={styles.cardGoal}>{card.goal}</p>
                <div className={styles.cardTags}>
                  {card.tags.map((tag, idx) => (
                    <span
                      key={idx}
                      className={`${styles.tag} ${tag.type === 'primary' ? styles.tagPrimary : styles.tagSecondary}`}
                    >
                      {tag.label}
                    </span>
                  ))}
                </div>
              </div>
              <div className={styles.cardImage}></div>
            </div>
          ))}
        </div>
      </section>
    </div>
  )
}

export default NetworkAddPage
