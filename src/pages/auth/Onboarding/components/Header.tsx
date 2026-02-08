import styles from '../styles'
import type { OnboardingStep } from '../types'

interface HeaderProps {
  step: OnboardingStep
  steps: OnboardingStep[]
  currentStepIndex: number
  onBack: () => void
}

export function Header({ step, steps, currentStepIndex, onBack }: HeaderProps) {
  if (step === 'welcome') return null

  return (
    <div className={styles.header}>
      <button className={styles.backButton} onClick={onBack}>
        <img src="/←.svg" alt="뒤로가기" />
      </button>

      {step !== 'complete' && (
        <div className={styles.progressBar}>
          {steps.map((s, index) => (
            <div
              key={s}
              className={`${styles.progressSegment} ${
                index <= currentStepIndex ? styles.active : ''
              }`}
            />
          ))}
        </div>
      )}
    </div>
  )
}
