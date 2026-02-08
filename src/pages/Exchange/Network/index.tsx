import { useState, useRef, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import styles1 from './Network-1.module.css'
import styles2 from './Network-2.module.css'
import backArrowIcon from '@/assets/images/network/2107e80ddcb5d091c59aaa449d05031a375ef1a0.svg'
import searchIcon from '@/assets/images/network/e1e12166e22b287c6f9f01541da749c3439b5ba2.svg'
import plusIcon from '@/assets/images/network/4de7b4619a8a7217458e36fa3215adb3643f60eb.svg'
import solidLogoWhiteSvg from '@/assets/images/network/e818367a0db04bf1988756d66e77bb070225c713.svg'
import moreDotsIcon from '@/assets/images/network/51d88d8a9f263d54e503fd4f7207cbac51f9793a.svg'
import {
  getNetworkList,
  sendInteraction,
  type NetworkCard,
  type NetworkFriend,
} from '@/services'

const styles = { ...styles1, ...styles2 }

const API_BASE = import.meta.env.VITE_API_URL || 'https://stg-api.bluesol.site'
const toFullUrl = (path: string | null | undefined): string | undefined => {
  if (!path) return undefined
  if (path.startsWith('http')) return path
  return `${API_BASE}/${path}`
}

const GRADIENT_MAP: Record<string, string> = {
  BLUE_PINK: 'linear-gradient(180deg, rgba(171,200,255,0.8) 0%, rgba(255,233,226,0.8) 100%)',
  BLUE_GRAY: 'linear-gradient(180deg, rgba(235,242,255,0.6) 0%, rgba(192,200,210,0.6) 100%)',
  PURPLE_PINK: 'linear-gradient(180deg, rgba(184,171,255,0.6) 0%, rgba(255,226,234,0.6) 100%)',
  BLUE_PURPLE: 'linear-gradient(180deg, rgba(171,227,255,0.6) 0%, rgba(222,223,255,0.6) 100%)',
  WARM_BLUE: 'linear-gradient(180deg, rgba(241,235,220,0.6) 29%, rgba(162,197,237,0.6) 100%)',
  TEAL_PINK: 'linear-gradient(180deg, rgba(194,229,237,0.6) 0%, rgba(225,189,196,0.6) 100%)',
  YELLOW_PINK: 'linear-gradient(180deg, rgba(242,242,176,0.6) 0%, rgba(255,226,236,0.6) 100%)',
  GREEN_BLUE: 'linear-gradient(180deg, rgba(223,249,213,0.6) 0%, rgba(174,229,242,0.6) 100%)',
}
const DEFAULT_GRADIENT = GRADIENT_MAP.BLUE_PINK

function getGradient(pattern: string): string {
  return GRADIENT_MAP[pattern] || DEFAULT_GRADIENT
}

function NetworkPage() {
  const navigate = useNavigate()
  const [friends, setFriends] = useState<NetworkFriend[]>([])
  const [networkCards, setNetworkCards] = useState<NetworkCard[]>([])
  const [activeIndex, setActiveIndex] = useState(0)
  const [isLoading, setIsLoading] = useState(true)
  const [isSending, setIsSending] = useState(false)

  const isDragging = useRef(false)
  const startX = useRef(0)

  useEffect(() => {
    const fetch = async () => {
      setIsLoading(true)
      try {
        const res = await getNetworkList()
        if (res.success) {
          setFriends(res.data.addedFriends)
          setNetworkCards(res.data.networkCards)
        }
      } catch (err) {
        console.error('교류망 조회 실패:', err)
      } finally {
        setIsLoading(false)
      }
    }
    fetch()
  }, [])

  const activeCard = networkCards[activeIndex]

  const handleBack = () => navigate('/exchange')
  const handleSearch = () => navigate('/exchange/network/add')

  const handleSelectFriend = (userId: number) => {
    const idx = networkCards.findIndex((c) => c.userId === userId)
    if (idx >= 0) setActiveIndex(idx)
  }

  const handleDragStart = (e: React.MouseEvent | React.TouchEvent) => {
    isDragging.current = true
    startX.current = 'touches' in e ? e.touches[0].pageX : e.pageX
  }

  const handleDragEnd = (e: React.MouseEvent | React.TouchEvent) => {
    if (!isDragging.current) return
    isDragging.current = false
    const endX = 'changedTouches' in e ? e.changedTouches[0].pageX : e.pageX
    const diff = startX.current - endX
    if (Math.abs(diff) > 50) {
      const next = activeIndex + (diff > 0 ? 1 : -1)
      if (next >= 0 && next < networkCards.length) setActiveIndex(next)
    }
  }

  const handleAction = async () => {
    if (!activeCard || isSending) return
    setIsSending(true)
    try {
      const res = await sendInteraction({
        targetUserId: activeCard.userId,
        interactionType: activeCard.buttonType === 'CHEER' ? 'CHEER' : 'SHARE_EXPERIENCE',
      })
      if (res.success) {
        alert(activeCard.buttonType === 'CHEER' ? '응원을 보냈습니다!' : '경험 나누기를 보냈습니다!')
      }
    } catch {
      alert('요청에 실패했습니다.')
    } finally {
      setIsSending(false)
    }
  }

  const handleMessage = () => {
    if (activeCard) navigate(`/notifications/message/compose?userId=${activeCard.userId}`)
  }

  // 캐러셀 translateX: 카드 중앙 정렬
  const trackX = 51.5 - activeIndex * 306

  const renderHeader = () => (
    <header className={styles.header}>
      <div className={styles.headerLeft}>
        <button className={styles.backButton} onClick={handleBack}>
          <img src={backArrowIcon} alt="뒤로가기" />
        </button>
        <h1 className={styles.headerTitle}>나의 교류망</h1>
      </div>
      <button className={styles.searchButton} onClick={handleSearch}>
        <img src={searchIcon} alt="검색" />
      </button>
    </header>
  )

  if (isLoading) {
    return (
      <div className={styles.container}>
        {renderHeader()}
        <div className={styles.loadingState}><p>로딩 중...</p></div>
      </div>
    )
  }

  if (friends.length === 0) {
    return (
      <div className={styles.container}>
        {renderHeader()}
        <div className={styles.emptyState}>
          <p>아직 교류망에 추가된 친구가 없습니다.</p>
          <button className={styles.emptyAddButton} onClick={handleSearch}>친구 추가하기</button>
        </div>
      </div>
    )
  }

  return (
    <div className={styles.container}>
      {renderHeader()}

      {/* 친구 스크롤 */}
      <div className={styles.friendsSection}>
        <div className={styles.friendsScroll}>
          <button className={styles.addButton} onClick={handleSearch}>
            <img src={plusIcon} alt="추가" className={styles.addButtonIcon} />
            <span className={styles.addButtonLabel}>추가하기</span>
          </button>
          {friends.map((friend) => {
            const isActive = activeCard?.userId === friend.userId
            return (
              <div key={friend.userId} className={styles.friendItem} onClick={() => handleSelectFriend(friend.userId)}>
                <div
                  className={`${styles.friendAvatar} ${isActive ? styles.friendAvatarSelected : ''}`}
                  style={{ background: getGradient(friend.backgroundPattern) }}
                >
                  {toFullUrl(friend.characterImageUrl) && (
                    <img src={toFullUrl(friend.characterImageUrl)} alt="" />
                  )}
                </div>
                <span className={`${styles.friendName} ${isActive ? styles.friendNameActive : ''}`}>
                  {friend.userName}
                </span>
              </div>
            )
          })}
        </div>
      </div>

      {/* 카드 캐러셀 */}
      <div
        className={styles.carouselSection}
        onMouseDown={handleDragStart}
        onMouseUp={handleDragEnd}
        onMouseLeave={handleDragEnd}
        onTouchStart={handleDragStart}
        onTouchEnd={handleDragEnd}
      >
        <div className={styles.carouselTrack} style={{ transform: `translateX(${trackX}px)` }}>
          {networkCards.map((card, index) => {
            const isCardActive = index === activeIndex
            return (
              <div
                key={card.userId}
                className={`${styles.card} ${!isCardActive ? styles.cardInactive : ''}`}
                onClick={() => setActiveIndex(index)}
              >
                {/* 상단 그라데이션 영역 */}
                <div className={styles.cardTop}>
                  <div className={styles.cardGradient} style={{ background: getGradient(card.backgroundPattern) }} />

                  {isCardActive ? (
                    <div className={styles.solidLogo}>
                      <span className={styles.solidLogoText}>
                        <span className={styles.solidBold}>SOL</span>
                        <span className={styles.solidLight}>ID</span>
                      </span>
                    </div>
                  ) : (
                    <div className={styles.solidLogoWhite}>
                      <img src={solidLogoWhiteSvg} alt="SOLID" />
                    </div>
                  )}

                  {toFullUrl(card.characterImageUrl) && (
                    <div className={styles.characterImage}>
                      <img src={toFullUrl(card.characterImageUrl)} alt="" />
                    </div>
                  )}

                  <div className={styles.nameSection}>
                    <p className={`${styles.userName} ${!isCardActive ? styles.userNameWhite : ''}`}>
                      {card.userName}
                    </p>
                    <p className={`${styles.userTag} ${!isCardActive ? styles.userTagWhite : ''}`}>
                      {card.solidGoalName}
                    </p>
                  </div>

                  <div className={styles.interestTags}>
                    {card.interests.slice(0, 2).map((interest, i) => (
                      <div key={i} className={`${styles.interestPill} ${styles.interestPillNoPad}`}>
                        <span className={styles.interestText}>{interest}</span>
                      </div>
                    ))}
                    {card.interests.length > 2 && (
                      <div className={styles.moreDots}>
                        <img src={moreDotsIcon} alt="더보기" />
                      </div>
                    )}
                  </div>
                </div>

                {/* 하단 목표 영역 */}
                <div className={styles.cardBottom}>
                  <div className={styles.goalsList}>
                    {card.mainGoals.map((goal, i) => (
                      <p key={i} className={styles.goalItem} style={{ opacity: 0.8 - i * 0.2 }}>
                        {goal}
                      </p>
                    ))}
                  </div>
                </div>

                <div className={styles.cardFooter}>
                  <span className={styles.schoolName}>{card.schoolName || card.councilName || ''}</span>
                  <span className={styles.sinceYear}>SINCE {card.joinYear || 2026}</span>
                </div>
              </div>
            )
          })}
        </div>
      </div>

      {/* 하단 버튼 */}
      {activeCard && (
        <div className={styles.bottomButtons}>
          <button className={styles.cheerButton} onClick={handleAction} disabled={isSending}>
            {activeCard.buttonType === 'CHEER' ? '응원하기' : '경험 나누기'}
          </button>
          <button className={styles.messageButton} onClick={handleMessage}>쪽지</button>
        </div>
      )}
    </div>
  )
}

export default NetworkPage
