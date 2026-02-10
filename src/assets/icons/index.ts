// Category Icons - Figma Icon Application (1281:3798)
// 카테고리 칩에 사용되는 아이콘

// 취미/여가
import iconFood from './icon-food.png';
import iconLanguage from './icon-language.png';
import iconMovie from './icon-movie.png';
import iconGame from './icon-game.png';
import iconPhoto from './icon-photo.png';

// 활동
import iconVolunteer from './icon-volunteer.png';
import iconTravel from './icon-travel.png';

// 스포츠
import iconSoccer from './icon-soccer.png';
import iconBasketball from './icon-basketball.png';
import iconBaseball from './icon-baseball.png';

// 자기계발
import iconCertificate from './icon-certificate.png';
import iconArt from './icon-art.png';
import iconWalk from './icon-walk.png';
import iconCulture from './icon-culture.png';
import iconReading from './icon-reading.png';
import iconStudy from './icon-study.png';
import iconEconomy from './icon-economy.png';

// Export individual icons
export {
  iconFood,
  iconLanguage,
  iconMovie,
  iconGame,
  iconPhoto,
  iconVolunteer,
  iconTravel,
  iconSoccer,
  iconBasketball,
  iconBaseball,
  iconCertificate,
  iconArt,
  iconWalk,
  iconCulture,
  iconReading,
  iconStudy,
  iconEconomy,
};

// 카테고리 타입 정의
export type CategoryType =
  | 'food'
  | 'language'
  | 'movie'
  | 'game'
  | 'photo'
  | 'volunteer'
  | 'travel'
  | 'soccer'
  | 'basketball'
  | 'baseball'
  | 'certificate'
  | 'art'
  | 'walk'
  | 'culture'
  | 'reading'
  | 'study'
  | 'economy';

// 카테고리 아이콘 매핑
export const categoryIcons: Record<CategoryType, string> = {
  food: iconFood,
  language: iconLanguage,
  movie: iconMovie,
  game: iconGame,
  photo: iconPhoto,
  volunteer: iconVolunteer,
  travel: iconTravel,
  soccer: iconSoccer,
  basketball: iconBasketball,
  baseball: iconBaseball,
  certificate: iconCertificate,
  art: iconArt,
  walk: iconWalk,
  culture: iconCulture,
  reading: iconReading,
  study: iconStudy,
  economy: iconEconomy,
};

// 카테고리 라벨 (한글)
export const categoryLabels: Record<CategoryType, string> = {
  food: '맛집',
  language: '언어공부',
  movie: '영화',
  game: '게임',
  photo: '사진',
  volunteer: '봉사활동',
  travel: '여행',
  soccer: '축구',
  basketball: '농구',
  baseball: '야구',
  certificate: '자격증',
  art: '예술',
  walk: '산책',
  culture: '문화생활',
  reading: '독서',
  study: '스터디',
  economy: '경제',
};

// 한글 라벨 → 영문 키 역매핑 (백엔드에서 한글로 받을 때 사용)
export const labelToCategoryKey: Record<string, CategoryType> = {
  '맛집': 'food',
  '언어공부': 'language',
  '영화': 'movie',
  '게임': 'game',
  '사진': 'photo',
  '봉사활동': 'volunteer',
  '여행': 'travel',
  '축구': 'soccer',
  '농구': 'basketball',
  '야구': 'baseball',
  '자격증': 'certificate',
  '예술': 'art',
  '산책': 'walk',
  '문화생활': 'culture',
  '독서': 'reading',
  '스터디': 'study',
  '경제': 'economy',
};

// 한글 라벨로 아이콘 가져오기 헬퍼 함수
export const getIconByLabel = (label: string): string | undefined => {
  const key = labelToCategoryKey[label];
  return key ? categoryIcons[key] : undefined;
};

// 카테고리 아이콘 크기 (Figma 기준)
export const categoryIconSizes: Record<CategoryType, { width: number; height: number }> = {
  food: { width: 30, height: 30 },
  language: { width: 30, height: 30 },
  movie: { width: 30, height: 30 },
  game: { width: 30, height: 30 },
  photo: { width: 30, height: 30 },
  volunteer: { width: 30, height: 30 },
  travel: { width: 16, height: 27 },
  soccer: { width: 22, height: 22 },
  basketball: { width: 22, height: 22 },
  baseball: { width: 24, height: 23 },
  certificate: { width: 30, height: 30 },
  art: { width: 45, height: 45 },
  walk: { width: 33, height: 33 },
  culture: { width: 20, height: 28 },
  reading: { width: 30, height: 30 },
  study: { width: 34, height: 38 },
  economy: { width: 30, height: 30 },
};

// 모든 카테고리 목록
export const allCategories: CategoryType[] = [
  'food',
  'language',
  'movie',
  'game',
  'photo',
  'volunteer',
  'travel',
  'soccer',
  'basketball',
  'baseball',
  'certificate',
  'art',
  'walk',
  'culture',
  'reading',
  'study',
  'economy',
];
