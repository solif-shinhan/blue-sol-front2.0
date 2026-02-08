export type OnboardingStep =
  | 'welcome'
  | 'interests'
  | 'goals'
  | 'sns'
  | 'pattern'
  | 'character'
  | 'complete'

export interface OnboardingData {
  selectedInterests: string[]
  goals: string[]
  snsId: string
  socialLink: string
  selectedPattern: string
  selectedCharacter: string
}

export interface InterestOption {
  id: string
  label: string
  icon: string
}

export interface PatternOption {
  id: string
  name: string
}

export interface CharacterOption {
  id: string
  name: string
}
