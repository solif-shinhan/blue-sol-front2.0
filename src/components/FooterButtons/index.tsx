import styles from './FooterButtons.module.css'

interface FooterButtonsProps {
    onLogout?: () => void
    onLogoClick?: () => void
}

function FooterButtons({ onLogout, onLogoClick }: FooterButtonsProps) {
    return (
        <div className={styles.container}>
            <button className={styles.button} onClick={onLogout}>
                <span className={styles.logoutText}>로그아웃</span>
            </button>
            <button className={styles.button} onClick={onLogoClick}>
                <img
                    src="/homelogo.png"
                    alt="신한장학재단"
                    className={styles.logoImage}
                />
            </button>
        </div>
    )
}

export { FooterButtons }
export default FooterButtons
