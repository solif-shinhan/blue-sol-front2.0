import styles from './styles'
import { useOnboarding } from './useOnboarding'
import {
  Header,
  Footer,
  WelcomeStep,
  InterestsStep,
  GoalsStep,
  SnsStep,
  PatternStep,
  CharacterStep,
  CompleteStep,
} from './components'

function OnboardingPage() {
  const {
    step,
    data,
    currentStepIndex,
    steps,
    updateData,
    toggleInterest,
    updateGoal,
    addGoal,
    removeGoal,
    canProceed,
    handleNext,
    handleBack,
    getButtonText,
  } = useOnboarding()

  const renderStep = () => {
    switch (step) {
      case 'welcome':
        return <WelcomeStep />
      case 'interests':
        return (
          <InterestsStep
            selectedInterests={data.selectedInterests}
            onToggle={toggleInterest}
          />
        )
      case 'goals':
        return (
          <GoalsStep
            goals={data.goals}
            onUpdateGoal={updateGoal}
            onAddGoal={addGoal}
            onRemoveGoal={removeGoal}
          />
        )
      case 'sns':
        return (
          <SnsStep
            snsId={data.snsId}
            socialLink={data.socialLink}
            onSnsIdChange={(value) => updateData('snsId', value)}
            onSocialLinkChange={(value) => updateData('socialLink', value)}
            onSkip={handleNext}
          />
        )
      case 'pattern':
        return (
          <PatternStep
            selectedPattern={data.selectedPattern}
            onSelect={(value) => updateData('selectedPattern', value)}
          />
        )
      case 'character':
        return (
          <CharacterStep
            selectedCharacter={data.selectedCharacter}
            onSelect={(value) => updateData('selectedCharacter', value)}
          />
        )
      case 'complete':
        return <CompleteStep />
    }
  }

  return (
    <div className={styles.container}>
      <Header
        step={step}
        steps={steps}
        currentStepIndex={currentStepIndex}
        onBack={handleBack}
      />

      <div className={styles.content}>
        {renderStep()}
      </div>

      <Footer
        step={step}
        buttonText={getButtonText()}
        canProceed={canProceed()}
        onNext={handleNext}
      />
    </div>
  )
}

export default OnboardingPage
