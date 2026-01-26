import styles from './ListItem.module.css'

interface ListItemProps {
  /** 아바타 텍스트 (이름 첫 글자 등) */
  avatar?: string
  /** 아바타 대신 아이콘/이모지 사용 */
  icon?: string
  /** 메인 텍스트 (HTML 지원) */
  children: React.ReactNode
  /** 시간 텍스트 */
  time?: string
  /** 읽지 않음 상태 */
  unread?: boolean
  /** 읽지 않음 표시 점 보이기 */
  showUnreadDot?: boolean
  /** 클릭 핸들러 */
  onClick?: () => void
  /** 스타일 변형 */
  variant?: 'card' | 'list'
  /** 추가 클래스명 */
  className?: string
}

export function ListItem({
  avatar,
  icon,
  children,
  time,
  unread = false,
  showUnreadDot = false,
  onClick,
  variant = 'card',
  className = '',
}: ListItemProps) {
  const Component = onClick ? 'button' : 'div'

  return (
    <Component
      className={`${styles.item} ${styles[variant]} ${unread ? styles.unread : ''} ${className}`}
      onClick={onClick}
      data-unread={unread}
    >
      {avatar && (
        <div className={styles.avatar}>
          {avatar}
        </div>
      )}
      {icon && !avatar && (
        <div className={styles.icon}>
          {icon}
        </div>
      )}

      <div className={styles.content}>
        <div className={styles.text}>{children}</div>
        {time && <span className={styles.time}>{time}</span>}
      </div>

      {showUnreadDot && unread && (
        <div className={styles.unreadDot} />
      )}
    </Component>
  )
}

export default ListItem
