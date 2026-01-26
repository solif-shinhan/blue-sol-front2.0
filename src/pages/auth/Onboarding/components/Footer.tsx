import styles from '../styles'
import purunLogo from '@assets/images/purun.svg'
import solLogo from '@assets/images/SOL.svg'
import type { OnboardingStep } from '../types'

interface FooterProps {
  step: OnboardingStep
  buttonText: string
  canProceed: boolean
  onNext: () => void
}

export function Footer({ step, buttonText, canProceed, onNext }: FooterProps) {
  return (
    <div className={styles.footer}>
      {step === 'welcome' && (
        <div className={styles.welcomeFooter}>
          <div className={styles.logoContainer}>
            <img src={purunLogo} alt="푸른" className={styles.logoIcon} />
            <img src={solLogo} alt="SOL" className={styles.logoIcon} />
          </div>
          <p className={styles.logoTagline}>솔잎, 성장의 숲으로</p>
        </div>
      )}
      <button
        className={`${styles.ctaButton} ${!canProceed ? styles.disabled : ''}`}
        onClick={onNext}
        disabled={!canProceed}
      >
        {buttonText}
      </button>
    </div>
  )
}
