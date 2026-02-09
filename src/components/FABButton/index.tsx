import styles from './FABButton.module.css'

interface FABButtonProps {
  onClick: () => void
  icon?: string
  alt?: string
}

export function FABButton({
  onClick,
  icon = '/jam_write.svg',
  alt = '글쓰기',
}: FABButtonProps) {
  return (
    <button className={styles.fab} onClick={onClick}>
      <img src={icon} alt={alt} className={styles.fabIcon} />
    </button>
  )
}
