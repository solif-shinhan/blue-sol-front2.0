import avatar1 from '@/assets/images/exchange-write/exchange-wirte-review/34d0cfd7134cc05f15dd1efb5183b8bba793f850.png'
import avatar2 from '@/assets/images/exchange-write/exchange-wirte-review/6274fd76ac528e10ab53c6a60ec2b7781a4bf077.png'
import avatar3 from '@/assets/images/exchange-write/exchange-wirte-review/4bf002daa7ad9b2fb6987fa94a968c96d5e411a4.png'
import avatar4 from '@/assets/images/exchange-write/exchange-wirte-review/3a123e475703b8af890f035081d17d46b0044ab8.png'
import avatar5 from '@/assets/images/exchange-write/exchange-wirte-review/4f312a8b6806350bc51a53e37425ab024d322097.png'
import avatar6 from '@/assets/images/exchange-write/exchange-wirte-review/a32743961912e3f72471dab1912efd76555d7042.png'

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

export const INITIAL_PARTICIPANTS: Participant[] = [
  { id: 1, name: '나', avatar: avatar1, isMe: true },
  { id: 2, name: '강건우', avatar: avatar2 },
  { id: 3, name: '김예나', avatar: avatar3 },
  { id: 4, name: '김한별', avatar: avatar4 },
  { id: 5, name: '도정윤', avatar: avatar5 },
  { id: 6, name: '문유휘', avatar: avatar6 },
]

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
