import { useState, useCallback, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import styles1 from '../Home-1.module.css'
import styles2 from '../Home-2.module.css'
import styles3 from '../Home-3.module.css'
import styles4 from '../Home-4.module.css'
import backArrowIcon from '@/assets/images/Glyph_ undefined.svg'
import iconPeopleCommunity from '@/assets/images/solid/icon-people-community.svg'
import iconShare from '@/assets/images/solid/icon-share.svg'
import iconPersonEdit from '@/assets/images/solid/icon-person-edit.svg'
import { SolidCardPreview } from '@/features/02-onboarding/components/SolidCardPreview-1'
import { Character, BackgroundColor, Interest } from '@/features/02-onboarding/types/card-1'
import { missionApi, CategoryProgress } from '@/api/api-3'

const styles = { ...styles1, ...styles2, ...styles3, ...styles4 }

const CATEGORY_NAME_MAP: Record<string, string> = {
  CONNECT: '연결',
  GROW: '성장',
  IMPACT: '기여',
}

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
  const navigate = useNavigate()
  const [isVisible, setIsVisible] = useState(false)
  const [isClosing, setIsClosing] = useState(false)
  const [claimableCategory, setClaimableCategory] = useState<CategoryProgress | null>(null)

  useEffect(() => {
    if (isOpen) {
      setIsVisible(true)
      setIsClosing(false)
      missionApi.getProgress()
        .then((res) => {
          if (res.success && res.data) {
            const claimable = res.data.categoryProgress.find(
              (c) => c.canClaimPinecone && !c.isPineconeEarned
            )
            setClaimableCategory(claimable || null)
          }
        })
        .catch(() => {})
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

  const handleConfirmMission = useCallback(() => {
    setIsClosing(true)
    setTimeout(() => {
      setIsClosing(false)
      setIsVisible(false)
      onClose()
      navigate('/growth')
    }, 300)
  }, [onClose, navigate])

  if (!isVisible) return null

  const overlayClass = [
    styles.modalOverlay,
    isClosing && styles.modalOverlayClosing,
  ].filter(Boolean).join(' ')

  const contentClass = [
    styles.modalContent,
    isClosing && styles.modalContentClosing,
  ].filter(Boolean).join(' ')

  const categoryName = claimableCategory
    ? (CATEGORY_NAME_MAP[claimableCategory.category] || claimableCategory.categoryName)
    : ''

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

        {claimableCategory && (
          <div className={styles.missionBanner}>
            <div className={styles.missionBannerText}>
              <p style={{ margin: 0 }}>미션 완료!</p>
              <p style={{ margin: 0 }}>{categoryName} 솔방울 받으러 가기</p>
            </div>
            <button className={styles.missionBannerBtn} onClick={handleConfirmMission}>
              <span className={styles.missionBannerBtnText}>확인하기</span>
            </button>
          </div>
        )}

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
