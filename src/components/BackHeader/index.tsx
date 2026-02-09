import { useNavigate } from 'react-router-dom'
import styles from './BackHeader.module.css'
import backArrowIcon from '@/assets/images/network/2107e80ddcb5d091c59aaa449d05031a375ef1a0.svg'
import closeIcon from '@/assets/images/receipt/0b7bc06416da92a5ef1b39ad0d8fbfacd05ce59d.svg'

interface BackHeaderProps {
  backTo?: string
  onBack?: () => void
  showProgress?: boolean
  totalSteps?: number
  currentStep?: number
  rightContent?: React.ReactNode
  theme?: 'light' | 'dark'
  title?: string
  icon?: 'back' | 'close'
}

export function BackHeader({
  backTo,
  onBack,
  showProgress = false,
  totalSteps = 3,
  currentStep = 1,
  rightContent,
  theme = 'light',
  title,
  icon = 'back',
}: BackHeaderProps) {
  const navigate = useNavigate()

  const handleBack = () => {
    if (onBack) {
      onBack()
    } else if (backTo) {
      navigate(backTo)
    } else {
      navigate(-1)
    }
  }

  const iconSrc = icon === 'close' ? closeIcon : backArrowIcon
  const iconLabel = icon === 'close' ? '닫기' : '뒤로가기'

  const getGap = () => {
    switch (totalSteps) {
      case 2: return 263
      case 3: return 225
      case 4: return 189
      default: return 225
    }
  }

  const headerClasses = `${styles.header} ${theme === 'dark' ? styles.themeDark : styles.themeLight}`

  return (
    <div className={headerClasses} style={{ gap: showProgress ? `${getGap()}px` : undefined }}>
      <button className={styles.backButton} onClick={handleBack} aria-label={iconLabel}>
        <img src={iconSrc} alt={iconLabel} />
      </button>

      {title && (
        <span className={styles.headerTitle}>{title}</span>
      )}

      {showProgress && (
        <div className={styles.progressBar}>
          {Array.from({ length: totalSteps }, (_, i) => (
            <div
              key={i}
              className={`${styles.progressSegment} ${i < currentStep ? styles.active : ''}`}
            />
          ))}
        </div>
      )}

      {rightContent && (
        <div className={styles.rightContent}>{rightContent}</div>
      )}
    </div>
  )
}

export default BackHeader

