import styles from './MenuGrid.module.css'

interface MenuItemData {
  /** 고유 ID */
  id: string
  /** 아이콘 (이모지 또는 컴포넌트) */
  icon: React.ReactNode
  /** 제목 */
  title: string
  /** 설명 */
  description?: string
  /** 클릭 핸들러 */
  onClick?: () => void
  /** 배지 텍스트 */
  badge?: string
  /** 배지 타입 */
  badgeType?: 'required' | 'optional'
  /** 상태 텍스트 */
  status?: string
}

interface MenuGridProps {
  /** 메뉴 아이템 목록 */
  items: MenuItemData[]
  /** 열 개수 */
  columns?: 2 | 3 | 4
  /** 추가 클래스명 */
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

/** 단일 메뉴 아이템 컴포넌트 (개별 사용용) */
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
