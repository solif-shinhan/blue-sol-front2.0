import { useState, useEffect, useCallback } from 'react'
import { useNavigate } from 'react-router-dom'
import styles1 from './MemberAdd-1.module.css'
import styles2 from './MemberAdd-2.module.css'

const styles = { ...styles1, ...styles2 }
import {
  getMyCouncil, getCouncilMembers, addCouncilMember, removeCouncilMember,
  getNetworkList,
  type CouncilMember, type NetworkFriend,
} from '@/services'
import { apiClient } from '@/api'

interface SearchUser {
  userId: number
  name: string
  userType?: string
  region: string
  schoolName?: string
  profileImageUrl?: string
  isInCouncil?: boolean
  councilName?: string
}

interface DisplayMember {
  userId: number
  name: string
  profileImageUrl?: string
  userType?: string
  region?: string
}

function MemberAddPage() {
  const navigate = useNavigate()
  const [activeTab, setActiveTab] = useState<'myNetwork' | 'allSearch'>('myNetwork')
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedMembers, setSelectedMembers] = useState<number[]>([])
  const [currentMembers, setCurrentMembers] = useState<CouncilMember[]>([])
  const [networkFriends, setNetworkFriends] = useState<DisplayMember[]>([])
  const [searchResults, setSearchResults] = useState<DisplayMember[]>([])
  const [councilId, setCouncilId] = useState<number | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [isSubmitting, setIsSubmitting] = useState(false)

  const currentUserId = Number(localStorage.getItem('userId') || '0')

  const refreshMembers = useCallback(async (cId: number) => {
    const res = await getCouncilMembers(cId)
    if (res.success) setCurrentMembers(res.data)
  }, [])

  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true)
      try {
        const myCouncilRes = await getMyCouncil()
        if (myCouncilRes.success && myCouncilRes.data) {
          const cId = myCouncilRes.data.councilId
          setCouncilId(cId)
          await refreshMembers(cId)
        }
        const networkRes = await getNetworkList()
        if (networkRes.success) {
          setNetworkFriends(
            networkRes.data.addedFriends.map((f: NetworkFriend) => ({
              userId: f.userId,
              name: f.userName,
              profileImageUrl: f.character,
            }))
          )
        }
      } catch (err) {
        console.error('데이터 조회 실패:', err)
      } finally {
        setIsLoading(false)
      }
    }
    fetchData()
  }, [refreshMembers])

  useEffect(() => {
    if (activeTab !== 'allSearch') return
    const searchUsers = async () => {
      try {
        const params = searchQuery.trim()
          ? { keyword: searchQuery }
          : undefined
        const response = await apiClient.get<{
          code: string; message: string; success: boolean; data: SearchUser[]
        }>('/api/v1/users/search', params)
        if (response.success) {
          setSearchResults(
            response.data
              .filter(u => u.userId !== currentUserId)
              .map(u => ({
                userId: u.userId,
                name: u.name,
                userType: u.userType || u.schoolName,
                region: u.region,
                profileImageUrl: u.profileImageUrl,
              }))
          )
        }
      } catch (err) {
        console.error('검색 실패:', err)
      }
    }
    const timer = setTimeout(searchUsers, searchQuery ? 300 : 0)
    return () => clearTimeout(timer)
  }, [searchQuery, activeTab, currentMembers])

  const getDisplayList = (): DisplayMember[] => {
    const existingIds = currentMembers.map(m => m.userId)
    if (activeTab === 'myNetwork') {
      return networkFriends
        .filter(f => !existingIds.includes(f.userId))
        .filter(f => !searchQuery.trim() || f.name.includes(searchQuery))
    }
    return searchResults
  }

  const displayList = getDisplayList()

  const toggleSelection = (memberId: number) => {
    setSelectedMembers(prev =>
      prev.includes(memberId)
        ? prev.filter(id => id !== memberId)
        : [...prev, memberId]
    )
  }

  const handleComplete = () => navigate(-1)

  const handleAddMembers = async () => {
    if (!councilId || selectedMembers.length === 0 || isSubmitting) return
    setIsSubmitting(true)
    try {
      for (const userId of selectedMembers) {
        await addCouncilMember(councilId, { userId })
      }
      await refreshMembers(councilId)
      setSelectedMembers([])
      alert('멤버가 추가되었습니다.')
    } catch (err) {
      console.error('멤버 추가 실패:', err)
      alert('멤버 추가에 실패했습니다.')
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleRemoveMember = async (userId: number) => {
    if (!councilId) return
    try {
      await removeCouncilMember(councilId, userId)
      await refreshMembers(councilId)
    } catch (err) {
      console.error('멤버 제거 실패:', err)
    }
  }

  const handleTabChange = (tab: 'myNetwork' | 'allSearch') => {
    setActiveTab(tab)
    setSelectedMembers([])
    setSearchQuery('')
    setSearchResults([])
  }

  const sectionTitle = activeTab === 'myNetwork' ? '나의 교류망' : '다른 사람들'

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <button className={styles.backButton} onClick={handleComplete}>
          <svg width="10" height="18" viewBox="0 0 10 18" fill="none">
            <path d="M9 1L1 9L9 17" stroke="#222222" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        </button>
        <span className={styles.headerTitle}>자치회 멤버 추가</span>
        <button className={styles.completeButton} onClick={handleComplete}>완료</button>
      </div>

      <div className={styles.content}>
        <div className={styles.currentMemberSection}>
          <div className={styles.sectionHeader}>
            <span className={styles.sectionTitle}>현재 멤버</span>
            <span className={styles.memberCount}>{currentMembers.length}명</span>
          </div>
          <div className={styles.memberAvatarList}>
            {isLoading ? (
              <span className={styles.loadingText}>로딩 중...</span>
            ) : (
              currentMembers.map(member => (
                <div key={member.userId} className={styles.memberAvatarItem}>
                  <div className={styles.memberAvatarWrapper}>
                    <div className={`${styles.memberAvatar} ${member.userId === currentUserId ? styles.memberAvatarMe : ''}`}>
                      {member.profileImageUrl ? (
                        <img src={member.profileImageUrl} alt={member.name} className={styles.avatarImg} />
                      ) : null}
                    </div>
                    {member.userId !== currentUserId && (
                      <button
                        className={styles.removeButton}
                        onClick={(e) => { e.stopPropagation(); handleRemoveMember(member.userId) }}
                      >
                        <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
                          <circle cx="7" cy="7" r="7" fill="#C8C8C8"/>
                          <path d="M4.5 4.5L9.5 9.5M9.5 4.5L4.5 9.5" stroke="white" strokeWidth="1.2" strokeLinecap="round"/>
                        </svg>
                      </button>
                    )}
                  </div>
                  <span className={`${styles.memberAvatarName} ${member.userId === currentUserId ? styles.memberAvatarNameMe : ''}`}>
                    {member.userId === currentUserId ? '나' : member.name}
                  </span>
                  {member.role === 'LEADER' && (
                    <span className={styles.leaderBadge}>리더</span>
                  )}
                </div>
              ))
            )}
          </div>
        </div>

        <div className={styles.tabBar}>
          <button
            className={`${styles.tabItem} ${activeTab === 'myNetwork' ? styles.tabItemActive : ''}`}
            onClick={() => handleTabChange('myNetwork')}
          >
            나의 교류망
          </button>
          <button
            className={`${styles.tabItem} ${activeTab === 'allSearch' ? styles.tabItemActive : ''}`}
            onClick={() => handleTabChange('allSearch')}
          >
            전체 검색
          </button>
        </div>

        <div className={styles.searchBox}>
          <input
            type="text"
            className={styles.searchInput}
            placeholder="입력해주세요"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" className={styles.searchIcon}>
            <circle cx="10.5" cy="10.5" r="7" stroke="#848484" strokeWidth="1.8"/>
            <path d="M16 16L21 21" stroke="#848484" strokeWidth="1.8" strokeLinecap="round"/>
          </svg>
        </div>

        <div className={styles.memberSection}>
          <span className={styles.memberSectionTitle}>{sectionTitle}</span>
          <div className={styles.memberList}>
            {displayList.length === 0 ? (
              <div className={styles.emptyState}>
                {activeTab === 'allSearch' && !searchQuery.trim()
                  ? '이름을 입력하여 검색하세요.'
                  : '결과가 없습니다.'}
              </div>
            ) : (
              displayList.map(member => {
                const isSelected = selectedMembers.includes(member.userId)
                return (
                  <div
                    key={member.userId}
                    className={`${styles.memberCard} ${isSelected ? styles.memberCardSelected : ''}`}
                    onClick={() => toggleSelection(member.userId)}
                  >
                    <div className={styles.memberCardInner}>
                      <div className={styles.memberInfo}>
                        <div className={styles.memberProfileAvatar}>
                          {member.profileImageUrl && (
                            <img src={member.profileImageUrl} alt={member.name} className={styles.memberProfileImg} />
                          )}
                        </div>
                        <span className={`${styles.memberName} ${isSelected ? styles.memberNameSelected : ''}`}>
                          {member.name}
                        </span>
                      </div>
                      <div className={styles.memberMeta}>
                        {member.userType && (
                          <span className={styles.memberMetaText}>{member.userType}</span>
                        )}
                        {member.userType && member.region && (
                          <div className={styles.memberMetaDivider} />
                        )}
                        {member.region && (
                          <span className={styles.memberMetaText}>{member.region}</span>
                        )}
                      </div>
                    </div>
                  </div>
                )
              })
            )}
          </div>
        </div>
      </div>

      {selectedMembers.length > 0 && (
        <button
          className={styles.bottomButton}
          onClick={handleAddMembers}
          disabled={isSubmitting}
        >
          <span className={styles.bottomButtonText}>
            {isSubmitting ? '추가 중...' : '추가하기'}
          </span>
        </button>
      )}
    </div>
  )
}

export default MemberAddPage
