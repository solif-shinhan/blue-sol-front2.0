// 새로운 소식 데이터
export const NEWS_ITEMS = [
  {
    id: 1,
    title: '따뜻한 활동 후기가 도착했어요',
    subtitle: '릴레이로 후기를 작성해볼까요?'
  },
  {
    id: 2,
    title: '신한님을 찾는 멘티가 있어요',
    subtitle: '지금 쪽지함을 확인해보세요'
  },
  {
    id: 3,
    title: '학업 모니터링지 제출 안내',
    subtitle: '장학재단 운영 공지사항'
  }
]

// 자치회 활동 데이터
export const COUNCIL_ITEMS = [
  {
    id: 1,
    type: 'budget' as const,
    label: '이번 달 자치회 예산이',
    amount: '110,840원',
    suffix: '남았어요',
    progress: 65
  },
  {
    id: 2,
    type: 'activity' as const,
    label: '제주 최강 신한이들',
    title: '솔잎이들과 8개 활동을 함께 했어요',
    profiles: ['blue', 'lightBlue', 'blue', 'lightBlue', 'gray', 'gray', 'gray', 'gray']
  },
  {
    id: 3,
    type: 'review' as const,
    label: '제주 최강 신한이들',
    title: '활동 후기 릴레이 작성하기',
    description: '나에게서 너에게로, 마음 릴레이를 시작해보세요'
  }
]

// Types
export interface NewsItem {
  id: number
  title: string
  subtitle: string
}

export interface CouncilBudgetItem {
  id: number
  type: 'budget'
  label: string
  amount: string
  suffix: string
  progress: number
}

export interface CouncilActivityItem {
  id: number
  type: 'activity'
  label: string
  title: string
  profiles: string[]
}

export interface CouncilReviewItem {
  id: number
  type: 'review'
  label: string
  title: string
  description: string
}

export type CouncilItem = CouncilBudgetItem | CouncilActivityItem | CouncilReviewItem

// 강의 데이터
export const LECTURE_ITEMS = [
  {
    id: 1,
    category: '사회',
    title: '어떤 삶을 살고 싶나요?\n나를 아십니까?',
    speaker: '포어시스 원종화 대표님'
  },
  {
    id: 2,
    category: '사회',
    title: '"실패와 시행착오는\n다른 것이다"',
    speaker: '조은빛 강사님'
  },
  {
    id: 3,
    category: '사회',
    title: 'AI가 못하는 "우리"만이 할 수 있는 것',
    speaker: '최재붕 교수님'
  },
  {
    id: 4,
    category: '사회',
    title: '"돈을 잠을 자지 않는다"\n글로벌 금융 이슈 점검',
    speaker: '오건영 단장님'
  }
]

// 빠른 메뉴 데이터
export const QUICK_MENU_ITEMS = [
  { id: 1, label: '쪽지함' },
  { id: 2, label: '게시판' },
  { id: 3, label: '교류망' },
  { id: 4, label: '자치회' },
  { id: 5, label: '멘토링' }
]
