import styles from './PageTitle.module.css'

interface PageTitleProps {
    boldText: string
    suffix?: string
    subtitle: string
    className?: string
}

function PageTitle({ boldText, suffix = '', subtitle, className = '' }: PageTitleProps) {
    return (
        <div className={`${styles.container} ${className}`}>
            <h1 className={styles.title}>
                <span className={styles.titleBold}>{boldText}</span>
                {suffix && <span className={styles.titleLight}>{suffix}</span>}
            </h1>
            <p className={styles.subtitle}>{subtitle}</p>
        </div>
    )
}

export default PageTitle
