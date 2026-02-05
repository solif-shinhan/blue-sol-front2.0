export interface Character {
  id: string;
  name: string;
  imageUrl: string;
}

export type CardTheme = 'light' | 'dark';

export interface BackgroundColor {
  id: string;
  name: string;
  imageUrl?: string;  // API 배경 이미지 URL
  gradientStart?: string;  // 레거시 지원
  gradientEnd?: string;    // 레거시 지원
  theme?: CardTheme;
}

export interface Interest {
  id: string;
  name: string;
  icon?: string;
}

export interface OnboardingData {
  interests: string[];
  nickname: string;
  goals: string[];
  characterId: string | null;
  colorId: string | null;
}

export interface SolidCardData {
  character: Character | null;
  backgroundColor: BackgroundColor | null;
  userName: string;
  nickname: string;
  interests: string[];
  goals: string[];
}
