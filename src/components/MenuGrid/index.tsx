import styles from './MenuGrid.module.css'

interface MenuItemData {
  id: string
  icon: React.ReactNode
  title: string
  description?: string
  onClick?: () => void
  badge?: string
  badgeType?: 'required' | 'optional'
  status?: string
}

interface MenuGridProps {
  items: MenuItemData[]
  columns?: 2 | 3 | 4
  className?: string
}

export function MenuGrid({
  items,
  columns = 2,
  className = '',
}: MenuGridProps) {
  return (
    <div
      className={`${styles.grid} ${className}`}
      style={{ gridTemplateColumns: `repeat(${columns}, 1fr)` }}
    >
      {items.map((item) => (
        <button
          key={item.id}
          className={styles.item}
          onClick={item.onClick}
        >
          <div className={styles.icon}>{item.icon}</div>

          <div className={styles.content}>
            {item.badge && (
              <span
                className={`${styles.badge} ${item.badgeType === 'optional' ? styles.badgeOptional : ''}`}
              >
                {item.badge}
              </span>
            )}
            <span className={styles.title}>{item.title}</span>
            {item.description && (
              <span className={styles.description}>{item.description}</span>
            )}
            {item.status && (
              <span className={styles.status}>{item.status}</span>
            )}
          </div>
        </button>
      ))}
    </div>
  )
}

export function MenuItem({
  icon,
  title,
  description,
  onClick,
  badge,
  badgeType,
  status,
  className = '',
}: Omit<MenuItemData, 'id'> & { className?: string }) {
  return (
    <button className={`${styles.item} ${className}`} onClick={onClick}>
      <div className={styles.icon}>{icon}</div>

      <div className={styles.content}>
        {badge && (
          <span
            className={`${styles.badge} ${badgeType === 'optional' ? styles.badgeOptional : ''}`}
          >
            {badge}
          </span>
        )}
        <span className={styles.title}>{title}</span>
        {description && <span className={styles.description}>{description}</span>}
        {status && <span className={styles.status}>{status}</span>}
      </div>
    </button>
  )
}

export default MenuGrid
