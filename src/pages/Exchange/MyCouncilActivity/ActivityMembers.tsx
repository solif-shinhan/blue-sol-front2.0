import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import styles1 from './MyCouncilActivity-1.module.css'
import styles2 from './MyCouncilActivity-2.module.css'
const styles = { ...styles1, ...styles2 }
import { getCouncilMembers } from '@/services'

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

interface MemberDisplay {
  userId: number
  name: string
  role: string
  userType: string
  region: string
  profileImageUrl?: string
  characterImageUrl?: string
  backgroundImageUrl?: string
  backgroundPattern?: string
}

function getAvatarBackground(member: MemberDisplay): string {
  if (member.backgroundImageUrl) {
    const url = toFullUrl(member.backgroundImageUrl)
    if (url) return `url(${url}) center/cover no-repeat`
  }
  if (member.backgroundPattern) {
    return GRADIENT_MAP[member.backgroundPattern] || GRADIENT_MAP.BLUE_PINK
  }
  return '#E6E6E6'
}

interface ActivityMembersProps {
  councilId: number
}

function ActivityMembers({ councilId }: ActivityMembersProps) {
  const navigate = useNavigate()
  const [members, setMembers] = useState<MemberDisplay[]>([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const fetchMembers = async () => {
      setIsLoading(true)
      try {
        const response = await getCouncilMembers(councilId)
        if (response.success) {
          const list: any[] = response.data?.members ?? []
          setMembers(list.map((m: any) => ({
            userId: m.userId ?? m.id,
            name: m.userName ?? m.name ?? '',
            role: m.role ?? 'MEMBER',
            userType: m.userType ?? m.scholarType ?? '',
            region: m.region ?? '',
            profileImageUrl: m.profileImageUrl ?? m.profileImage ?? '',
            characterImageUrl: m.characterImageUrl ?? '',
            backgroundImageUrl: m.backgroundImageUrl ?? '',
            backgroundPattern: m.backgroundPattern ?? '',
          })))
        }
      } catch (err) {
        console.error('멤버 조회 실패:', err)
      } finally {
        setIsLoading(false)
      }
    }

    if (councilId) fetchMembers()
  }, [councilId])

  return (
    <div className={styles.memberSection}>
      <div className={styles.memberHeader}>
        <h2 className={styles.memberTitle}>자치회 멤버</h2>
        <button
          className={styles.memberAddButton}
          onClick={() => navigate('/exchange/council/member/add')}
        >멤버 추가하기</button>
      </div>
      <div className={styles.memberList}>
        {isLoading ? (
          <div style={{ padding: '20px', textAlign: 'center' }}>로딩 중...</div>
        ) : members.length === 0 ? (
          <div style={{ padding: '20px', textAlign: 'center', color: '#888' }}>멤버가 없습니다.</div>
        ) : (
          members.map((member) => (
            <div key={member.userId} className={styles.memberCard}>
              <div className={styles.memberCardInner}>
                <div className={styles.memberInfo}>
                  <div className={styles.memberAvatar} style={{ background: getAvatarBackground(member), position: 'relative', overflow: 'hidden' }}>
                    {toFullUrl(member.characterImageUrl) ? (
                      <img src={toFullUrl(member.characterImageUrl)} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                    ) : toFullUrl(member.profileImageUrl) ? (
                      <img src={toFullUrl(member.profileImageUrl)} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                    ) : null}
                  </div>
                  <span className={styles.memberName}>{member.name}</span>
                  {member.role === 'LEADER' && (
                    <span className={styles.leaderBadge}>리더</span>
                  )}
                </div>
                <div className={styles.memberMeta}>
                  <span className={styles.memberMetaText}>{member.userType || '장학생'}</span>
                  <div className={styles.memberMetaDivider} />
                  <span className={styles.memberMetaText}>{member.region || '전국'}</span>
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  )
}

export default ActivityMembers
