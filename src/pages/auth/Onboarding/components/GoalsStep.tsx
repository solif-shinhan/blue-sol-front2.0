import styles from '../styles'

interface GoalsStepProps {
  goals: string[]
  onUpdateGoal: (index: number, value: string) => void
  onAddGoal: () => void
  onRemoveGoal: (index: number) => void
}

export function GoalsStep({ goals, onUpdateGoal, onAddGoal, onRemoveGoal }: GoalsStepProps) {
  const canAddMore = goals.length < 5

  return (
    <div className={styles.stepContainer}>
      <div className={styles.stepHeader}>
        <h1 className={styles.stepTitle}>
          올해 이루고 싶은
          <br />
          목표를 알려주세요
        </h1>
        <p className={styles.stepSubtitle}>목표를 한 문장으로 간결하게 작성해 주세요.</p>
      </div>

      <div className={styles.goalInputContainer}>
        {goals.map((goal, index) => (
          <div key={index} className={styles.goalInputWrapper}>
            <input
              type="text"
              className={styles.goalInput}
              placeholder="목표를 입력해주세요"
              value={goal}
              onChange={(e) => onUpdateGoal(index, e.target.value)}
            />
            {index !== 0 && goals.length > 1 && (
              <button
                className={styles.removeGoalButton}
                onClick={() => onRemoveGoal(index)}
                type="button"
                aria-label="삭제"
              >
                <img src="/dismisscircle.svg" alt="삭제" />
              </button>
            )}
          </div>
        ))}
        {canAddMore && (
          <button className={styles.addGoalButton} onClick={onAddGoal} type="button">
            <img src="/+.svg" alt="추가" className={styles.addIcon} />
          </button>
        )}
      </div>
    </div>
  )
}
