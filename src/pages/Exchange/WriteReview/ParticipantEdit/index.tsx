import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import styles from './ParticipantEdit.module.css'

// 참여 인원 아바타 이미지들
import avatar1 from '@/assets/images/exchange-write/exchange-wirte-review/34d0cfd7134cc05f15dd1efb5183b8bba793f850.png'
import avatar2 from '@/assets/images/exchange-write/exchange-wirte-review/6274fd76ac528e10ab53c6a60ec2b7781a4bf077.png'
import avatar3 from '@/assets/images/exchange-write/exchange-wirte-review/4bf002daa7ad9b2fb6987fa94a968c96d5e411a4.png'
import avatar4 from '@/assets/images/exchange-write/exchange-wirte-review/3a123e475703b8af890f035081d17d46b0044ab8.png'
import avatar5 from '@/assets/images/exchange-write/exchange-wirte-review/4f312a8b6806350bc51a53e37425ab024d322097.png'
import avatar6 from '@/assets/images/exchange-write/exchange-wirte-review/a32743961912e3f72471dab1912efd76555d7042.png'

// 나의 교류망 아바타 이미지들
import networkAvatar1 from '@/assets/images/exchange-write/exchange-wirte-review/ffc6bfc78b5804d6ee5a1c0d336a7687f204514b.png'
import networkAvatar2 from '@/assets/images/exchange-write/exchange-wirte-review/869537da727321f48230bb0930f0c23ea23895ea.png'
import networkAvatar3 from '@/assets/images/exchange-write/exchange-wirte-review/411bc11b158f68b15d2ea2f4e6f61187dc97745f.png'
import networkAvatar4 from '@/assets/images/exchange-write/exchange-wirte-review/840598ca4b77909e47616ff974f748923e3e909d.png'
import networkAvatar5 from '@/assets/images/exchange-write/exchange-wirte-review/945fe4cdb322250cf07a77427087abb9fc88c1cf.png'

// 아이콘
import backArrowIcon from '@/assets/images/writing/Glyph_ undefined.svg'

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
    isAdded?: boolean
    isSelected?: boolean
}

const INITIAL_PARTICIPANTS: Participant[] = [
    { id: 1, name: '나', avatar: avatar1, isMe: true },
    { id: 2, name: '강건우', avatar: avatar2 },
    { id: 3, name: '김예나', avatar: avatar3 },
    { id: 4, name: '김한별', avatar: avatar4 },
    { id: 5, name: '도정윤', avatar: avatar5 },
    { id: 6, name: '문유휘', avatar: avatar6 },
]

const NETWORK_PEOPLE: NetworkPerson[] = [
    { id: 101, name: '김지수', avatar: networkAvatar1, type: '고등학생', region: '제주' },
    { id: 102, name: '김선화', avatar: networkAvatar2, type: '고등학생', region: '제주' },
    { id: 103, name: '박지선', avatar: networkAvatar3, type: '고등학생', region: '제주' },
    { id: 104, name: '김지유', avatar: networkAvatar4, type: '고등학생', region: '제주' },
    { id: 105, name: '안진선', avatar: networkAvatar5, type: '고등학생', region: '제주' },
]

// 전체 검색용 더미 데이터
const ALL_PEOPLE: NetworkPerson[] = [
    { id: 201, name: '김신한', avatar: networkAvatar1, type: '고등학생', region: '제주' },
    { id: 202, name: '박민철', avatar: networkAvatar2, type: '고등학생', region: '제주' },
    { id: 203, name: '이정순', avatar: networkAvatar4, type: '고등학생', region: '제주' },
    { id: 204, name: '박지선', avatar: networkAvatar3, type: '고등학생', region: '제주' },
    { id: 205, name: '안진선', avatar: networkAvatar5, type: '고등학생', region: '제주' },
]

