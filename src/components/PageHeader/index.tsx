import styles from './PageHeader.module.css'

interface PageHeaderProps {
  title: string
  subtitle?: string
  variant?: 'default' | 'form'
  titleBold?: string
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
