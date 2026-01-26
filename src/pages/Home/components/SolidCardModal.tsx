import styles1 from '../Home-1.module.css'
import styles2 from '../Home-2.module.css'
import styles3 from '../Home-3.module.css'

const styles = { ...styles1, ...styles2, ...styles3 }

interface SolidCardModalProps {
  isOpen: boolean
  onClose: () => void
  onShare: () => void
  onEdit: () => void
  onNetwork: () => void
}

export function SolidCardModal({
  isOpen,
  onClose,
  onShare,
  onEdit,
  onNetwork
}: SolidCardModalProps) {
  if (!isOpen) return null

  return (
    <div className={styles.modalOverlay} onClick={onClose}>
      <div className={styles.modalContent} onClick={(e) => e.stopPropagation()}>
        {/* Header */}
        <div className={styles.modalHeader}>
          <button className={styles.modalBackButton} onClick={onClose}>
            <img src="/←.svg" alt="뒤로가기" />
          </button>
          <span className={styles.modalTitle}>나의 SOLID</span>
          <div className={styles.modalHeaderSpacer} />
        </div>

        {/* Card */}
        <div className={styles.modalCard}>
          <div className={styles.solidLogo}>
            <span className={styles.solidLogoSol}>SOL</span>
            <span className={styles.solidLogoId}>ID</span>
          </div>
          <div className={styles.modalProfileSection}>
            <span className={styles.modalProfileName}>김솔잎</span>
            <span className={styles.modalProfileBadge}>솔방울</span>
            <span className={styles.modalProfileTag}>체육교사꿈나무</span>
          </div>
          <div className={styles.modalGoalList}>
            <p className={styles.modalGoalItem1}>한체대 27학번으로 입학하기</p>
            <p className={styles.modalGoalItem2}>체육대회 우승하기</p>
            <p className={styles.modalGoalItem3}>가족 여행 가기</p>
          </div>
          <div className={styles.modalInterestTags}>
            <div className={styles.modalInterestTag}>
              <div className={styles.modalTagIcon} />
              <span>농구</span>
            </div>
            <div className={styles.modalInterestTag}>
              <div className={styles.modalTagIcon} />
              <span>봉사활동</span>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className={styles.modalActions}>
          <button className={styles.modalActionButton} onClick={onNetwork}>
            <div className={styles.modalActionIcon} />
            <span>교류망</span>
          </button>
          <button className={styles.modalActionButton} onClick={onShare}>
            <div className={styles.modalActionIcon} />
            <span>공유하기</span>
          </button>
          <button className={styles.modalActionButton} onClick={onEdit}>
            <div className={styles.modalActionIcon} />
            <span>편집하기</span>
          </button>
        </div>
      </div>
    </div>
  )
}
