import styles from '../styles'
import { INTEREST_OPTIONS } from '../constants'

interface InterestsStepProps {
  selectedInterests: string[]
  onToggle: (id: string) => void
}

export function InterestsStep({ selectedInterests, onToggle }: InterestsStepProps) {
  return (
    <div className={styles.stepContainer}>
      <div className={styles.stepHeader}>
        <h1 className={styles.stepTitle}>관심사를 알려주세요</h1>
        <p className={styles.stepSubtitle}>최소 3개 이상 선택해주세요</p>
      </div>

      <div className={styles.interestsGrid}>
        {INTEREST_OPTIONS.map(interest => (
          <button
            key={interest.id}
            className={`${styles.interestChip} ${
              selectedInterests.includes(interest.id) ? styles.selected : ''
            }`}
            onClick={() => onToggle(interest.id)}
          >
            <span className={styles.interestIcon}>{interest.icon}</span>
            <span className={styles.interestLabel}>{interest.label}</span>
          </button>
        ))}
        <button className={styles.addInterestButton}>
          <img src="/+.svg" alt="추가" className={styles.addIcon} />
        </button>
      </div>
    </div>
  )
}
