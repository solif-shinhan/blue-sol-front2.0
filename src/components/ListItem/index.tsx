import styles from './ListItem.module.css'

interface ListItemProps {
  avatar?: string
  icon?: string
  children: React.ReactNode
  time?: string
  unread?: boolean
  showUnreadDot?: boolean
  onClick?: () => void
  variant?: 'card' | 'list'
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
