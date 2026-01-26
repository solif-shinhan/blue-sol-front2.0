import styles from './PageHeader.module.css'

interface PageHeaderProps {
  /** 메인 타이틀 */
  title: string
  /** 서브타이틀 (선택) */
  subtitle?: string
  /** 타이틀 스타일 변형 */
  variant?: 'default' | 'form'
  /** 타이틀에서 강조할 부분 (form 변형에서 사용) */
  titleBold?: string
  /** 추가 클래스명 */
  className?: string
}

export function PageHeader({
  title,
  subtitle,
  variant = 'default',
  titleBold,
  className = '',
}: PageHeaderProps) {
  if (variant === 'form' && titleBold) {
    return (
      <div className={`${styles.header} ${styles.formHeader} ${className}`}>
        <h1 className={styles.formTitle}>
          <span className={styles.titleBold}>{titleBold}</span>{title}
          {subtitle && (
            <>
              <br />
              {subtitle}
            </>
          )}
        </h1>
      </div>
    )
  }

  return (
    <header className={`${styles.header} ${className}`}>
      <h1 className={styles.title}>{title}</h1>
      {subtitle && <p className={styles.subtitle}>{subtitle}</p>}
    </header>
  )
}

export default PageHeader
