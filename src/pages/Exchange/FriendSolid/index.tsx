import { useState, useEffect } from 'react'
import { useNavigate, useParams, useLocation } from 'react-router-dom'
import styles1 from './FriendSolid-1.module.css'
import styles2 from './FriendSolid-2.module.css'
import backArrowIcon from '@/assets/images/network/2107e80ddcb5d091c59aaa449d05031a375ef1a0.svg'
import searchIcon from '@/assets/images/network/e1e12166e22b287c6f9f01541da749c3439b5ba2.svg'
import {
  getUserSolidCard,
  addToNetwork,
  sendInteraction,
  type UserSolidCardResponse,
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

const INTEREST_DOT_COLORS = ['#FF9800', '#FF5252', '#4CAF50', '#64B5F6', '#BA68C8']

interface LocationState {
  userName?: string
  character?: string
  characterImageUrl?: string
  backgroundPattern?: string
  backgroundImageUrl?: string
  solidGoalName?: string
  interests?: string[]
  councilName?: string
}

function FriendSolidPage() {
  const navigate = useNavigate()
  const { userId } = useParams<{ userId: string }>()
  const location = useLocation()
  const state = location.state as LocationState | null

  const [cardData, setCardData] = useState<UserSolidCardResponse['data'] | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [isAdded, setIsAdded] = useState(false)
  const [isAdding, setIsAdding] = useState(false)
  const [showToast, setShowToast] = useState(false)
  const [isSending, setIsSending] = useState(false)

  useEffect(() => {
    if (!userId) return
    const fetchCard = async () => {
      setIsLoading(true)
      try {
        const res = await getUserSolidCard(Number(userId))
        if (res.success) {
          setCardData(res.data)
          setIsAdded(res.data.isConnected)
        }
      } catch {
        // API가 아직 없을 수 있으므로 state 데이터로 폴백
        if (state) {
          setCardData({
            userId: Number(userId),
            userName: state.userName || '',
            character: state.character || '',
            characterImageUrl: state.characterImageUrl,
            backgroundPattern: state.backgroundPattern || 'BLUE_PINK',
            backgroundImageUrl: state.backgroundImageUrl,
            solidGoalName: state.solidGoalName || '',
            mainGoals: [],
            interests: state.interests || [],
            isInCouncil: false,
            councilName: state.councilName,
            isConnected: false,
          })
        }
      } finally {
        setIsLoading(false)
      }
    }
    fetchCard()
  }, [userId])

  const handleBack = () => navigate(-1)
  const handleSearch = () => navigate('/exchange/network/add')

  const handleAddToNetwork = async () => {
    if (!cardData || isAdding) return
    setIsAdding(true)
    try {
      const res = await addToNetwork({ targetUserId: cardData.userId })
      if (res.success) {
        setIsAdded(true)
        setShowToast(true)
        setTimeout(() => setShowToast(false), 4000)
      }
    } catch {
      alert('교류망 추가에 실패했습니다.')
    } finally {
      setIsAdding(false)
    }
  }

  const handleCheer = async () => {
    if (!cardData || isSending) return
    setIsSending(true)
    try {
      const res = await sendInteraction({
        targetUserId: cardData.userId,
        interactionType: 'CHEER',
      })
      if (res.success) {
        alert('응원을 보냈습니다!')
      }
    } catch {
      alert('요청에 실패했습니다.')
    } finally {
      setIsSending(false)
    }
  }

  const handleMessage = () => {
    if (cardData) navigate(`/notifications/message/compose?userId=${cardData.userId}`)
  }

  const handleGoToNetwork = () => navigate('/exchange/network')

  if (isLoading) {
    return (
      <div className={styles.container}>
        <header className={styles.header}>
          <div className={styles.headerLeft}>
            <button className={styles.backButton} onClick={handleBack}>
              <img src={backArrowIcon} alt="뒤로가기" />
            </button>
            <h1 className={styles.headerTitle}>친구의 SOLID</h1>
          </div>
          <button className={styles.searchButton} onClick={handleSearch}>
            <img src={searchIcon} alt="검색" />
          </button>
        </header>
        <div className={styles.loadingState}><p>로딩 중...</p></div>
      </div>
    )
  }

  if (!cardData) {
    return (
      <div className={styles.container}>
        <header className={styles.header}>
          <div className={styles.headerLeft}>
            <button className={styles.backButton} onClick={handleBack}>
              <img src={backArrowIcon} alt="뒤로가기" />
            </button>
            <h1 className={styles.headerTitle}>친구의 SOLID</h1>
          </div>
        </header>
        <div className={styles.loadingState}><p>카드를 불러올 수 없습니다.</p></div>
      </div>
    )
  }

  const bgStyle = toFullUrl(cardData.backgroundImageUrl || cardData.backgroundPattern)
    ? { background: `url(${toFullUrl(cardData.backgroundImageUrl)}) center/cover` }
    : { background: GRADIENT_MAP[cardData.backgroundPattern] || DEFAULT_GRADIENT }

  return (
    <div className={styles.container}>
      <header className={styles.header}>
        <div className={styles.headerLeft}>
          <button className={styles.backButton} onClick={handleBack}>
            <img src={backArrowIcon} alt="뒤로가기" />
          </button>
          <h1 className={styles.headerTitle}>친구의 SOLID</h1>
        </div>
        <button className={styles.searchButton} onClick={handleSearch}>
          <img src={searchIcon} alt="검색" />
        </button>
      </header>

      <div className={styles.cardWrapper}>
        <div className={styles.card}>
          {/* 카드 상단 - 그라데이션 영역 */}
          <div className={styles.cardTop}>
            <div className={styles.cardGradient} style={bgStyle} />

            <div className={styles.solidLogo}>
              <span className={styles.solidLogoText}>
                <span className={styles.solidBold}>SOL</span>
                <span className={styles.solidLight}>ID</span>
              </span>
            </div>

            {toFullUrl(cardData.characterImageUrl) && (
              <div className={styles.characterImage}>
                <img src={toFullUrl(cardData.characterImageUrl)} alt="" />
              </div>
            )}

            <div className={styles.nameSection}>
              <p className={styles.userName}>{cardData.userName}</p>
              <p className={styles.userTag}>{cardData.solidGoalName}</p>
            </div>

            <div className={styles.interestTags}>
              {cardData.interests.slice(0, 2).map((interest, i) => (
                <div key={i} className={styles.interestPill}>
                  <span
                    className={styles.interestDot}
                    style={{ background: INTEREST_DOT_COLORS[i % INTEREST_DOT_COLORS.length] }}
                  />
                  <span className={styles.interestText}>{interest}</span>
                </div>
              ))}
            </div>
          </div>

          {/* 카드 하단 - 목표 또는 플레이스홀더 */}
          <div className={styles.cardBottom}>
            {isAdded && cardData.mainGoals && cardData.mainGoals.length > 0 ? (
              <div className={styles.goalsList}>
                {cardData.mainGoals.map((goal, i) => (
                  <p key={i} className={styles.goalItem} style={{ opacity: 0.8 - i * 0.15 }}>
                    {goal}
                  </p>
                ))}
              </div>
            ) : (
              <p className={styles.placeholderText}>
                SOLID 카드를 교환한 후<br />서로의 목표를 공유해보세요
              </p>
            )}
          </div>

          {/* 카드 푸터 - 학교 & SINCE */}
          <div className={styles.cardFooter}>
            <span className={styles.schoolName}>
              {cardData.schoolName || cardData.councilName || ''}
            </span>
            <span className={styles.sinceYear}>SINCE {cardData.joinYear || 2026}</span>
          </div>
        </div>
      </div>

      {/* 토스트 */}
      {showToast && (
        <div className={styles.toastContainer}>
          <div className={styles.toast}>
            <span className={styles.toastText}>
              나의 교류방에<br />{cardData.userName}님이 추가되었어요.
            </span>
            <button className={styles.toastButton} onClick={handleGoToNetwork}>
              나의 교류망
            </button>
          </div>
        </div>
      )}

      {/* 하단 버튼 */}
      <div className={styles.bottomButtons}>
        {isAdded ? (
          <button
            className={styles.cheerButton}
            onClick={handleCheer}
            disabled={isSending}
          >
            응원하기
          </button>
        ) : (
          <button
            className={styles.addNetworkButton}
            onClick={handleAddToNetwork}
            disabled={isAdding}
          >
            {isAdding ? '추가 중...' : '교류망에 추가하기'}
          </button>
        )}
        <button className={styles.messageButton} onClick={handleMessage}>
          쪽지
        </button>
      </div>
    </div>
  )
}

export default FriendSolidPage
