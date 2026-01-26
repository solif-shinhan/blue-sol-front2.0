import type { InterestOption, PatternOption, CharacterOption, OnboardingStep } from './types'

export const INTEREST_OPTIONS: InterestOption[] = [
  { id: 'volunteer', label: '봉사활동', icon: '🤝' },
  { id: 'travel', label: '여행', icon: '✈️' },
  { id: 'soccer', label: '축구', icon: '⚽' },
  { id: 'basketball', label: '농구', icon: '🏀' },
  { id: 'baseball', label: '야구', icon: '⚾' },
  { id: 'culture', label: '문화생활', icon: '🎭' },
  { id: 'reading', label: '독서', icon: '📚' },
  { id: 'music', label: '음악', icon: '🎵' },
  { id: 'cooking', label: '요리', icon: '🍳' },
  { id: 'fitness', label: '운동', icon: '💪' },
]

export const PATTERN_OPTIONS: PatternOption[] = [
  { id: 'pattern1', name: '패턴 1' },
  { id: 'pattern2', name: '패턴 2' },
  { id: 'pattern3', name: '패턴 3' },
  { id: 'pattern4', name: '패턴 4' },
  { id: 'pattern5', name: '패턴 5' },
]

export const CHARACTER_OPTIONS: CharacterOption[] = [
  { id: 'char1', name: '캐릭터 1' },
  { id: 'char2', name: '캐릭터 2' },
  { id: 'char3', name: '캐릭터 3' },
]

export const STEP_ORDER: OnboardingStep[] = ['interests', 'goals', 'sns', 'pattern']

export const INITIAL_ONBOARDING_DATA = {
  selectedInterests: [] as string[],
  goals: [''] as string[],
  snsId: '',
  socialLink: '',
  selectedPattern: 'pattern1',
  selectedCharacter: 'char1',
}
