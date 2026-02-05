import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import styles from './MemberAdd.module.css'
import closeIcon from '@/assets/images/x.svg'
import searchIcon from '@/assets/images/exchange-mentoring/search.svg'
import { getMyCouncil, getCouncilMembers, addCouncilMember, CouncilMember } from '@/services'
import { apiClient } from '@/api'

interface SearchUser {
  userId: number
  name: string
  userType: string
  region: string
}

function MemberAddPage() {
  const navigate = useNavigate()
  const [activeTab, setActiveTab] = useState<'sent' | 'received'>('received')
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedMembers, setSelectedMembers] = useState<number[]>([])
  const [currentMembers, setCurrentMembers] = useState<CouncilMember[]>([])
  const [searchResults, setSearchResults] = useState<SearchUser[]>([])
  const [councilId, setCouncilId] = useState<number | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [isSubmitting, setIsSubmitting] = useState(false)

  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true)
      try {
        const myCouncilRes = await getMyCouncil()
        if (myCouncilRes.success && myCouncilRes.data) {
          setCouncilId(myCouncilRes.data.councilId)
          const membersRes = await getCouncilMembers(myCouncilRes.data.councilId)
          if (membersRes.success) {
            setCurrentMembers(membersRes.data)
          }
        }
      } catch (err) {
        console.error('데이터 조회 실패:', err)
      } finally {
        setIsLoading(false)
      }
    }

    fetchData()
  }, [])

  useEffect(() => {
    const searchUsers = async () => {
      if (!searchQuery.trim()) {
        setSearchResults([])
        return
      }

      try {
        const response = await apiClient.get<{
          code: string
          message: string
          success: boolean
          data: SearchUser[]
        }>('/api/v1/users/search', { keyword: searchQuery })

        if (response.success) {
          const existingIds = currentMembers.map(m => m.userId)
          setSearchResults(response.data.filter(u => !existingIds.includes(u.userId)))
        }
      } catch (err) {
        console.error('사용자 검색 실패:', err)
      }
    }

    const debounce = setTimeout(searchUsers, 300)
    return () => clearTimeout(debounce)
  }, [searchQuery, currentMembers])

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

  const handleNext = async () => {
    if (!councilId || selectedMembers.length === 0 || isSubmitting) return

    setIsSubmitting(true)
    try {
      for (const userId of selectedMembers) {
        await addCouncilMember(councilId, { userId })
      }
      alert('멤버가 추가되었습니다.')
      navigate(-1)
    } catch (err) {
      console.error('멤버 추가 실패:', err)
      alert('멤버 추가에 실패했습니다.')
    } finally {
      setIsSubmitting(false)
    }
  }

  const currentUserId = Number(localStorage.getItem('userId') || '0')

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <div className={styles.headerLeft}>
          <button className={styles.closeButton} onClick={handleClose}>
            <img src={closeIcon} alt="닫기" />
          </button>
          <span className={styles.headerTitle}>자치회 멤버 추가</span>
        </div>
      </div>

      <div className={styles.content}>
        <div className={styles.currentMemberSection}>
          <div className={styles.sectionHeader}>
            <span className={styles.sectionTitle}>현재 멤버</span>
            <span className={styles.memberCount}>{currentMembers.length}명</span>
          </div>
          <div className={styles.memberAvatarList}>
            {isLoading ? (
              <span>로딩 중...</span>
            ) : (
              currentMembers.map(member => (
                <div key={member.userId} className={styles.memberAvatarItem}>
                  <div className={`${styles.memberAvatar} ${member.userId === currentUserId ? styles.memberAvatarMe : ''}`}>
                    {member.userId === currentUserId && <span className={styles.plusIcon}>+</span>}
                  </div>
                  <span className={`${styles.memberAvatarName} ${member.userId === currentUserId ? styles.memberAvatarNameMe : ''}`}>
                    {member.userId === currentUserId ? '나' : member.name}
                  </span>
                </div>
              ))
            )}
          </div>
        </div>

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

        <div className={styles.searchBox}>
          <input
            type="text"
            className={styles.searchInput}
            placeholder="이름으로 검색"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
          <img src={searchIcon} alt="검색" className={styles.searchIcon} />
        </div>

        <div className={styles.otherMemberSection}>
          <div className={styles.sectionHeader}>
            <span className={styles.sectionTitle}>검색 결과</span>
            <span className={styles.addMemberText}>멤버 추가하기</span>
          </div>
          <div className={styles.memberList}>
            {searchResults.length === 0 ? (
              <div style={{ padding: '20px', textAlign: 'center', color: '#888' }}>
                {searchQuery ? '검색 결과가 없습니다.' : '이름을 입력하여 검색하세요.'}
              </div>
            ) : (
              searchResults.map(member => {
                const isSelected = selectedMembers.includes(member.userId)
                return (
                  <div
                    key={member.userId}
                    className={`${styles.memberCard} ${isSelected ? styles.memberCardSelected : ''}`}
                    onClick={() => toggleMemberSelection(member.userId)}
                  >
                    <div className={styles.memberCardInner}>
                      <div className={styles.memberInfo}>
                        <div className={styles.memberProfileAvatar} />
                        <span className={`${styles.memberName} ${isSelected ? styles.memberNameSelected : ''}`}>
                          {member.name}
                        </span>
                      </div>
                      <div className={styles.memberMeta}>
                        <span className={styles.memberMetaText}>{member.userType || '장학생'}</span>
                        <div className={styles.memberMetaDivider} />
                        <span className={styles.memberMetaText}>{member.region || '전국'}</span>
                      </div>
                    </div>
                  </div>
                )
              })
            )}
          </div>
        </div>
      </div>

      <button
        className={`${styles.bottomButton} ${selectedMembers.length > 0 && !isSubmitting ? '' : styles.bottomButtonDisabled}`}
        onClick={handleNext}
        disabled={selectedMembers.length === 0 || isSubmitting}
      >
        <span className={styles.bottomButtonText}>{isSubmitting ? '추가 중...' : '추가하기'}</span>
      </button>
    </div>
  )
}

export default MemberAddPage
