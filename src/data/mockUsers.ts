export interface MockUser {
  id: string
  name: string
  badge: string
  tag: string
  goals: string[]
  interests: string[]
}

export const MOCK_USERS: Record<string, MockUser> = {
  'user-001': {
    id: 'user-001',
    name: '강건우',
    badge: '솔방울',
    tag: '체육교사꿈나무',
    goals: ['건강한 몸 만들기', '교사 자격증 취득', '마라톤 완주'],
    interests: ['운동', '교육']
  },
  'user-002': {
    id: 'user-002',
    name: '권유현',
    badge: '새싹',
    tag: '디자이너',
    goals: ['UX 포트폴리오 완성', '디자인 공모전 수상', '해외 인턴십'],
    interests: ['디자인', '예술']
  },
  'user-003': {
    id: 'user-003',
    name: '김민수',
    badge: '솔방울',
    tag: '개발자지망생',
    goals: ['알고리즘 마스터', '오픈소스 기여', '스타트업 창업'],
    interests: ['개발', 'AI']
  },
  'user-004': {
    id: 'user-004',
    name: '이서연',
    badge: '어린나무',
    tag: '사회복지사',
    goals: ['사회복지사 1급', '봉사활동 100시간', 'NGO 인턴'],
    interests: ['봉사', '복지']
  },
  'user-005': {
    id: 'user-005',
    name: '박준혁',
    badge: '새싹',
    tag: '금융전문가',
    goals: ['CFA 취득', '투자 포트폴리오 구축', '금융권 취업'],
    interests: ['금융', '경제']
  },
  'judge-001': {
    id: 'judge-001',
    name: '심사위원A',
    badge: '푸른소나무',
    tag: '신한장학재단',
    goals: ['장학생 성장 지원', '멘토링 활성화', '교류 네트워크 확대'],
    interests: ['교육', '멘토링']
  },
  'judge-002': {
    id: 'judge-002',
    name: '심사위원B',
    badge: '푸른소나무',
    tag: '신한장학재단',
    goals: ['장학생 역량 강화', '진로 상담 지원', '커뮤니티 발전'],
    interests: ['상담', '네트워킹']
  }
}

export function getMockUserById(userId: string): MockUser | null {
  return MOCK_USERS[userId] || null
}

export function getAllMockUsers(): MockUser[] {
  return Object.values(MOCK_USERS)
}
