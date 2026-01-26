import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import styles from './MemberAdd.module.css'
import closeIcon from '@/assets/images/x.svg'
import searchIcon from '@/assets/images/exchange-mentoring/search.svg'

interface Member {
  id: number
  name: string
  type: string
  region: string
}

const CURRENT_MEMBERS = [
  { id: 1, name: '나', isMe: true },
  { id: 2, name: '강건우', isMe: false },
  { id: 3, name: '김예나', isMe: false },
  { id: 4, name: '김한별', isMe: false },
  { id: 5, name: '도정윤', isMe: false },
]

const ALL_MEMBERS: Member[] = [
  { id: 101, name: '민지환', type: '고등학생', region: '제주' },
  { id: 102, name: '안선화', type: '고등학생', region: '제주' },
  { id: 103, name: '김지유', type: '고등학생', region: '제주' },
  { id: 104, name: '박지환', type: '고등학생', region: '제주' },
  { id: 105, name: '박지선', type: '고등학생', region: '제주' },
  { id: 106, name: '김철수', type: '고등학생', region: '제주' },
]

function MemberAddPage() {
  const navigate = useNavigate()
  const [activeTab, setActiveTab] = useState<'sent' | 'received'>('received')
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedMembers, setSelectedMembers] = useState<number[]>([])

  const filteredMembers = ALL_MEMBERS.filter(member =>
    member.name.includes(searchQuery)
  )

  const toggleMemberSelection = (memberId: number) => {
    setSelectedMembers(prev =>
      prev.includes(memberId)
        ? prev.filter(id => id !== memberId)
        : [...prev, memberId]
    )
  }

  const handleClose = () => {
    navigate(-1)
  }

  const handleNext = () => {
    // TODO: 선택된 멤버 처리 로직
    navigate(-1)
  }

  return (
    <div className={styles.container}>
      {/* Header */}
      <div className={styles.header}>
        <div className={styles.headerLeft}>
          <button className={styles.closeButton} onClick={handleClose}>
            <img src={closeIcon} alt="닫기" />
          </button>
          <span className={styles.headerTitle}>자치회 멤버 추가</span>
        </div>
      </div>

      {/* Content */}
      <div className={styles.content}>
        {/* 현재 멤버 섹션 */}
        <div className={styles.currentMemberSection}>
          <div className={styles.sectionHeader}>
            <span className={styles.sectionTitle}>현재 멤버</span>
            <span className={styles.memberCount}>{CURRENT_MEMBERS.length}명</span>
          </div>
          <div className={styles.memberAvatarList}>
            {CURRENT_MEMBERS.map(member => (
              <div key={member.id} className={styles.memberAvatarItem}>
                <div className={`${styles.memberAvatar} ${member.isMe ? styles.memberAvatarMe : ''}`}>
                  {member.isMe && <span className={styles.plusIcon}>+</span>}
                </div>
                <span className={`${styles.memberAvatarName} ${member.isMe ? styles.memberAvatarNameMe : ''}`}>
                  {member.name}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* 탭 바 */}
        <div className={styles.tabBar}>
          <button
            className={`${styles.tabItem} ${activeTab === 'sent' ? styles.tabItemActive : ''}`}
            onClick={() => setActiveTab('sent')}
          >
            내가 보낸 신청서
          </button>
          <button
            className={`${styles.tabItem} ${activeTab === 'received' ? styles.tabItemActive : ''}`}
            onClick={() => setActiveTab('received')}
          >
            받은 신청서
          </button>
        </div>

        {/* 검색창 */}
        <div className={styles.searchBox}>
          <input
            type="text"
            className={styles.searchInput}
            placeholder="입력해주세요"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
          <img src={searchIcon} alt="검색" className={styles.searchIcon} />
        </div>

        {/* 다른 사람들 섹션 */}
        <div className={styles.otherMemberSection}>
          <div className={styles.sectionHeader}>
            <span className={styles.sectionTitle}>다른 사람들</span>
            <span className={styles.addMemberText}>멤버 추가하기</span>
          </div>
          <div className={styles.memberList}>
            {filteredMembers.map(member => {
              const isSelected = selectedMembers.includes(member.id)
              return (
                <div
                  key={member.id}
                  className={`${styles.memberCard} ${isSelected ? styles.memberCardSelected : ''}`}
                  onClick={() => toggleMemberSelection(member.id)}
                >
                  <div className={styles.memberCardInner}>
                    <div className={styles.memberInfo}>
                      <div className={styles.memberProfileAvatar} />
                      <span className={`${styles.memberName} ${isSelected ? styles.memberNameSelected : ''}`}>
                        {member.name}
                      </span>
                    </div>
                    <div className={styles.memberMeta}>
                      <span className={styles.memberMetaText}>{member.type}</span>
                      <div className={styles.memberMetaDivider} />
                      <span className={styles.memberMetaText}>{member.region}</span>
                    </div>
                  </div>
                </div>
              )
            })}
          </div>
        </div>
      </div>

      {/* 하단 버튼 */}
      <button
        className={`${styles.bottomButton} ${selectedMembers.length > 0 ? '' : styles.bottomButtonDisabled}`}
        onClick={handleNext}
        disabled={selectedMembers.length === 0}
      >
        <span className={styles.bottomButtonText}>추가하기</span>
      </button>
    </div>
  )
}

export default MemberAddPage
