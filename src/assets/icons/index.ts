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
