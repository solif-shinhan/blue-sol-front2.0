import { useState, useRef, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import styles from './Network.module.css'
import backArrowIcon from '@/assets/images/Glyph_ undefined.svg'
import {
  getNetworkList,
  sendInteraction,
  type NetworkCard,
  type NetworkFriend,
} from '@/services'

const glassesIcon = '/glasses.svg'
const blueCircleIcon = '/bluesmallcircle.svg'

function NetworkPage() {
  const navigate = useNavigate()
  const scrollRef = useRef<HTMLDivElement>(null)

  const [friends, setFriends] = useState<NetworkFriend[]>([])
  const [networkCards, setNetworkCards] = useState<NetworkCard[]>([])
  const [selectedUserId, setSelectedUserId] = useState<number | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [isSendingInteraction, setIsSendingInteraction] = useState(false)

  // 교류망 목록 조회
  const fetchNetworkList = async () => {
    setIsLoading(true)
    try {
      const response = await getNetworkList()
      if (response.success) {
        setFriends(response.data.addedFriends)
        setNetworkCards(response.data.networkCards)

        // 첫 번째 친구 선택
        if (response.data.addedFriends.length > 0) {
          setSelectedUserId(response.data.addedFriends[0].userId)
        }
      }
    } catch (err) {
      console.error('교류망 조회 실패:', err)
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    fetchNetworkList()
  }, [])

  // 선택된 사용자의 카드 정보
  const selectedCard = networkCards.find((c) => c.userId === selectedUserId)

  const handleBack = () => {
    navigate('/exchange')
  }

  const handleSearch = () => {
    navigate('/exchange/network/add')
  }

  const handleSelectFriend = (userId: number) => {
    setSelectedUserId(userId)
  }

  // 응원하기
  const handleCheer = async () => {
    if (!selectedUserId || isSendingInteraction) return

    setIsSendingInteraction(true)
    try {
      const response = await sendInteraction({
        targetUserId: selectedUserId,
        interactionType: 'CHEER',
      })

      if (response.success) {
        alert('응원을 보냈습니다!')
      }
    } catch (err) {
      console.error('응원하기 실패:', err)
      alert('응원하기에 실패했습니다.')
    } finally {
      setIsSendingInteraction(false)
    }
  }

  // 경험 나누기
  const handleShareExperience = async () => {
    if (!selectedUserId || isSendingInteraction) return

    setIsSendingInteraction(true)
    try {
      const response = await sendInteraction({
        targetUserId: selectedUserId,
        interactionType: 'SHARE_EXPERIENCE',
      })

      if (response.success) {
        alert('경험 나누기를 보냈습니다!')
      }
    } catch (err) {
      console.error('경험 나누기 실패:', err)
      alert('경험 나누기에 실패했습니다.')
    } finally {
      setIsSendingInteraction(false)
    }
  }

  // 쪽지
  const handleMessage = () => {
    console.log('쪽지 보내기')
  }

  if (isLoading) {
    return (
      <div className={styles.container}>
        <header className={styles.header}>
          <button className={styles.backButton} onClick={handleBack}>
            <img src={backArrowIcon} alt="뒤로가기" />
          </button>
          <h1 className={styles.headerTitle}>나의 SOLID</h1>
          <button className={styles.searchButton}>
            <img src={glassesIcon} alt="검색" />
          </button>
        </header>
        <div className={styles.loadingState}>
          <p>로딩 중...</p>
        </div>
      </div>
    )
  }

  if (friends.length === 0) {
    return (
      <div className={styles.container}>
        <header className={styles.header}>
          <button className={styles.backButton} onClick={handleBack}>
            <img src={backArrowIcon} alt="뒤로가기" />
          </button>
          <h1 className={styles.headerTitle}>나의 SOLID</h1>
          <button className={styles.searchButton} onClick={handleSearch}>
            <img src={glassesIcon} alt="검색" />
          </button>
        </header>
        <div className={styles.emptyState}>
          <p>아직 교류망에 추가된 친구가 없습니다.</p>
          <button className={styles.addButton} onClick={handleSearch}>
            친구 추가하기
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className={styles.container}>
      <header className={styles.header}>
        <button className={styles.backButton} onClick={handleBack}>
          <img src={backArrowIcon} alt="뒤로가기" />
        </button>
        <h1 className={styles.headerTitle}>나의 SOLID</h1>
        <button className={styles.searchButton} onClick={handleSearch}>
          <img src={glassesIcon} alt="검색" />
        </button>
      </header>

      <div className={styles.friendsScrollWrapper}>
        <div className={styles.friendsScroll} ref={scrollRef}>
          {friends.map((friend) => (
            <div
              key={friend.userId}
              className={styles.friendItem}
              onClick={() => handleSelectFriend(friend.userId)}
            >
              <div className={styles.friendAvatarWrapper}>
                <div className={styles.friendAvatar}></div>
                {selectedUserId === friend.userId && (
                  <img
                    src={blueCircleIcon}
                    alt=""
                    className={styles.selectedBorder}
                  />
                )}
              </div>
              <span className={`${styles.friendName} ${selectedUserId === friend.userId ? styles.friendNameActive : ''}`}>
                {friend.userName}
              </span>
            </div>
          ))}
        </div>
      </div>

      {selectedCard && (
        <>
          <div className={styles.profileCard}>
            <div className={styles.cardBackground}></div>

            <div className={styles.solidLogo}>
              <span className={styles.solidBlue}>SOL</span>
              <span className={styles.solidBlack}>ID</span>
            </div>

            <div className={styles.profileInfo}>
              <span className={styles.profileName}>{selectedCard.userName}</span>
              {selectedCard.isInCouncil && selectedCard.councilName && (
                <span className={styles.profileBadge}>{selectedCard.councilName}</span>
              )}
              <span className={styles.profileTag}>{selectedCard.solidGoalName}</span>
            </div>

            <div className={styles.goalsList}>
              {selectedCard.mainGoals?.map((goal, index) => (
                <p
                  key={index}
                  className={styles.goalItem}
                  style={{ opacity: 1 - index * 0.3 }}
                >
                  {goal}
                </p>
              ))}
            </div>

            <div className={styles.interestTags}>
              {selectedCard.interests?.map((interest, index) => (
                <div key={index} className={styles.interestTag}>
                  <span className={styles.interestLabel}>{interest}</span>
                </div>
              ))}
            </div>
          </div>

          <div className={styles.bottomButtons}>
            {selectedCard.buttonType === 'CHEER' ? (
              <button
                className={styles.cheerButton}
                onClick={handleCheer}
                disabled={isSendingInteraction}
              >
                응원하기
              </button>
            ) : (
              <button
                className={styles.cheerButton}
                onClick={handleShareExperience}
                disabled={isSendingInteraction}
              >
                경험 나누기
              </button>
            )}
            <button className={styles.messageButton} onClick={handleMessage}>
              쪽지
            </button>
          </div>
        </>
      )}
    </div>
  )
}

export default NetworkPage
