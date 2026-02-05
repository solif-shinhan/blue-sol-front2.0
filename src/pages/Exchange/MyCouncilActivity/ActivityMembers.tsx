import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import styles1 from './MyCouncilActivity-1.module.css'
import styles2 from './MyCouncilActivity-2.module.css'
const styles = { ...styles1, ...styles2 }
import { getCouncilMembers, CouncilMember } from '@/services'

interface ActivityMembersProps {
  councilId: number
}

function ActivityMembers({ councilId }: ActivityMembersProps) {
  const navigate = useNavigate()
  const [members, setMembers] = useState<CouncilMember[]>([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const fetchMembers = async () => {
      setIsLoading(true)
      try {
        const response = await getCouncilMembers(councilId)
        if (response.success) {
          setMembers(response.data)
        }
      } catch (err) {
        console.error('멤버 조회 실패:', err)
      } finally {
        setIsLoading(false)
      }
    }

    fetchMembers()
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
                  <div className={styles.memberAvatar} />
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
