export type TabName = 'home' | 'exchange' | 'growth' | 'notifications' | 'mypage'

export interface TabItem {
  name: TabName
  path: string
  label: string
  icon: string
  activeIcon: string
}

export const TAB_ITEMS: TabItem[] = [
  {
    name: 'home',
    path: '/home',
    label: '홈',
    icon: 'home',
    activeIcon: 'home-filled',
  },
  {
    name: 'exchange',
    path: '/exchange',
    label: '교류',
    icon: 'people',
    activeIcon: 'people-filled',
  },
  {
    name: 'growth',
    path: '/growth',
    label: '성장',
    icon: 'tree',
    activeIcon: 'tree-filled',
  },
  {
    name: 'notifications',
    path: '/notifications',
    label: '알림',
    icon: 'bell',
    activeIcon: 'bell-filled',
  },
  {
    name: 'mypage',
    path: '/mypage',
    label: '마이',
    icon: 'person',
    activeIcon: 'person-filled',
  },
]

export interface SolidParams {
  userId?: string
}

export interface PostParams {
  postId: string
}

export interface MentorParams {
  mentorId: string
}

export interface ProgramParams {
  programId: string
}
