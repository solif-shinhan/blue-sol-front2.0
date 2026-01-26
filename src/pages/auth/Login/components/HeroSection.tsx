import styles from '../Login.module.css'
import purunLogo from '@assets/images/purun.svg'
import solLogo from '@assets/images/SOL.svg'

export function HeroSection() {
  return (
    <div className={styles.heroSection}>
      <p className={styles.tagline}>너와 나, 우리 솔잎들의 꿈을 응원해</p>
      <h1 className={styles.logoText}>
        <img src={purunLogo} alt="푸른" className={styles.logoPurun} />
        <img src={solLogo} alt="SOL" className={styles.logoSol} />
      </h1>
    </div>
  )
}
