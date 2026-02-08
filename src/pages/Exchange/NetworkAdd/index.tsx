import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import styles1 from './NetworkAdd-1.module.css'
import styles2 from './NetworkAdd-2.module.css'
import backArrowIcon from '@/assets/images/IOS Arrow/undefined/Glyph_ undefined.svg'
import searchIcon from '@/assets/images/exchange-mentoring/search.svg'
import dismissIcon from '@/assets/images/solid/icon-dismiss.svg'
import {
  getNetworkRecommendations,
  searchNetwork,
  addToNetwork,
  type RecommendationUser,
  type SearchUser,
} from '@/services'

const styles = { ...styles1, ...styles2 }

const API_BASE = import.meta.env.VITE_API_URL || 'https://stg-api.bluesol.site'

/** 상대 경로를 전체 URL로 변환 (characters/char_1.svg → https://…/characters/char_1.svg) */
const toFullUrl = (path: string | null | undefined): string | undefined => {
  if (!path) return undefined
  if (path.startsWith('http')) return path
  return `${API_BASE}/${path}`
}

const FILTER_OPTIONS = ['전체', '중고생', '대학생', '졸업생'] as const
const TAG_DOT_COLORS = ['#4CAF50', '#FF5252', '#FF9800', '#64B5F6', '#BA68C8']
const DEFAULT_GRADIENTS = [
  'linear-gradient(rgba(171, 200, 255, 0.6) 0%, rgba(255, 233, 226, 0.6) 100%), linear-gradient(90deg, #FFFFFF 0%, #FFFFFF 100%)',
  'linear-gradient(rgba(171, 227, 255, 0.6) 0%, rgba(222, 223, 255, 0.6) 100%), linear-gradient(90deg, #FFFFFF 0%, #FFFFFF 100%)',
  'linear-gradient(rgba(184, 171, 255, 0.6) 0%, rgba(255, 226, 234, 0.6) 100%), linear-gradient(90deg, #FFFFFF 0%, #FFFFFF 100%)',
  'linear-gradient(rgba(255, 226, 179, 0.6) 0%, rgba(255, 200, 200, 0.6) 100%), linear-gradient(90deg, #FFFFFF 0%, #FFFFFF 100%)',
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
      {isSearchActive ? (
        <header className={styles.searchHeader}>
          <button className={styles.dismissButton} onClick={handleSearchBack}>
            <img src={dismissIcon} alt="닫기" />
          </button>
          <div className={styles.searchBar}>
            <img src={searchIcon} alt="검색" className={styles.searchBarIcon} />
            <input
              type="text"
              className={styles.searchInput}
              placeholder="검색어를 입력하세요"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              autoFocus
            />
          </div>
        </header>
      ) : (
        <header className={styles.header}>
          <div className={styles.headerLeft}>
            <button className={styles.backButton} onClick={handleBack}>
              <img src={backArrowIcon} alt="뒤로가기" />
            </button>
            <h1 className={styles.headerTitle}>교류망 추가하기</h1>
          </div>
          <button className={styles.searchButton} onClick={handleSearchClick}>
            <img src={searchIcon} alt="검색" />
          </button>
        </header>
      )}

      {isSearchActive && (
        <section className={styles.searchResultSection}>
          {isSearching ? (
            <p className={styles.loadingText}>검색 중...</p>
          ) : searchResults.length > 0 ? (
            <div className={styles.profileList}>
              {searchResults.map((user) => (
                <div key={user.userId} className={styles.profileItem}>
                  <div
                    className={styles.profileAvatar}
                    style={{
                      background: toFullUrl(user.backgroundImageUrl || user.backgroundPattern)
                        ? `url(${toFullUrl(user.backgroundImageUrl || user.backgroundPattern)}) center/cover`
                        : DEFAULT_GRADIENTS[user.userId % DEFAULT_GRADIENTS.length]
                    }}
                  >
                    {toFullUrl(user.characterImageUrl || user.character) && (
                      <img src={toFullUrl(user.characterImageUrl || user.character)} alt={user.userName} className={styles.avatarImg} />
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
                      onClick={() => navigate(`/exchange/network/friend/${user.userId}`, {
                        state: {
                          userName: user.userName,
                          character: user.character,
                          characterImageUrl: user.characterImageUrl,
                          backgroundPattern: user.backgroundPattern,
                          backgroundImageUrl: user.backgroundImageUrl,
                          solidGoalName: user.solidGoalName,
                          interests: user.interests,
                          councilName: user.councilName,
                        }
                      })}
                    >
                      <div
                        className={styles.cardGradient}
                        style={{
                          background: toFullUrl(user.backgroundImageUrl || user.backgroundPattern)
                            ? `url(${toFullUrl(user.backgroundImageUrl || user.backgroundPattern)}) center/cover`
                            : DEFAULT_GRADIENTS[index % DEFAULT_GRADIENTS.length]
                        }}
                      >
                        {toFullUrl(user.characterImageUrl || user.character) && (
                          <img
                            src={toFullUrl(user.characterImageUrl || user.character)}
                            alt={user.userName}
                            className={styles.cardCharacterImg}
                          />
                        )}
                        <div className={styles.cardNameOverlay}>
                          <span className={styles.cardUserName}>{user.userName}</span>
                        </div>
                      </div>
                      <div className={styles.cardContent}>
                        <div className={styles.cardTags}>
                          {user.interests?.slice(0, 3).map((interest, i) => (
                            <span key={i} className={styles.cardTag}>
                              <span
                                className={styles.tagDot}
                                style={{ background: TAG_DOT_COLORS[i % TAG_DOT_COLORS.length] }}
                              />
                              {interest}
                            </span>
                          ))}
                        </div>
                        <div className={styles.cardFooter}>
                          <p className={styles.cardFooterText}>
                            SOLID를 교환하고<br />서로의 목표를 응원해주세요
                          </p>
                        </div>
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
                  {allUsers.map((user, index) => (
                    <div key={user.userId} className={styles.profileItem}>
                      <div
                        className={styles.profileAvatar}
                        style={{
                          background: toFullUrl(user.backgroundImageUrl || user.backgroundPattern)
                            ? `url(${toFullUrl(user.backgroundImageUrl || user.backgroundPattern)}) center/cover`
                            : DEFAULT_GRADIENTS[index % DEFAULT_GRADIENTS.length]
                        }}
                      >
                        {toFullUrl(user.characterImageUrl || user.character) ? (
                          <img src={toFullUrl(user.characterImageUrl || user.character)!} alt={user.userName} className={styles.avatarImg} />
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
