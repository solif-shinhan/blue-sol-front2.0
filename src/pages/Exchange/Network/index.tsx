import { useState, useRef } from 'react'
import { useNavigate } from 'react-router-dom'
import styles from './Network.module.css'
import { FRIENDS_DATA } from '../constants'

// public 폴더 SVG 경로
const glassesIcon = '/glasses.svg'
const blueCircleIcon = '/bluesmallcircle.svg'

function NetworkPage() {
  const navigate = useNavigate()
  const [selectedFriendId, setSelectedFriendId] = useState(1)
  const scrollRef = useRef<HTMLDivElement>(null)

  const selectedFriend = FRIENDS_DATA.find((f) => f.id === selectedFriendId) || FRIENDS_DATA[0]

  // 뒤로가기
  const handleBack = () => {
    navigate('/exchange')
  }

  // 친구 선택
  const handleSelectFriend = (id: number) => {
    setSelectedFriendId(id)
  }

  return (
    <div className={styles.container}>
      {/* 헤더 */}
      <header className={styles.header}>
        <button className={styles.backButton} onClick={handleBack}>
          <img src="/←.svg" alt="뒤로가기" />
        </button>
        <h1 className={styles.headerTitle}>나의 SOLID</h1>
        <button className={styles.searchButton}>
          <img src={glassesIcon} alt="검색" />
        </button>
      </header>

      {/* 친구 목록 (가로 스크롤) */}
      <div className={styles.friendsScrollWrapper}>
        <div className={styles.friendsScroll} ref={scrollRef}>
          {FRIENDS_DATA.map((friend) => (
            <div
              key={friend.id}
              className={styles.friendItem}
              onClick={() => handleSelectFriend(friend.id)}
            >
              <div className={styles.friendAvatarWrapper}>
                <div className={styles.friendAvatar}></div>
                {selectedFriendId === friend.id && (
                  <img
                    src={blueCircleIcon}
                    alt=""
                    className={styles.selectedBorder}
                  />
                )}
              </div>
              <span className={`${styles.friendName} ${selectedFriendId === friend.id ? styles.friendNameActive : ''}`}>
                {friend.name}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* 메인 프로필 카드 */}
      <div className={styles.profileCard}>
        {/* 배경 장식 */}
        <div className={styles.cardBackground}></div>

        {/* SOLID 로고 */}
        <div className={styles.solidLogo}>
          <span className={styles.solidBlue}>SOL</span>
          <span className={styles.solidBlack}>ID</span>
        </div>

        {/* 이름 및 정보 */}
        <div className={styles.profileInfo}>
          <span className={styles.profileName}>{selectedFriend.name}</span>
          <span className={styles.profileBadge}>{selectedFriend.badge}</span>
          <span className={styles.profileTag}>{selectedFriend.tag}</span>
        </div>

        {/* 목표 리스트 */}
        <div className={styles.goalsList}>
          {selectedFriend.goals?.map((goal, index) => (
            <p
              key={index}
              className={styles.goalItem}
              style={{ opacity: 1 - index * 0.3 }}
            >
              {goal}
            </p>
          ))}
        </div>

        {/* 관심사 태그 */}
        <div className={styles.interestTags}>
          {selectedFriend.interests?.map((interest, index) => (
            <div key={index} className={styles.interestTag}>
              <span className={styles.interestIcon}>{interest.icon}</span>
              <span className={styles.interestLabel}>{interest.label}</span>
            </div>
          ))}
        </div>
      </div>

      {/* 하단 버튼들 */}
      <div className={styles.bottomButtons}>
        <button className={styles.cheerButton}>응원하기</button>
        <button className={styles.messageButton}>쪽지</button>
      </div>
    </div>
  )
}

export default NetworkPage
