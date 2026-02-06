import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import styles1 from './NetworkAdd-1.module.css'
import styles2 from './NetworkAdd-2.module.css'

const styles = { ...styles1, ...styles2 }
import {
  getNetworkRecommendations,
  searchNetwork,
  addToNetwork,
  type RecommendationUser,
  type SearchUser,
} from '@/services'

const FILTER_OPTIONS = ['전체', '중고생', '대학생', '졸업생'] as const
const TAG_DOT_COLORS = ['#4CAF50', '#FF5252', '#FF9800', '#64B5F6', '#BA68C8']
const DEFAULT_GRADIENTS = [
  'linear-gradient(180deg, #F2D5E0 0%, #E8C5D8 50%, #F5E1EC 100%)',
  'linear-gradient(180deg, #FFE0B2 0%, #FFCC80 50%, #FFE8CC 100%)',
  'linear-gradient(180deg, #C5CAE9 0%, #B3BAE0 50%, #D1D9FF 100%)',
  'linear-gradient(180deg, #B2DFDB 0%, #80CBC4 50%, #C8E6C9 100%)',
]

function NetworkAddPage() {
  const navigate = useNavigate()
  const [isSearchActive, setIsSearchActive] = useState(false)
  const [searchQuery, setSearchQuery] = useState('')
  const [searchResults, setSearchResults] = useState<SearchUser[]>([])
  const [isSearching, setIsSearching] = useState(false)
  const [selectedFilter, setSelectedFilter] = useState<string>('전체')

  const [interestBasedUsers, setInterestBasedUsers] = useState<RecommendationUser[]>([])
  const [allUsers, setAllUsers] = useState<RecommendationUser[]>([])
  const [interestTitle, setInterestTitle] = useState('')
  const [isLoading, setIsLoading] = useState(true)
  const [addingUserId, setAddingUserId] = useState<number | null>(null)

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

  useEffect(() => {
    if (!isSearchActive || !searchQuery.trim()) {
      setSearchResults([])
      return
    }
    const timer = setTimeout(() => { handleSearch() }, 300)
    return () => clearTimeout(timer)
  }, [searchQuery, isSearchActive])

  const handleBack = () => navigate(-1)
  const handleSearchClick = () => setIsSearchActive(true)
  const handleSearchBack = () => {
    setIsSearchActive(false)
    setSearchQuery('')
    setSearchResults([])
  }

  const handleAddToNetwork = async (userId: number) => {
    if (addingUserId) return
    setAddingUserId(userId)
    try {
      const response = await addToNetwork({ targetUserId: userId })
      if (response.success) {
        alert(`${response.data.targetUserName}님을 교류망에 추가했습니다!`)
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

      {isSearchActive && (
        <section className={styles.searchResultSection}>
          {isSearching ? (
            <p className={styles.loadingText}>검색 중...</p>
          ) : searchResults.length > 0 ? (
            <div className={styles.profileList}>
              {searchResults.map((user) => (
                <div key={user.userId} className={styles.profileItem}>
                  <div className={styles.profileAvatar}>
                    {user.character && (
                      <img src={user.character} alt={user.userName} className={styles.avatarImg} />
                    )}
                  </div>
                  <div className={styles.profileInfo}>
                    <span className={styles.profileName}>{user.userName}</span>
                    <span className={styles.profileAffiliation}>
                      {user.councilName || user.solidGoalName}
                    </span>
                  </div>
                  <div className={styles.profileAction}>
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
                <div className={styles.cardScroll}>
                  {interestBasedUsers.map((user, index) => (
                    <div
                      key={user.userId}
                      className={styles.interestCard}
                      onClick={() => handleAddToNetwork(user.userId)}
                    >
                      <div
                        className={styles.cardGradient}
                        style={{
                          background: user.backgroundPattern || DEFAULT_GRADIENTS[index % DEFAULT_GRADIENTS.length]
                        }}
                      >
                        <div className={styles.cardAvatarArea}>
                          {user.character ? (
                            <img src={user.character} alt={user.userName} className={styles.cardAvatarImg} />
                          ) : (
                            <div className={styles.cardAvatarPlaceholder} />
                          )}
                        </div>
                        <div className={styles.cardInfoArea}>
                          <span className={styles.cardUserName}>{user.userName}</span>
                          <span className={styles.cardDesc}>{user.solidGoalName}</span>
                          <div className={styles.cardTags}>
                            {user.interests?.slice(0, 2).map((interest, i) => (
                              <span key={i} className={styles.cardTag}>
                                <span
                                  className={styles.tagDot}
                                  style={{ background: TAG_DOT_COLORS[i % TAG_DOT_COLORS.length] }}
                                />
                                {interest}
                              </span>
                            ))}
                          </div>
                        </div>
                      </div>
                      <div className={styles.cardFooter}>
                        <p className={styles.cardFooterText}>
                          SOLID를 교환하고<br/>서로의 목표를 응원해주세요
                        </p>
                      </div>
                    </div>
                  ))}
                  {interestBasedUsers.length === 0 && (
                    <p className={styles.emptyText}>추천 사용자가 없습니다.</p>
                  )}
                </div>
              </section>

              <div className={styles.divider} />

              <section className={styles.browseSection}>
                <div className={styles.browseTitleRow}>
                  <h2 className={styles.browseSectionTitle}>다른 사람 둘러보기</h2>
                  <button
                    className={styles.myNetworkLink}
                    onClick={() => navigate('/exchange/network')}
                  >
                    나의 교류망
                  </button>
                </div>
                <div className={styles.filterRow}>
                  {FILTER_OPTIONS.map((option) => (
                    <button
                      key={option}
                      className={`${styles.filterChip} ${selectedFilter === option ? styles.filterChipActive : ''}`}
                      onClick={() => setSelectedFilter(option)}
                    >
                      {option}
                    </button>
                  ))}
                </div>
                <div className={styles.profileList}>
                  {allUsers.map((user) => (
                    <div key={user.userId} className={styles.profileItem}>
                      <div className={styles.profileAvatar}>
                        {user.character ? (
                          <img src={user.character} alt={user.userName} className={styles.avatarImg} />
                        ) : (
                          <div className={styles.avatarPlaceholder} />
                        )}
                      </div>
                      <div className={styles.profileInfo}>
                        <span className={styles.profileName}>{user.userName}</span>
                        <span className={styles.profileAffiliation}>
                          {user.councilName || user.solidGoalName}
                        </span>
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
