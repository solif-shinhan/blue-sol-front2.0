import { Character, BackgroundColor, Interest } from '../types/card-1';
import { CategoryType } from '../../../assets/icons';

import characterBear from '../../../assets/images/character-bear.png';
import characterOwl from '../../../assets/images/character-owl.png';
import characterCat from '../../../assets/images/character-cat.png';
import characterDrop from '../../../assets/images/character-drop.png';

import iconFood from '../../../assets/icons/icon-food.png';
import iconLanguage from '../../../assets/icons/icon-language.png';
import iconMovie from '../../../assets/icons/icon-movie.png';
import iconTravel from '../../../assets/icons/icon-travel.png';
import iconBasketball from '../../../assets/icons/icon-basketball.png';
import iconSoccer from '../../../assets/icons/icon-soccer.png';
import iconBaseball from '../../../assets/icons/icon-baseball.png';
import iconVolunteer from '../../../assets/icons/icon-volunteer.png';
import iconReading from '../../../assets/icons/icon-reading.png';
import iconStudy from '../../../assets/icons/icon-study.png';
import iconGame from '../../../assets/icons/icon-game.png';
import iconArt from '../../../assets/icons/icon-art.png';
import iconPhoto from '../../../assets/icons/icon-photo.png';
import iconCulture from '../../../assets/icons/icon-culture.png';
import iconEconomy from '../../../assets/icons/icon-economy.png';
import iconCertificate from '../../../assets/icons/icon-certificate.png';
import iconWalk from '../../../assets/icons/icon-walk.png';

export const mockCharacters: Character[] = [
  { id: 'char-01', name: '곰돌이', imageUrl: characterBear },
  { id: 'char-02', name: '부엉이', imageUrl: characterOwl },
  { id: 'char-03', name: '고양이', imageUrl: characterCat },
  { id: 'char-04', name: '물방울', imageUrl: characterDrop },
  { id: 'char-05', name: '곰돌이2', imageUrl: characterBear },
  { id: 'char-06', name: '부엉이2', imageUrl: characterOwl },
  { id: 'char-07', name: '고양이2', imageUrl: characterCat },
  { id: 'char-08', name: '물방울2', imageUrl: characterDrop },
  { id: 'char-09', name: '곰돌이3', imageUrl: characterBear },
  { id: 'char-10', name: '부엉이3', imageUrl: characterOwl },
  { id: 'char-11', name: '고양이3', imageUrl: characterCat },
  { id: 'char-12', name: '물방울3', imageUrl: characterDrop },
  { id: 'char-13', name: '곰돌이4', imageUrl: characterBear },
  { id: 'char-14', name: '부엉이4', imageUrl: characterOwl },
  { id: 'char-15', name: '고양이4', imageUrl: characterCat },
];

// 밝은 배경 (light): 파스텔톤 - 어두운 글씨
// 어두운 배경 (dark): 진한 색상 - 밝은 글씨
export const mockBackgroundColors: BackgroundColor[] = [
  // Light theme (밝은 배경)
  { id: 'bg-02', name: '민트핑크', gradientStart: 'rgba(194, 229, 237, 0.8)', gradientEnd: 'rgba(225, 189, 196, 0.8)', theme: 'light' },
  { id: 'bg-03', name: '블루살구', gradientStart: 'rgba(171, 200, 255, 0.8)', gradientEnd: 'rgba(255, 233, 226, 0.8)', theme: 'light' },
  { id: 'bg-04', name: '노랑핑크', gradientStart: 'rgba(231, 231, 185, 0.8)', gradientEnd: 'rgba(255, 226, 236, 0.8)', theme: 'light' },
  { id: 'bg-05', name: '연두민트', gradientStart: 'rgba(203, 232, 188, 0.8)', gradientEnd: 'rgba(174, 229, 242, 0.8)', theme: 'light' },
  { id: 'bg-07', name: '하늘연보라', gradientStart: 'rgba(171, 227, 255, 0.8)', gradientEnd: 'rgba(222, 223, 255, 0.8)', theme: 'light' },
  { id: 'bg-08', name: '연청회색', gradientStart: 'rgba(201, 219, 255, 0.8)', gradientEnd: 'rgba(210, 210, 210, 0.8)', theme: 'light' },
  { id: 'bg-09', name: '베이지하늘', gradientStart: 'rgba(221, 216, 203, 0.8)', gradientEnd: 'rgba(162, 197, 237, 0.8)', theme: 'light' },
  { id: 'bg-12', name: '보라핑크', gradientStart: 'rgba(184, 171, 255, 0.8)', gradientEnd: 'rgba(255, 226, 234, 0.8)', theme: 'light' },
  // Dark theme (어두운 배경)
  { id: 'bg-01', name: '핑크블루', gradientStart: 'rgba(255, 64, 102, 0.8)', gradientEnd: 'rgba(148, 191, 255, 0.8)', theme: 'dark' },
  { id: 'bg-06', name: '녹색민트', gradientStart: 'rgba(39, 92, 18, 0.8)', gradientEnd: 'rgba(174, 229, 242, 0.8)', theme: 'dark' },
  { id: 'bg-10', name: '파랑연보라', gradientStart: 'rgba(0, 70, 255, 0.8)', gradientEnd: 'rgba(222, 223, 255, 0.8)', theme: 'dark' },
  { id: 'bg-11', name: '남색회색', gradientStart: 'rgba(3, 28, 76, 0.8)', gradientEnd: 'rgba(192, 200, 210, 0.8)', theme: 'dark' },
  { id: 'bg-13', name: '자주핑크', gradientStart: 'rgba(114, 0, 179, 0.8)', gradientEnd: 'rgba(255, 215, 226, 0.8)', theme: 'dark' },
  { id: 'bg-14', name: '남색살구', gradientStart: 'rgba(0, 4, 110, 0.8)', gradientEnd: 'rgba(255, 197, 178, 0.8)', theme: 'dark' },
  { id: 'bg-15', name: '검정핑크', gradientStart: 'rgba(58, 58, 58, 0.8)', gradientEnd: 'rgba(255, 226, 234, 0.8)', theme: 'dark' },
  { id: 'bg-16', name: '올리브하늘', gradientStart: 'rgba(87, 78, 53, 0.8)', gradientEnd: 'rgba(162, 197, 237, 0.8)', theme: 'dark' },
];

