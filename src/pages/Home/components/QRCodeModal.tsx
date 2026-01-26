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
}

export function QRCodeModal({
  isOpen,
  onClose,
  userId = 'user-123',
  userName = '김솔잎'
}: QRCodeModalProps) {
  if (!isOpen) return null

  // QR 코드에 담을 URL (프로필 공유용)
  const shareUrl = `${window.location.origin}/profile/${userId}`

  return (
    <div className={styles.qrModalOverlay} onClick={onClose}>
      <div className={styles.qrModalCard} onClick={(e) => e.stopPropagation()}>
        {/* SOLID 로고 */}
        <div className={styles.qrCardLogo}>
          <span className={styles.qrLogoSol}>SOL</span>
          <span className={styles.qrLogoId}>ID</span>
        </div>

        {/* 프로필 정보 */}
        <div className={styles.qrProfileSection}>
          <span className={styles.qrProfileName}>{userName}</span>
          <span className={styles.qrProfileBadge}>솔방울</span>
          <span className={styles.qrProfileTag}>체육교사꿈나무</span>
        </div>

        {/* QR 코드 */}
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

      {/* 닫기 버튼 */}
      <button className={styles.qrCloseButtonCircle} onClick={onClose}>
        <img src={xIcon} alt="닫기" />
      </button>
    </div>
  )
}
