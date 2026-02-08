import styles from '../styles'
import welcomeGraphic from '@assets/images/onboarding_welcome.png'

export function WelcomeStep() {
  return (
    <div className={styles.welcomeContainer}>
      <div className={styles.welcomeContent}>
        <h1 className={styles.welcomeTitle}>
          너와 나, 우리 솔잎들의
          <br />
          꿈을 응원해
        </h1>
        <p className={styles.welcomeSubtitle}>신한님의 꿈을 향한 첫 발걸음</p>

        <div className={styles.welcomeImagePlaceholder}>
          <img src={welcomeGraphic} alt="Welcome" className={styles.welcomeImage} />
        </div>
      </div>
    </div>
  )
}
