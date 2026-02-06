// 뉴스 아이콘
import imgNews1 from '@/assets/images/bbdba2deec99e2a96b161b98577dda532cef5ac0.png'
import imgNews2 from '@/assets/images/7741fb9eacef36e07c7049afab51e81067899bfe.png'
import imgNews3 from '@/assets/images/22621ac94c204735466096a3dd8d655b668f3ebc.png'

// 퀵메뉴 아이콘
import imgMenuMessage from '@/assets/images/7741fb9eacef36e07c7049afab51e81067899bfe.png'
import imgMenuBoard from '@/assets/images/30e17e53bcb56d90770ae4da1b0f94ccdab2288f.png'
import imgMenuNetwork from '@/assets/images/a62597eaf9ed76d2cfcc60e1d7cd6b4915de6157.png'
import imgMenuCouncil from '@/assets/images/4634595aa88196d9db864f029540cef498b10494.png'
import imgMenuMentoring from '@/assets/images/c02af4f20d651145140cd669ce6147c1556590ba.png'

// 역량강화 카드 이미지
import imgLecture1 from '@/assets/images/4c6534fee9eb246a7cea6aed1a9a2d8639cfdad2.png'
import imgLecture2 from '@/assets/images/fabe58cbb60ee8f3d3b8e143872401a7fa60afa8.png'
import imgLecture3 from '@/assets/images/934e97687908b818ee69693b86fa45fd64e203b8.png'
import imgLecture4 from '@/assets/images/358d4b60e088c3256ccd8ae2882245092e4ee9a9.png'

export const NEWS_ITEMS = [
  {
    id: 1,
    title: '따뜻한 활동 후기가 도착했어요',
    subtitle: '릴레이로 후기를 작성해볼까요?',
    icon: imgNews1,
    iconWidth: 58,
    iconHeight: 43,
  },
  {
    id: 2,
    title: '신한님을 찾는 멘티가 있어요',
    subtitle: '지금 쪽지함을 확인해보세요',
    icon: imgNews2,
    iconWidth: 50,
    iconHeight: 54,
  },
  {
    id: 3,
    title: '학업 모니터링지 제출 안내',
    subtitle: '장학재단 운영 공지사항',
    icon: imgNews3,
    iconWidth: 50,
    iconHeight: 54,
  }
]

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

export interface NewsItem {
  id: number
  title: string
  subtitle: string
  icon?: string
  iconWidth?: number
  iconHeight?: number
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

export const LECTURE_ITEMS = [
  {
    id: 1,
    category: '취업',
    title: '어떤 삶을 살고 싶나요?\n나를 아십니까?',
    speaker: '포어시스 원종화 대표님',
    image: imgLecture1,
  },
  {
    id: 2,
    category: '인성',
    title: '실패와 시행착오는\n다른 것이다',
    speaker: '조은빛 강사님',
    image: imgLecture2,
  },
  {
    id: 3,
    category: '과학',
    title: "AI가 못하는 '우리'만이\n할 수 있는 것",
    speaker: '최재붕 교수님',
    image: imgLecture3,
  },
  {
    id: 4,
    category: '사회',
    title: '돈은 잠을 자지 않는다\n글로벌 금융 이슈 점검',
    speaker: '오건영 단장님',
    image: imgLecture4,
  }
]

export const QUICK_MENU_ITEMS = [
  { id: 1, label: '쪽지함', icon: imgMenuMessage },
  { id: 2, label: '게시판', icon: imgMenuBoard },
  { id: 3, label: '교류망', icon: imgMenuNetwork },
  { id: 4, label: '자치회', icon: imgMenuCouncil },
  { id: 5, label: '멘토링', icon: imgMenuMentoring }
]