function ParticipantEditPage() {
    const navigate = useNavigate()
    const [activeTab, setActiveTab] = useState<'network' | 'search'>('network')
    const [searchQuery, setSearchQuery] = useState('')
    const [participants, setParticipants] = useState<Participant[]>(INITIAL_PARTICIPANTS)
    const [networkPeople, setNetworkPeople] = useState<NetworkPerson[]>(NETWORK_PEOPLE)
    const [allPeople] = useState<NetworkPerson[]>(ALL_PEOPLE)
    const [selectedPeople, setSelectedPeople] = useState<number[]>([])

    const handleBack = () => {
        navigate(-1)
    }

    const handleRemoveParticipant = (id: number) => {
        const participant = participants.find((p) => p.id === id)
        if (participant && !participant.isMe) {
            setParticipants((prev) => prev.filter((p) => p.id !== id))
        }
    }

    const handleAddPerson = (person: NetworkPerson) => {
        // 이미 참여자 목록에 있으면 무시
        if (participants.some((p) => p.name === person.name)) return

        const newParticipant: Participant = {
            id: Date.now(),
            name: person.name,
            avatar: person.avatar,
        }
        setParticipants((prev) => [...prev, newParticipant])
        setNetworkPeople((prev) =>
            prev.map((p) => (p.id === person.id ? { ...p, isAdded: true } : p))
        )
    }

    const handleToggleSelect = (personId: number) => {
        setSelectedPeople((prev) => {
            if (prev.includes(personId)) {
                return prev.filter((id) => id !== personId)
            }
            return [...prev, personId]
        })
    }

    const handleAddSelected = () => {
        const peopleToAdd = allPeople.filter((p) => selectedPeople.includes(p.id))
        peopleToAdd.forEach((person) => {
            if (!participants.some((p) => p.name === person.name)) {
                const newParticipant: Participant = {
                    id: Date.now() + person.id,
                    name: person.name,
                    avatar: person.avatar,
                }
                setParticipants((prev) => [...prev, newParticipant])
            }
        })
        setSelectedPeople([])
        navigate(-1)
    }

    const filteredNetworkPeople = networkPeople.filter((person) =>
        person.name.toLowerCase().includes(searchQuery.toLowerCase())
    )

    const filteredAllPeople = allPeople.filter((person) =>
        person.name.toLowerCase().includes(searchQuery.toLowerCase())
    )

    return (
        <div className={styles.container}>
            {/* Header */}
            <div className={styles.header}>
                <button className={styles.backButton} onClick={handleBack}>
                    <img src={backArrowIcon} alt="뒤로가기" />
                </button>
                <span className={styles.headerTitle}>참여 인원 수정</span>
            </div>

            {/* 활동 참여 인원 섹션 */}
            <div className={styles.participantSection}>
                <div className={styles.sectionHeader}>
                    <span className={styles.sectionTitle}>활동 참여 인원</span>
                    <span className={styles.participantCount}>{participants.length}명</span>
                </div>

                {/* 참여 인원 아바타 목록 (수평 스크롤) */}
                <div className={styles.participantList}>
                    {participants.map((participant) => (
                        <div key={participant.id} className={styles.participantItem}>
                            <div className={styles.avatarWrapper}>
                                <img
                                    src={participant.avatar}
                                    alt={participant.name}
                                    className={styles.avatar}
                                />
                                {!participant.isMe && (
                                    <button
                                        className={styles.removeButton}
                                        onClick={() => handleRemoveParticipant(participant.id)}
                                    >
                                        <span className={styles.removeIcon}>×</span>
                                    </button>
                                )}
                            </div>
                            <span
                                className={`${styles.participantName} ${participant.isMe ? styles.participantNameMe : ''
                                    }`}
                            >
                                {participant.name}
                            </span>
                        </div>
                    ))}
                </div>
            </div>

            {/* 하단 카드 영역 */}
            <div className={styles.bottomCard}>
                {/* 탭 전환 */}
                <div className={styles.tabContainer}>
                    <button
                        className={`${styles.tab} ${activeTab === 'network' ? styles.tabActive : ''}`}
                        onClick={() => setActiveTab('network')}
                    >
                        나의 교류망
                    </button>
                    <button
                        className={`${styles.tab} ${activeTab === 'search' ? styles.tabActive : ''}`}
                        onClick={() => setActiveTab('search')}
                    >
                        전체 검색
                    </button>
                </div>

                {/* 검색 입력창 */}
                <div className={styles.searchContainer}>
                    <input
                        type="text"
                        className={styles.searchInput}
                        placeholder="입력해주세요"
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                    />
                    <button className={styles.searchButton}>
                        <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <circle cx="9" cy="9" r="6" stroke="#C8C8C8" strokeWidth="2" />
                            <path d="M14 14L18 18" stroke="#C8C8C8" strokeWidth="2" strokeLinecap="round" />
                        </svg>
                    </button>
                </div>

                {/* 나의 교류망 탭 */}
                {activeTab === 'network' && (
                    <>
                        <div className={styles.listHeader}>
                            <span className={styles.listTitle}>나의 교류망</span>
                            <button className={styles.addAllButton}>추가하기</button>
                        </div>

                        <div className={styles.personList}>
                            {filteredNetworkPeople.map((person) => (
                                <div
                                    key={person.id}
                                    className={styles.personItem}
                                    onClick={() => handleAddPerson(person)}
                                >
                                    <div className={styles.personInfo}>
                                        <img src={person.avatar} alt={person.name} className={styles.personAvatar} />
                                        <span className={styles.personName}>{person.name}</span>
                                    </div>
                                    <div className={styles.personMeta}>
                                        <span className={styles.personType}>{person.type}</span>
                                        <span className={styles.personDivider}>|</span>
                                        <span className={styles.personRegion}>{person.region}</span>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </>
                )}

                {/* 전체 검색 탭 */}
                {activeTab === 'search' && (
                    <>
                        <div className={styles.listHeader}>
                            <span className={styles.listTitle}>다른 사람들</span>
                            <button className={styles.addAllButton}>멤버 추가하기</button>
                        </div>

                        <div className={styles.personList}>
                            {filteredAllPeople.map((person) => (
                                <div
                                    key={person.id}
                                    className={`${styles.personItem} ${selectedPeople.includes(person.id) ? styles.personItemSelected : ''}`}
                                    onClick={() => handleToggleSelect(person.id)}
                                >
                                    <div className={styles.personInfo}>
                                        <img src={person.avatar} alt={person.name} className={styles.personAvatar} />
                                        <span className={styles.personName}>{person.name}</span>
                                    </div>
                                    <div className={styles.personMeta}>
                                        <span className={styles.personType}>{person.type}</span>
                                        <span className={styles.personDivider}>|</span>
                                        <span className={styles.personRegion}>{person.region}</span>
                                    </div>
                                </div>
                            ))}
                        </div>

                        {/* 추가하기 버튼 */}
                        <button
                            className={styles.addButton}
                            onClick={handleAddSelected}
                        >
                            추가하기
                        </button>
                    </>
                )}
            </div>
        </div>
    )
}

export default ParticipantEditPage
