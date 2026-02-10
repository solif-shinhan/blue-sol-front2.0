import { QRCodeSVG } from 'qrcode.react'
import styles1 from '../Home-1.module.css'
import styles2 from '../Home-2.module.css'
import styles3 from '../Home-3.module.css'
import iconDismiss from '@/assets/images/solid/icon-dismiss.svg'
import iconShare from '@/assets/images/solid/icon-share.svg'
import { Character, BackgroundColor } from '@/features/02-onboarding/types/card-1'

const styles = { ...styles1, ...styles2, ...styles3 }

interface QRCodeModalProps {
  isOpen: boolean
  onClose: () => void
  userId?: string
  userName?: string
  userRole?: string
  character?: Character | null
  backgroundColor?: BackgroundColor | null
  school?: string
  sinceYear?: string
}

export function QRCodeModal({
  isOpen,
  onClose,
  userId = 'user-123',
  userName = '사용자',
  userRole = '',
  character,
  backgroundColor,
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
          {backgroundColor?.imageUrl ? (
            <img
              className={styles.qrCardGradient}
              src={backgroundColor.imageUrl}
              alt=""
              style={{ objectFit: 'cover' }}
            />
          ) : (
            <div className={styles.qrCardGradient} />
          )}

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

        {/* 닫기 + 공유하기 버튼 */}
        <div className={styles.qrActions}>
          <button className={styles.qrActionButton} onClick={onClose}>
            <div className={styles.qrActionIcon}>
              <img src={iconDismiss} alt="닫기" style={{ width: 34, height: 34 }} />
            </div>
            <span>닫기</span>
          </button>
          <button className={styles.qrActionButton} onClick={() => {
            if (navigator.share) {
              navigator.share({ title: `${userName}의 SOLID 카드`, url: shareUrl }).catch(() => {})
            } else {
              navigator.clipboard.writeText(shareUrl).catch(() => {})
            }
          }}>
            <div className={styles.qrActionIcon}>
              <img src={iconShare} alt="공유하기" style={{ width: 36, height: 36 }} />
            </div>
            <span>공유하기</span>
          </button>
        </div>
      </div>
    </div>
  )
}
