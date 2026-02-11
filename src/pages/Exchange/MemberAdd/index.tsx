import { useState, useEffect, useCallback } from 'react'
import { useNavigate } from 'react-router-dom'
import styles1 from './MemberAdd-1.module.css'
import styles2 from './MemberAdd-2.module.css'
import { BackHeader } from '@/components/BackHeader'

const styles = { ...styles1, ...styles2 }
import {
  getMyCouncil, getCouncilMembers, addCouncilMember, removeCouncilMember,
  getNetworkList,
  type CouncilMember, type NetworkFriend,
} from '@/services'
import { getScopedKey } from '@/hooks'
import { apiClient } from '@/api'

const API_BASE = import.meta.env.VITE_API_URL || ''
const toFullUrl = (path: string | null | undefined): string | undefined => {
  if (!path) return undefined
  if (path.startsWith('http') || path.startsWith('blob')) return path
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

function getAvatarBackground(member: DisplayMember): string {
  if (member.backgroundImageUrl) {
    const url = toFullUrl(member.backgroundImageUrl)
    if (url) return `url(${url}) center/cover no-repeat`
  }
  if (member.backgroundPattern) {
    return GRADIENT_MAP[member.backgroundPattern] || DEFAULT_GRADIENT
  }
  return '#E6E6E6'
}

interface SearchUser {
  userId: number
  name: string
  userType?: string
  region: string
  schoolName?: string
  profileImageUrl?: string
  characterImageUrl?: string
  backgroundImageUrl?: string
  backgroundPattern?: string
  isInCouncil?: boolean
  councilName?: string
}

interface DisplayMember {
  userId: number
  name: string
  profileImageUrl?: string
  characterImageUrl?: string
  backgroundImageUrl?: string
  backgroundPattern?: string
  userType?: string
  region?: string
}

function MemberAddPage() {
  const navigate = useNavigate()
  const isRegisterMode = !!sessionStorage.getItem(getScopedKey('council-reg:step'))

  const [activeTab, setActiveTab] = useState<'myNetwork' | 'allSearch'>('myNetwork')
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedMembers, setSelectedMembers] = useState<number[]>([])
  const [currentMembers, setCurrentMembers] = useState<CouncilMember[]>([])
  const [networkFriends, setNetworkFriends] = useState<DisplayMember[]>([])
  const [searchResults, setSearchResults] = useState<DisplayMember[]>([])
  const [councilId, setCouncilId] = useState<number | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [isSubmitting, setIsSubmitting] = useState(false)

  // Registration mode: members stored in session storage
  const [regMembers, setRegMembers] = useState<DisplayMember[]>(() => {
    if (!isRegisterMode) return []
    try {
      const saved = sessionStorage.getItem(getScopedKey('council-reg:members'))
      return saved ? JSON.parse(saved) : []
    } catch { return [] }
  })

  const currentUserId = Number(localStorage.getItem('userId') || '0')

  const refreshMembers = useCallback(async (cId: number) => {
    const res = await getCouncilMembers(cId)
    if (res.success) {
      const list: any[] = res.data?.members ?? []
      setCurrentMembers(list.map((m: any) => ({
        userId: m.userId,
        name: m.userName || m.name || '',
        nickname: m.nickname || '',
        profileImageUrl: m.profileImageUrl || '',
        role: m.role,
        joinedAt: m.joinedAt || '',
        userType: m.userType,
        region: m.region,
        schoolName: m.schoolName || '',
      })))
    }
  }, [])

  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true)
      try {
        if (!isRegisterMode) {
          const myCouncilRes = await getMyCouncil()
          if (myCouncilRes.success && myCouncilRes.data) {
            const cId = myCouncilRes.data.councilId
            setCouncilId(cId)
            await refreshMembers(cId)
          }
        }
        const networkRes = await getNetworkList()
        if (networkRes.success) {
          setNetworkFriends(
            networkRes.data.addedFriends.map((f: NetworkFriend) => ({
              userId: f.userId,
              name: f.userName,
              characterImageUrl: f.characterImageUrl,
              backgroundImageUrl: f.backgroundImageUrl,
              backgroundPattern: f.backgroundPattern,
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
  }, [refreshMembers, isRegisterMode])

  useEffect(() => {
    if (activeTab !== 'allSearch') return
    if (!searchQuery.trim()) {
      setSearchResults([])
      return
    }
    const searchUsers = async () => {
      try {
        const response = await apiClient.get<{
          code: string; message: string; success: boolean; data: SearchUser[]
        }>('/api/v1/users/search', { keyword: searchQuery.trim() })
        if (response.success) {
          setSearchResults(
            response.data
              .filter(u => u.userId !== currentUserId)
              .map(u => ({
                userId: u.userId,
                name: u.name,
                userType: u.userType || u.schoolName,
                region: u.region,
                characterImageUrl: u.characterImageUrl || u.profileImageUrl,
                backgroundImageUrl: u.backgroundImageUrl,
                backgroundPattern: u.backgroundPattern,
              }))
          )
        }
      } catch (err) {
        console.error('검색 실패:', err)
      }
    }
    const timer = setTimeout(searchUsers, 300)
    return () => clearTimeout(timer)
  }, [searchQuery, activeTab, currentMembers, regMembers])

  const getDisplayList = (): DisplayMember[] => {
    const existingIds = isRegisterMode
      ? regMembers.map(m => m.userId)
      : currentMembers.map(m => m.userId)
    const source = activeTab === 'myNetwork'
      ? networkFriends.filter(f => !searchQuery.trim() || f.name.includes(searchQuery))
      : searchResults
    return source.filter(f => !existingIds.includes(f.userId))
  }

  const displayList = getDisplayList()

  const toggleSelection = (memberId: number) => {
    setSelectedMembers(prev =>
      prev.includes(memberId)
        ? prev.filter(id => id !== memberId)
        : [...prev, memberId]
    )
  }

  const handleComplete = () => {
    if (isRegisterMode) {
      navigate('/exchange/council/register')
    } else {
      navigate(-1)
    }
  }

  const handleAddMembers = async () => {
    if (isRegisterMode) {
      if (selectedMembers.length === 0) return
      const newMembers = displayList.filter(m => selectedMembers.includes(m.userId))
      const updated = [...regMembers, ...newMembers]
      setRegMembers(updated)
      sessionStorage.setItem(getScopedKey('council-reg:members'), JSON.stringify(updated))
      setSelectedMembers([])
      return
    }

    if (!councilId || selectedMembers.length === 0 || isSubmitting) return
    setIsSubmitting(true)
    try {
      await addCouncilMember(councilId, { userIds: selectedMembers })
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
    if (isRegisterMode) {
      const updated = regMembers.filter(m => m.userId !== userId)
      setRegMembers(updated)
      sessionStorage.setItem(getScopedKey('council-reg:members'), JSON.stringify(updated))
      return
    }
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
  const effectiveMemberCount = isRegisterMode ? regMembers.length : currentMembers.length

  return (
    <div className={styles.container}>
      <BackHeader
        title="자치회 멤버 추가"
        onBack={handleComplete}
        rightContent={
          <button className={styles.completeButton} onClick={handleComplete}>완료</button>
        }
      />

      <div className={styles.content}>
        <div className={styles.currentMemberSection}>
          <div className={styles.sectionHeader}>
            <span className={styles.sectionTitle}>현재 멤버</span>
            <span className={styles.memberCount}>{effectiveMemberCount}명</span>
          </div>
          <div className={styles.memberAvatarList}>
            {isLoading ? (
              <span className={styles.loadingText}>로딩 중...</span>
            ) : isRegisterMode ? (
              regMembers.map(member => (
                <div key={member.userId} className={styles.memberAvatarItem}>
                  <div className={styles.memberAvatarWrapper}>
                    <div className={styles.memberAvatar} style={{ background: getAvatarBackground(member) }}>
                      {toFullUrl(member.characterImageUrl) && (
                        <img src={toFullUrl(member.characterImageUrl)} alt={member.name} className={styles.avatarImg} />
                      )}
                    </div>
                    <button
                      className={styles.removeButton}
                      onClick={(e) => { e.stopPropagation(); handleRemoveMember(member.userId) }}
                    >
                      <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
                        <circle cx="7" cy="7" r="7" fill="#C8C8C8"/>
                        <path d="M4.5 4.5L9.5 9.5M9.5 4.5L4.5 9.5" stroke="white" strokeWidth="1.2" strokeLinecap="round"/>
                      </svg>
                    </button>
                  </div>
                  <span className={styles.memberAvatarName}>{member.name}</span>
                </div>
              ))
            ) : (
              currentMembers.map(member => (
                <div key={member.userId} className={styles.memberAvatarItem}>
                  <div className={styles.memberAvatarWrapper}>
                    <div className={`${styles.memberAvatar} ${member.userId === currentUserId ? styles.memberAvatarMe : ''}`}>
                      {toFullUrl(member.profileImageUrl) && (
                        <img src={toFullUrl(member.profileImageUrl)} alt={member.name} className={styles.avatarImg} />
                      )}
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
                        <div className={styles.memberProfileAvatar} style={{ background: getAvatarBackground(member) }}>
                          {toFullUrl(member.characterImageUrl) && (
                            <img src={toFullUrl(member.characterImageUrl)} alt={member.name} className={styles.memberProfileImg} />
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
