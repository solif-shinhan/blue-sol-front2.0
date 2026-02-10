import { BackHeader } from '@/components/BackHeader'
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
    <BackHeader
      onBack={onBack}
      showProgress={step !== 'complete'}
      totalSteps={steps.length}
      currentStep={currentStepIndex + 1}
    />
  )
}
