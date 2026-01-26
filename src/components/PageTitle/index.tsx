import styles from './PageTitle.module.css'

interface PageTitleProps {
    /** Bold text (e.g., "회원 가입 유형", "장학생 기본 정보") */
    boldText: string
    /** Light suffix (e.g., "을", "를") */
    suffix?: string
    /** Subtitle (e.g., "선택해주세요", "입력해주세요") */
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
