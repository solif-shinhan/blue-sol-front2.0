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

// 어두운 배경 패턴 (실제 S3 SVG 색상 분석 기반)
export const DARK_PATTERNS = new Set([
  'backgrounds/background_01.svg',
  'backgrounds/background_09.svg',
  'backgrounds/background_11.svg',
  'backgrounds/background_13.svg',
  'backgrounds/background_14.svg',
  'backgrounds/background_16.svg',
]);

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
