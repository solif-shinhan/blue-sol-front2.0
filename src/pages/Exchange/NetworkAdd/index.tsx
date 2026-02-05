import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import styles from './NetworkAdd.module.css'
import {
  getNetworkRecommendations,
  searchNetwork,
  addToNetwork,
  type RecommendationUser,
  type SearchUser,
} from '@/services'

function NetworkAddPage() {
  const navigate = useNavigate()
  const [isSearchActive, setIsSearchActive] = useState(false)
  const [searchQuery, setSearchQuery] = useState('')
  const [searchResults, setSearchResults] = useState<SearchUser[]>([])
  const [isSearching, setIsSearching] = useState(false)

  const [interestBasedUsers, setInterestBasedUsers] = useState<RecommendationUser[]>([])
  const [allUsers, setAllUsers] = useState<RecommendationUser[]>([])
  const [interestTitle, setInterestTitle] = useState('')
  const [isLoading, setIsLoading] = useState(true)
  const [addingUserId, setAddingUserId] = useState<number | null>(null)

  // 추천 목록 조회
  const fetchRecommendations = async () => {
    setIsLoading(true)
    try {
      const response = await getNetworkRecommendations()
      if (response.success) {
        setInterestBasedUsers(response.data.interestBased.users)
        setInterestTitle(response.data.interestBased.title)
        setAllUsers(response.data.allUsers.users)
      }
    } catch (err) {
      console.error('추천 조회 실패:', err)
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    fetchRecommendations()
  }, [])

  // 검색
  const handleSearch = async () => {
    if (!searchQuery.trim()) return

    setIsSearching(true)
    try {
      const response = await searchNetwork(searchQuery)
      if (response.success) {
        setSearchResults(response.data.users)
      }
    } catch (err) {
      console.error('검색 실패:', err)
    } finally {
      setIsSearching(false)
    }
  }

  // 검색어 변경 시 자동 검색 (디바운스)
  useEffect(() => {
    if (!isSearchActive || !searchQuery.trim()) {
      setSearchResults([])
      return
    }

    const timer = setTimeout(() => {
      handleSearch()
    }, 300)

    return () => clearTimeout(timer)
  }, [searchQuery, isSearchActive])

  const handleBack = () => {
    navigate(-1)
  }

  const handleSearchClick = () => {
    setIsSearchActive(true)
  }

  const handleSearchBack = () => {
    setIsSearchActive(false)
    setSearchQuery('')
    setSearchResults([])
  }

  // 교류망 추가
  const handleAddToNetwork = async (userId: number) => {
    if (addingUserId) return

    setAddingUserId(userId)
    try {
      const response = await addToNetwork({ targetUserId: userId })
      if (response.success) {
        alert(`${response.data.targetUserName}님을 교류망에 추가했습니다!`)
        // 추천 목록 새로고침
        fetchRecommendations()
      }
    } catch (err) {
      console.error('교류망 추가 실패:', err)
      alert('교류망 추가에 실패했습니다.')
    } finally {
      setAddingUserId(null)
    }
  }

  return (
    <div className={styles.container}>
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

      {/* 검색 결과 */}
      {isSearchActive && (
        <section className={styles.searchResultSection}>
          {isSearching ? (
            <p className={styles.loadingText}>검색 중...</p>
          ) : searchResults.length > 0 ? (
            <div className={styles.cardList}>
              {searchResults.map((user) => (
                <div key={user.userId} className={styles.solidCard}>
                  <div className={styles.cardContent}>
                    <div className={styles.cardHeader}>
                      <span className={styles.cardName}>{user.userName}</span>
                      {user.isInCouncil && user.councilName && (
                        <>
                          <span className={styles.cardDivider}>|</span>
                          <span className={styles.cardBadge}>{user.councilName}</span>
                        </>
                      )}
                    </div>
                    <p className={styles.cardGoal}>{user.solidGoalName}</p>
                    <div className={styles.cardTags}>
                      {user.interests?.slice(0, 3).map((interest, idx) => (
                        <span key={idx} className={`${styles.tag} ${styles.tagPrimary}`}>
                          {interest}
                        </span>
                      ))}
                    </div>
                  </div>
                  <div className={styles.cardActions}>
                    {user.isConnected ? (
                      <span className={styles.connectedBadge}>추가됨</span>
                    ) : (
                      <button
                        className={styles.addButton}
                        onClick={() => handleAddToNetwork(user.userId)}
                        disabled={addingUserId === user.userId}
                      >
                        {addingUserId === user.userId ? '추가 중...' : '추가'}
                      </button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          ) : searchQuery.trim() ? (
            <p className={styles.emptyText}>검색 결과가 없습니다.</p>
          ) : null}
        </section>
      )}

      {/* 추천 목록 */}
      {!isSearchActive && (
        <>
          {isLoading ? (
            <div className={styles.loadingState}>
              <p>로딩 중...</p>
            </div>
          ) : (
            <>
              <section className={styles.interestSection}>
                <h2 className={styles.sectionTitle}>
                  {interestTitle || '나와 같은 관심사를 가지고 있어요'}
                </h2>
                <div className={styles.interestScroll}>
                  {interestBasedUsers.map((user) => (
                    <div
                      key={user.userId}
                      className={styles.interestUser}
                      onClick={() => handleAddToNetwork(user.userId)}
                    >
                      <div className={styles.interestAvatar}></div>
                      <span className={styles.interestName}>{user.userName}</span>
                    </div>
                  ))}
                  {interestBasedUsers.length === 0 && (
                    <p className={styles.emptyText}>추천 사용자가 없습니다.</p>
                  )}
                </div>
              </section>

              <section className={styles.solidSection}>
                <h2 className={styles.sectionTitle}>다른 사람들의 SOLID 둘러보기</h2>
                <div className={styles.cardList}>
                  {allUsers.map((user) => (
                    <div key={user.userId} className={styles.solidCard}>
                      <div className={styles.cardContent}>
                        <div className={styles.cardHeader}>
                          <span className={styles.cardName}>{user.userName}</span>
                          {user.isInCouncil && user.councilName && (
                            <>
                              <span className={styles.cardDivider}>|</span>
                              <span className={styles.cardBadge}>{user.councilName}</span>
                            </>
                          )}
                        </div>
                        <p className={styles.cardGoal}>{user.solidGoalName}</p>
                        <div className={styles.cardTags}>
                          {user.interests?.slice(0, 3).map((interest, idx) => (
                            <span key={idx} className={`${styles.tag} ${styles.tagPrimary}`}>
                              {interest}
                            </span>
                          ))}
                        </div>
                      </div>
                      <div className={styles.cardActions}>
                        <button
                          className={styles.addButton}
                          onClick={() => handleAddToNetwork(user.userId)}
                          disabled={addingUserId === user.userId}
                        >
                          {addingUserId === user.userId ? '추가 중...' : '추가'}
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </section>
            </>
          )}
        </>
      )}
    </div>
  )
}

export default NetworkAddPage
