export interface ImageItem {
  id: string
  url: string
}

export interface Participant {
  id: number
  name: string
  avatar: string
  isMe?: boolean
}

export const STEP_TITLES = [
  '기본 내용을 입력해주세요',
  '함께한 사람을 추가해주세요',
  '공유할 후기를 적어주세요',
]

export const WEEKDAYS = ['일', '월', '화', '수', '목', '금', '토']

export function getDaysInMonth(year: number, month: number) {
  return new Date(year, month + 1, 0).getDate()
}

export function getFirstDayOfMonth(year: number, month: number) {
  return new Date(year, month, 1).getDay()
}
