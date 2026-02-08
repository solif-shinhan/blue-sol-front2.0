import { QRCodeSVG } from 'qrcode.react'
import styles1 from '../Home-1.module.css'
import styles2 from '../Home-2.module.css'
import styles3 from '../Home-3.module.css'
import iconPeopleCommunity from '@/assets/images/solid/icon-people-community.svg'
import iconPersonEdit from '@/assets/images/solid/icon-person-edit.svg'
import iconDismiss from '@/assets/images/solid/icon-dismiss.svg'
import { Character } from '@/features/02-onboarding/types/card-1'

const styles = { ...styles1, ...styles2, ...styles3 }

interface QRCodeModalProps {
  isOpen: boolean
  onClose: () => void
  onNetwork: () => void
  onEdit: () => void
  userId?: string
  userName?: string
  userRole?: string
  character?: Character | null
  school?: string
  sinceYear?: string
}

export function QRCodeModal({
  isOpen,
  onClose,
  onNetwork,
  onEdit,
  userId = 'user-123',
  userName = '사용자',
  userRole = '',
  character,
  school = '',
  sinceYear = '2026',
}: QRCodeModalProps) {
  if (!isOpen) return null

  const shareUrl = `${window.location.origin}/profile/${userId}`

  return (
    <div className={styles.qrModalOverlay} onClick={onClose}>
      <div className={styles.qrModalContent} onClick={(e) => e.stopPropagation()}>
        {/* SOLID Card with QR */}
        <div className={styles.qrCard}>
          <div className={styles.qrCardGradient} />

          <div className={styles.qrCardLogo}>
            <span className={styles.qrLogoSol}>SOL</span>
            <span className={styles.qrLogoId}>ID</span>
          </div>

          <div className={styles.qrCardProfile}>
            <span className={styles.qrCardName}>{userName}</span>
            <span className={styles.qrCardRole}>{userRole}</span>
          </div>

          {character?.imageUrl && (
            <img
              className={styles.qrCardCharacter}
              src={character.imageUrl}
              alt={character.name}
            />
          )}

          <div className={styles.qrCodeBox}>
            <QRCodeSVG
              value={shareUrl}
              size={256}
              level="H"
              includeMargin={false}
              bgColor="#FFFFFF"
              fgColor="#000000"
            />
          </div>

          <div className={styles.qrCardFooter}>
            <span className={styles.qrCardSchool}>{school}</span>
            <span className={styles.qrCardSince}>SINCE {sinceYear}</span>
          </div>
        </div>

        {/* Action Buttons: 교류망 | X닫기 | 편집하기 */}
        <div className={styles.qrActions}>
          <button className={styles.modalActionButton} onClick={onNetwork}>
            <div className={`${styles.modalActionIcon} ${styles.networkIcon}`}>
              <img src={iconPeopleCommunity} alt="교류망" />
            </div>
            <span>교류망</span>
          </button>
          <button className={styles.qrCloseButtonCircle} onClick={onClose}>
            <img src={iconDismiss} alt="닫기" />
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
