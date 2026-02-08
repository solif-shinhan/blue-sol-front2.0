import styles1 from './WriteReview-1.module.css'
import styles2 from './WriteReview-2.module.css'
import styles2b from './WriteReview-2b.module.css'
import { WEEKDAYS, getDaysInMonth, getFirstDayOfMonth } from './WriteReview.constants'

const styles = { ...styles1, ...styles2, ...styles2b }

interface CalendarModalProps {
  calendarYear: number
  calendarMonth: number
  dateValue: string
  onSelectDate: (day: number) => void
  onPrevMonth: () => void
  onNextMonth: () => void
  onClose: () => void
}

export function CalendarModal({
  calendarYear, calendarMonth, dateValue,
  onSelectDate, onPrevMonth, onNextMonth, onClose,
}: CalendarModalProps) {
  const daysInMonth = getDaysInMonth(calendarYear, calendarMonth)
  const firstDay = getFirstDayOfMonth(calendarYear, calendarMonth)
  const today = new Date()
  const todayStr = `${today.getFullYear()}.${String(today.getMonth() + 1).padStart(2, '0')}.${String(today.getDate()).padStart(2, '0')}`
  const days: (number | null)[] = []

  for (let i = 0; i < firstDay; i++) days.push(null)
  for (let d = 1; d <= daysInMonth; d++) days.push(d)

  return (
    <div className={styles.calendarOverlay} onClick={onClose}>
      <div className={styles.calendarModal} onClick={(e) => e.stopPropagation()}>
        <div className={styles.calendarHeader}>
          <button className={styles.calendarNavButton} onClick={onPrevMonth}>{'<'}</button>
          <span className={styles.calendarMonthTitle}>
            {calendarYear}년 {calendarMonth + 1}월
          </span>
          <button className={styles.calendarNavButton} onClick={onNextMonth}>{'>'}</button>
        </div>
        <div className={styles.calendarWeekdays}>
          {WEEKDAYS.map((w) => (
            <span key={w} className={styles.calendarWeekday}>{w}</span>
          ))}
        </div>
        <div className={styles.calendarDays}>
          {days.map((day, idx) => {
            if (day === null) {
              return <div key={`empty-${idx}`} className={`${styles.calendarDay} ${styles.calendarDayEmpty}`} />
            }
            const dateStr = `${calendarYear}.${String(calendarMonth + 1).padStart(2, '0')}.${String(day).padStart(2, '0')}`
            const isSelected = dateValue === dateStr
            const isToday = todayStr === dateStr
            return (
              <button
                key={day}
                className={`${styles.calendarDay} ${isSelected ? styles.calendarDaySelected : ''} ${isToday && !isSelected ? styles.calendarDayToday : ''}`}
                onClick={() => onSelectDate(day)}
              >
                {day}
              </button>
            )
          })}
        </div>
      </div>
    </div>
  )
}
