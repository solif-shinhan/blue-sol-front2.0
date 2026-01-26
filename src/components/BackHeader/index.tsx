import { useNavigate } from 'react-router-dom'
import styles from './BackHeader.module.css'

interface BackHeaderProps {
  /** 뒤로가기 클릭 시 이동할 경로. 미지정 시 history.back() */
  backTo?: string
  /** 커스텀 뒤로가기 핸들러 */
  onBack?: () => void
  /** 프로그레스 바 표시 여부 */
  showProgress?: boolean
  /** 전체 단계 수 */
  totalSteps?: number
  /** 현재 단계 (1부터 시작) */
  currentStep?: number
  /** 오른쪽 영역 컨텐츠 */
  rightContent?: React.ReactNode
  /** 배경 테마 - dark: 흰색 아이콘, light: 검은색 아이콘 */
  theme?: 'light' | 'dark'
  /** 헤더 타이틀 (중앙에 표시) */
  title?: string
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

  // 테마에 따른 아이콘 선택
  const backIcon = theme === 'dark' ? '/←-white.svg' : '/←.svg'

  // 버튼과 진행바 사이 gap (totalSteps에 따라)
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
      <button className={styles.backButton} onClick={handleBack} aria-label="뒤로가기">
        <img src={backIcon} alt="뒤로가기" />
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

