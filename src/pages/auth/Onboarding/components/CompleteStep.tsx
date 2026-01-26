import styles from '../styles'

export function CompleteStep() {
  return (
    <div className={styles.stepContainer}>
      <div className={styles.stepHeader}>
        <h1 className={styles.stepTitle}>나만의 SOLID 완성!</h1>
        <p className={styles.stepSubtitle}>세상에 하나뿐인 나만의 SOLID가 발급됐어요.</p>
      </div>

      <div className={styles.solidCardPreview}>
        <div className={styles.solidCard} />
      </div>
    </div>
  )
}
