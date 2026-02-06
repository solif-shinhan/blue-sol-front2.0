import { QRCodeSVG } from 'qrcode.react'
import styles1 from '../Home-1.module.css'
import styles2 from '../Home-2.module.css'
import styles3 from '../Home-3.module.css'
import xIcon from '@/assets/images/x.svg'

const styles = { ...styles1, ...styles2, ...styles3 }

interface QRCodeModalProps {
  isOpen: boolean
  onClose: () => void
  userId?: string
  userName?: string
  userRole?: string
}

export function QRCodeModal({
  isOpen,
  onClose,
  userId = 'user-123',
  userName = '사용자',
  userRole = '',
}: QRCodeModalProps) {
  if (!isOpen) return null

  const shareUrl = `${window.location.origin}/profile/${userId}`

  return (
    <div className={styles.qrModalOverlay} onClick={onClose}>
      <div className={styles.qrModalCard} onClick={(e) => e.stopPropagation()}>
        <div className={styles.qrCardLogo}>
          <span className={styles.qrLogoSol}>SOL</span>
          <span className={styles.qrLogoId}>ID</span>
        </div>

        <div className={styles.qrProfileSection}>
          <span className={styles.qrProfileName}>{userName}</span>
          <span className={styles.qrProfileBadge}>솔방울</span>
          <span className={styles.qrProfileTag}>{userRole}</span>
        </div>

        <div className={styles.qrCodeBox}>
          <QRCodeSVG
            value={shareUrl}
            size={256}
            level="H"
            includeMargin={false}
            bgColor="#EEEEEE"
            fgColor="#000000"
          />
        </div>
      </div>

      <button className={styles.qrCloseButtonCircle} onClick={onClose}>
        <img src={xIcon} alt="닫기" />
      </button>
    </div>
  )
}
