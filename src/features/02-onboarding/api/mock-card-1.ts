import { Interest } from '../types/card-1';
import { CategoryType } from '../../../assets/icons';

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
  { id: 'int-10', name: '스터디', icon: iconStudy },
  { id: 'int-11', name: '게임', icon: iconGame },
  { id: 'int-12', name: '예술', icon: iconArt },
  { id: 'int-13', name: '사진', icon: iconPhoto },
  { id: 'int-14', name: '문화생활', icon: iconCulture },
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
