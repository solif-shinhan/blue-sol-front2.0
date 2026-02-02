import { MockUser } from '@/data/mockUsers'
import styles from './PublicSolidCard.module.css'

interface PublicSolidCardProps {
  userData: MockUser
  onAddNetwork: () => void
  isAdded: boolean
}

function PublicSolidCard({ userData, onAddNetwork, isAdded }: PublicSolidCardProps) {
  return (
    <div className={styles.container}>
      {/* Header */}
      <div className={styles.header}>
        <div className={styles.headerSpacer} />
        <span className={styles.headerTitle}>SOLID 프로필</span>
        <div className={styles.headerSpacer} />
      </div>

      {/* Card */}
      <div className={styles.card}>
        <div className={styles.solidLogo}>
          <span className={styles.solidLogoSol}>SOL</span>
          <span className={styles.solidLogoId}>ID</span>
        </div>

        <div className={styles.profileSection}>
          <span className={styles.profileName}>{userData.name}</span>
          <span className={styles.profileBadge}>{userData.badge}</span>
          {userData.tag && <span className={styles.profileTag}>{userData.tag}</span>}
        </div>

        <div className={styles.goalList}>
          {userData.goals[0] && <p className={styles.goalItem1}>{userData.goals[0]}</p>}
          {userData.goals[1] && <p className={styles.goalItem2}>{userData.goals[1]}</p>}
          {userData.goals[2] && <p className={styles.goalItem3}>{userData.goals[2]}</p>}
        </div>

        <div className={styles.interestTags}>
          {userData.interests.slice(0, 2).map((interest, index) => (
            <div key={index} className={styles.interestTag}>
              <div className={styles.tagIcon} />
              <span>{interest}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Add to Network Button */}
      <button
        className={`${styles.addNetworkButton} ${isAdded ? styles.addNetworkButtonAdded : ''}`}
        onClick={onAddNetwork}
        disabled={isAdded}
      >
        <div className={styles.addNetworkIcon}>
          {isAdded ? (
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
              <path d="M5 12L10 17L19 8" stroke="#FFFFFF" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          ) : (
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
              <path d="M12 5V19M5 12H19" stroke="#FFFFFF" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          )}
        </div>
        <span>{isAdded ? '교류망에 추가됨' : '교류망 추가하기'}</span>
      </button>

      {/* Footer */}
      <div className={styles.footer}>
        <span className={styles.footerText}>푸른 SOL</span>
      </div>
    </div>
  )
}

export default PublicSolidCard
