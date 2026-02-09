import { useState, useEffect, useRef } from 'react'
import { useNavigate } from 'react-router-dom'
import { useSessionStorage } from '@/hooks'
import styles from './ParticipantEdit.module.css'
import { BackHeader } from '@/components/BackHeader'
import { userApi, profileApi } from '@/api/api-2'
import { getNetworkList, searchNetwork } from '@/services/networkService'

import defaultAvatar from '@/assets/images/participants/34d0cfd7134cc05f15dd1efb5183b8bba793f850.png'

import removeIcon from '@/assets/images/participants/4d69de4e468b2fc4fdb0dd71f55c582bcd74c605.svg'
import searchIcon from '@/assets/images/participants/e1e12166e22b287c6f9f01541da749c3439b5ba2.svg'
import dividerIcon from '@/assets/images/participants/32cc3475b0a02c61120db3f447dfc603b7fb4598.svg'

interface Participant {
  id: number
  name: string
  avatar: string
  isMe?: boolean
}

interface NetworkPerson {
  id: number
  name: string
  avatar: string
  type: string
  region: string
}


function ParticipantEditPage() {
  const navigate = useNavigate()
  const [activeTab, setActiveTab] = useState<'network' | 'search'>('network')
  const [searchQuery, setSearchQuery] = useState('')
  const [participants, setParticipants] = useSessionStorage<Participant[]>(
    'write-review:participants',
    []
  )
  const [networkPeople, setNetworkPeople] = useState<NetworkPerson[]>([])
  const [searchResults, setSearchResults] = useState<NetworkPerson[]>([])
  const searchTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null)

  useEffect(() => {
    const loadInitData = async () => {
      try {
        const [userRes, profileRes, networkRes] = await Promise.all([
          userApi.getMe(),
          profileApi.get(),
          getNetworkList(),
        ])

        const userId = userRes.success ? userRes.data.userId : 0
        const avatarUrl =
          profileRes.success && profileRes.data.characterImageUrl
            ? profileRes.data.characterImageUrl
            : defaultAvatar

        const meParticipant: Participant = {
          id: userId,
          name: '나',
          avatar: avatarUrl,
          isMe: true,
        }

        setParticipants((prev) => {
          if (prev.length > 0 && prev[0]?.isMe) {
            return [{ ...prev[0], avatar: avatarUrl, id: userId }, ...prev.slice(1)]
          }
          return [meParticipant]
        })

        if (networkRes.success && networkRes.data) {
          const cards = networkRes.data.networkCards || []
          setNetworkPeople(cards.map((c) => ({
            id: c.userId,
            name: c.userName,
            avatar: c.characterImageUrl || defaultAvatar,
            type: c.schoolName || '',
            region: c.region || '',
          })))
        }
      } catch (err) {
        console.error('초기 데이터 조회 실패:', err)
        if (participants.length === 0) {
          setParticipants([{ id: 0, name: '나', avatar: defaultAvatar, isMe: true }])
        }
      }
    }

    loadInitData()
  }, [])

  useEffect(() => {
    if (activeTab !== 'search') return
    if (searchTimerRef.current) clearTimeout(searchTimerRef.current)

    if (!searchQuery.trim()) {
      setSearchResults([])
      return
    }

    searchTimerRef.current = setTimeout(async () => {
      try {
        const res = await searchNetwork(searchQuery.trim())
        if (res.success && res.data) {
          setSearchResults(res.data.users.map((u) => ({
            id: u.userId,
            name: u.userName,
            avatar: u.characterImageUrl || defaultAvatar,
            type: u.schoolName || '',
            region: '',
          })))
        }
      } catch {
        console.error('검색 실패')
      }
    }, 400)

    return () => {
      if (searchTimerRef.current) clearTimeout(searchTimerRef.current)
    }
  }, [searchQuery, activeTab])

  const handleComplete = () => {
    navigate(-1)
  }

  const handleRemoveParticipant = (id: number) => {
    const participant = participants.find((p) => p.id === id)
    if (participant && !participant.isMe) {
      setParticipants((prev) => prev.filter((p) => p.id !== id))
    }
  }

  const handleAddPerson = (person: NetworkPerson) => {
    if (participants.some((p) => p.id === person.id)) return
    const newParticipant: Participant = {
      id: person.id,
      name: person.name,
      avatar: person.avatar,
    }
    setParticipants((prev) => [...prev, newParticipant])
  }

  const currentPeople = activeTab === 'network'
    ? networkPeople.filter((p) => p.name.toLowerCase().includes(searchQuery.toLowerCase()))
    : searchResults
  const filteredPeople = currentPeople.filter(
    (person) => !participants.some((p) => p.id === person.id)
  )

  return (
    <div className={styles.container}>
      <BackHeader
        title="자치회 멤버 추가"
        rightContent={
          <button className={styles.completeButton} onClick={handleComplete}>
            <span className={styles.completeButtonText}>완료</span>
          </button>
        }
      />

      <div className={styles.memberSection}>
        <div className={styles.memberHeader}>
          <span className={styles.memberHeaderTitle}>현재 멤버</span>
          <span className={styles.memberHeaderCount}>{participants.length}명</span>
        </div>

        <div className={styles.memberList}>
          {participants.map((p) => (
            <div key={p.id} className={styles.memberItem}>
              <div className={styles.memberAvatarOuter}>
                <div className={styles.memberAvatarWrapper}>
                  <img src={p.avatar} alt={p.name} className={styles.memberAvatar} />
                </div>
                {!p.isMe && (
                  <button
                    className={styles.memberRemoveBtn}
                    onClick={() => handleRemoveParticipant(p.id)}
                  >
                    <img src={removeIcon} alt="삭제" />
                  </button>
                )}
              </div>
              {p.isMe && <span className={styles.leaderBadge}>리더</span>}
              <span className={`${styles.memberName} ${p.isMe ? styles.memberNameMe : ''}`}>
                {p.name}
              </span>
            </div>
          ))}
        </div>
      </div>

      <div className={styles.searchSection}>
        <div className={styles.tabBar}>
          <button
            className={`${styles.tabItem} ${activeTab === 'network' ? styles.tabItemActive : ''}`}
            onClick={() => setActiveTab('network')}
          >
            나의 교류망
          </button>
          <button
            className={`${styles.tabItem} ${activeTab === 'search' ? styles.tabItemActive : ''}`}
            onClick={() => setActiveTab('search')}
          >
            전체 검색
          </button>
        </div>

        <div className={styles.searchInputWrapper}>
          <input
            type="text"
            className={styles.searchInput}
            placeholder="입력해주세요"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
          <img src={searchIcon} alt="검색" className={styles.searchIcon} />
        </div>

        <div className={styles.listSection}>
          <span className={styles.listTitle}>
            {activeTab === 'network' ? '나의 교류망' : '다른 사람들'}
          </span>
          <div className={styles.personList}>
            {filteredPeople.map((person) => (
              <div
                key={person.id}
                className={styles.personCard}
                onClick={() => handleAddPerson(person)}
              >
                <div className={styles.personCardInner}>
                  <div className={styles.personInfo}>
                    <img src={person.avatar} alt={person.name} className={styles.personAvatar} />
                    <span className={styles.personName}>{person.name}</span>
                  </div>
                  <div className={styles.personMeta}>
                    <span className={styles.personMetaText}>{person.type}</span>
                    <img src={dividerIcon} alt="" className={styles.personMetaDivider} />
                    <span className={styles.personMetaText}>{person.region}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}

export default ParticipantEditPage
