export interface FriendData {
  id: number
  name: string
  badge?: string
  tag?: string
  goals?: string[]
  interests?: { icon: string; label: string }[]
}

export const FRIENDS_DATA: FriendData[] = [
  {
    id: 1,
    name: '강건우',
    badge: '솔방울',
    tag: '체육교사꿈나무',
    goals: ['한체대 27학번으로 입학하기', '체육대회 우승하기', '가족 여행 가기'],
    interests: [
      { icon: '🏀', label: '농구' },
      { icon: '🤝', label: '봉사활동' },
    ],
  },
  {
    id: 2,
    name: '권유현',
    badge: '솔방울',
    tag: '공학도의 꿈',
    goals: ['서울대 공대 진학', '논문 발표하기', '해외 여행'],
    interests: [
      { icon: '💻', label: '코딩' },
      { icon: '📚', label: '독서' },
    ],
  },
  {
    id: 3,
    name: '김예나',
    badge: '솔방울',
    tag: '예술가 지망생',
    goals: ['미술 전시회 열기', '해외 유학 가기', '작품 판매하기'],
    interests: [
      { icon: '🎨', label: '미술' },
      { icon: '🎵', label: '음악' },
    ],
  },
  {
    id: 4,
    name: '김한별',
    badge: '솔방울',
    tag: '스포츠 마니아',
    goals: ['프로 선수 되기', '전국 대회 우승', '체력 단련'],
    interests: [
      { icon: '⚽', label: '축구' },
      { icon: '🏃', label: '운동' },
    ],
  },
  {
    id: 5,
    name: '도정윤',
    badge: '솔방울',
    tag: '문학 소녀',
    goals: ['소설 출판하기', '문학상 수상', '작가 되기'],
    interests: [
      { icon: '📖', label: '독서' },
      { icon: '✍️', label: '글쓰기' },
    ],
  },
  {
    id: 6,
    name: '문유휘',
    badge: '솔방울',
    tag: '음악인의 길',
    goals: ['콘서트 열기', '앨범 발매', '작곡가 되기'],
    interests: [
      { icon: '🎸', label: '기타' },
      { icon: '🎤', label: '노래' },
    ],
  },
  {
    id: 7,
    name: '박진솔',
    badge: '솔방울',
    tag: '과학자의 꿈',
    goals: ['연구원 되기', '논문 게재', '노벨상 도전'],
    interests: [
      { icon: '🔬', label: '과학' },
      { icon: '🧪', label: '실험' },
    ],
  },
  {
    id: 8,
    name: '송지호',
    badge: '솔방울',
    tag: '봉사의 아이콘',
    goals: ['NGO 설립', '해외 봉사', '사회 공헌'],
    interests: [
      { icon: '🤝', label: '봉사' },
      { icon: '🌍', label: '여행' },
    ],
  },
]

export const FRIENDS_SIMPLE = FRIENDS_DATA.slice(0, 6).map(f => ({
  id: f.id,
  name: f.name,
}))

export const INTEREST_USERS = [
  { id: 1, name: '강건우' },
  { id: 2, name: '권유현' },
  { id: 3, name: '김예나' },
  { id: 4, name: '김한별' },
  { id: 5, name: '도정윤' },
  { id: 6, name: '황수민' },
]