export const mockInterests: Interest[] = [
  { id: 'int-01', name: '맛집', icon: iconFood },
  { id: 'int-02', name: '언어공부', icon: iconLanguage },
  { id: 'int-03', name: '영화', icon: iconMovie },
  { id: 'int-04', name: '여행', icon: iconTravel },
  { id: 'int-05', name: '농구', icon: iconBasketball },
  { id: 'int-06', name: '축구', icon: iconSoccer },
  { id: 'int-07', name: '야구', icon: iconBaseball },
  { id: 'int-08', name: '봉사활동', icon: iconVolunteer },
  { id: 'int-09', name: '독서', icon: iconReading },
  { id: 'int-10', name: '공부', icon: iconStudy },
  { id: 'int-11', name: '게임', icon: iconGame },
  { id: 'int-12', name: '미술', icon: iconArt },
  { id: 'int-13', name: '사진', icon: iconPhoto },
  { id: 'int-14', name: '문화', icon: iconCulture },
  { id: 'int-15', name: '경제', icon: iconEconomy },
  { id: 'int-16', name: '자격증', icon: iconCertificate },
  { id: 'int-17', name: '산책', icon: iconWalk },
];

export const categoryToInterestMap: Record<CategoryType, string> = {
  food: 'int-01',
  language: 'int-02',
  movie: 'int-03',
  travel: 'int-04',
  basketball: 'int-05',
  soccer: 'int-06',
  baseball: 'int-07',
  volunteer: 'int-08',
  reading: 'int-09',
  study: 'int-10',
  game: 'int-11',
  art: 'int-12',
  photo: 'int-13',
  culture: 'int-14',
  economy: 'int-15',
  certificate: 'int-16',
  walk: 'int-17',
};

export const getInterestById = (id: string): Interest | null => {
  return mockInterests.find((i) => i.id === id) || null;
};

export const getInterestsByIds = (ids: string[]): Interest[] => {
  return ids.map((id) => getInterestById(id)).filter((i): i is Interest => i !== null);
};

export const getInterestsByCategories = (categories: CategoryType[]): Interest[] => {
  return categories
    .map((cat) => categoryToInterestMap[cat])
    .map((id) => getInterestById(id))
    .filter((i): i is Interest => i !== null);
};

export const getCharacterById = (id: string): Character | null => {
  return mockCharacters.find((c) => c.id === id) || null;
};

export const getBackgroundColorById = (id: string): BackgroundColor | null => {
  return mockBackgroundColors.find((c) => c.id === id) || null;
};

export const mockCardApi = {
  getCharacters: (): Promise<Character[]> => Promise.resolve(mockCharacters),
  getBackgroundColors: (): Promise<BackgroundColor[]> => Promise.resolve(mockBackgroundColors),
  createCard: (_data: { characterId: string; colorId: string }): Promise<{ success: boolean }> =>
    Promise.resolve({ success: true }),
};
