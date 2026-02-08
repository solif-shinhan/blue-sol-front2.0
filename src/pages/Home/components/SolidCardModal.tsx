import { useState, useCallback, useEffect } from 'react'
import styles1 from '../Home-1.module.css'
import styles2 from '../Home-2.module.css'
import styles3 from '../Home-3.module.css'
import backArrowIcon from '@/assets/images/Glyph_ undefined.svg'
import iconPeopleCommunity from '@/assets/images/solid/icon-people-community.svg'
import iconShare from '@/assets/images/solid/icon-share.svg'
import iconPersonEdit from '@/assets/images/solid/icon-person-edit.svg'
import { SolidCardPreview } from '@/features/02-onboarding/components/SolidCardPreview-1'
import { Character, BackgroundColor, Interest } from '@/features/02-onboarding/types/card-1'

const styles = { ...styles1, ...styles2, ...styles3 }

interface SolidCardModalProps {
  isOpen: boolean
  onClose: () => void
  onShare: () => void
  onEdit: () => void
  onNetwork: () => void
  character: Character | null
  backgroundColor: BackgroundColor | null
  userName: string
  userRole: string
  interests: Interest[]
  goals: string[]
  region: string
  school: string
  sinceYear: string
}

export function SolidCardModal({
  isOpen,
  onClose,
  onShare,
  onEdit,
  onNetwork,
  character,
  backgroundColor,
  userName,
  userRole,
  interests,
  goals,
  region,
  school,
  sinceYear,
}: SolidCardModalProps) {
  const [isVisible, setIsVisible] = useState(false)
  const [isClosing, setIsClosing] = useState(false)

  useEffect(() => {
    if (isOpen) {
      setIsVisible(true)
      setIsClosing(false)
    }
  }, [isOpen])

  const handleClose = useCallback(() => {
    setIsClosing(true)
    setTimeout(() => {
      setIsClosing(false)
      setIsVisible(false)
      onClose()
    }, 300)
  }, [onClose])

  if (!isVisible) return null

  const overlayClass = [
    styles.modalOverlay,
    isClosing && styles.modalOverlayClosing,
  ].filter(Boolean).join(' ')

  const contentClass = [
    styles.modalContent,
    isClosing && styles.modalContentClosing,
  ].filter(Boolean).join(' ')

  return (
    <div className={overlayClass} onClick={handleClose}>
      <div className={contentClass} onClick={(e) => e.stopPropagation()}>
        <div className={styles.modalHeader}>
          <div className={styles.modalHeaderInner}>
            <button className={styles.modalBackButton} onClick={handleClose}>
              <img src={backArrowIcon} alt="뒤로가기" />
            </button>
            <span className={styles.modalTitle}>나의 SOLID</span>
          </div>
        </div>

        <div style={{ marginTop: '20px' }}>
          <SolidCardPreview
            character={character}
            backgroundColor={backgroundColor}
            userName={userName}
            userRole={userRole}
            interests={interests}
            goals={goals}
            region={region}
            school={school}
            sinceYear={sinceYear}
            size="medium"
          />
        </div>

        <div className={styles.modalActions}>
          <button className={styles.modalActionButton} onClick={onNetwork}>
            <div className={`${styles.modalActionIcon} ${styles.networkIcon}`}>
              <img src={iconPeopleCommunity} alt="교류망" />
            </div>
            <span>교류망</span>
          </button>
          <button className={styles.modalActionButton} onClick={onShare}>
            <div className={`${styles.modalActionIcon} ${styles.shareIcon}`}>
              <img src={iconShare} alt="공유하기" />
            </div>
            <span>공유하기</span>
          </button>
          <button className={styles.modalActionButton} onClick={onEdit}>
            <div className={`${styles.modalActionIcon} ${styles.editIcon}`}>
              <img src={iconPersonEdit} alt="편집하기" />
            </div>
            <span>편집하기</span>
          </button>
        </div>
      </div>
    </div>
  )
}
