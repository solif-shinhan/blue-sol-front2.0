import { useNavigate } from 'react-router-dom'
import styles1 from './MyCouncilActivity-1.module.css'
import styles2 from './MyCouncilActivity-2.module.css'
const styles = { ...styles1, ...styles2 }

const COUNCIL_MEMBERS = [
  { id: 1, name: '김지환', isLeader: true, type: '고등학생', region: '제주' },
  { id: 2, name: '안선화', isLeader: false, type: '고등학생', region: '제주' },
  { id: 3, name: '김지유', isLeader: false, type: '고등학생', region: '제주' },
  { id: 4, name: '박지환', isLeader: false, type: '고등학생', region: '제주' },
  { id: 5, name: '박지선', isLeader: false, type: '고등학생', region: '제주' },
]

function ActivityMembers() {
  const navigate = useNavigate()

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
        {COUNCIL_MEMBERS.map((member) => (
          <div key={member.id} className={styles.memberCard}>
            <div className={styles.memberCardInner}>
              <div className={styles.memberInfo}>
                <div className={styles.memberAvatar} />
                <span className={styles.memberName}>{member.name}</span>
                {member.isLeader && (
                  <span className={styles.leaderBadge}>리더</span>
                )}
              </div>
              <div className={styles.memberMeta}>
                <span className={styles.memberMetaText}>{member.type}</span>
                <div className={styles.memberMetaDivider} />
                <span className={styles.memberMetaText}>{member.region}</span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

export default ActivityMembers
