import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import type { OnboardingStep, OnboardingData } from './types'
import { STEP_ORDER, INITIAL_ONBOARDING_DATA } from './constants'

const STEP_FLOW: Record<OnboardingStep, { next: OnboardingStep | null; prev: OnboardingStep | null }> = {
  welcome: { next: 'interests', prev: null },
  interests: { next: 'goals', prev: 'welcome' },
  goals: { next: 'sns', prev: 'interests' },
  sns: { next: 'pattern', prev: 'goals' },
  pattern: { next: 'character', prev: 'sns' },
  character: { next: 'complete', prev: 'pattern' },
  complete: { next: null, prev: 'character' },
}

export function useOnboarding() {
  const navigate = useNavigate()
  const [step, setStep] = useState<OnboardingStep>('welcome')
  const [data, setData] = useState<OnboardingData>(INITIAL_ONBOARDING_DATA)

  const currentStepIndex = STEP_ORDER.indexOf(step)

  const updateData = <K extends keyof OnboardingData>(key: K, value: OnboardingData[K]) => {
    setData(prev => ({ ...prev, [key]: value }))
  }

  const toggleInterest = (id: string) => {
    setData(prev => ({
      ...prev,
      selectedInterests: prev.selectedInterests.includes(id)
        ? prev.selectedInterests.filter(i => i !== id)
        : [...prev.selectedInterests, id]
    }))
  }

  const updateGoal = (index: number, value: string) => {
    setData(prev => ({
      ...prev,
      goals: prev.goals.map((g, i) => i === index ? value : g)
    }))
  }

  const addGoal = () => {
    setData(prev => {
      if (prev.goals.length >= 5) return prev
      return { ...prev, goals: [...prev.goals, ''] }
    })
  }

  const removeGoal = (index: number) => {
    setData(prev => {
      if (prev.goals.length <= 1) return prev
      return { ...prev, goals: prev.goals.filter((_, i) => i !== index) }
    })
  }

  const canProceed = (): boolean => {
    switch (step) {
      case 'welcome':
      case 'complete':
        return true
      case 'interests':
        return data.selectedInterests.length >= 3
      case 'goals':
        return data.goals.some(g => g.trim().length > 0)
      case 'sns':
        return true // Optional
      case 'pattern':
        return !!data.selectedPattern
      case 'character':
        return !!data.selectedCharacter
    }
  }

  const completeOnboarding = () => {
    localStorage.setItem('hasCompletedOnboarding', 'true')
    localStorage.setItem('userInterests', JSON.stringify(data.selectedInterests))
    localStorage.setItem('userGoals', JSON.stringify(data.goals.filter(g => g.trim().length > 0)))
    localStorage.setItem('userSnsId', data.snsId)
    localStorage.setItem('userSocialLink', data.socialLink)
    localStorage.setItem('userPattern', data.selectedPattern)
    localStorage.setItem('userCharacter', data.selectedCharacter)
    navigate('/home')
  }

  const handleNext = () => {
    if (step === 'complete') {
      completeOnboarding()
      return
    }

    const nextStep = STEP_FLOW[step].next
    if (nextStep) {
      setStep(nextStep)
    }
  }

  const handleBack = () => {
    const prevStep = STEP_FLOW[step].prev
    if (prevStep) {
      setStep(prevStep)
    }
  }

  const getButtonText = (): string => {
    if (step === 'welcome' || step === 'complete') {
      return '시작하기'
    }
    return '다음'
  }

  return {
    step,
    data,
    currentStepIndex,
    steps: STEP_ORDER,
    updateData,
    toggleInterest,
    updateGoal,
    addGoal,
    removeGoal,
    canProceed,
    handleNext,
    handleBack,
    getButtonText,
  }
}
