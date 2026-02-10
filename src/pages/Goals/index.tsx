import { useState, useEffect } from 'react'
import styles from './Goals.module.css'
import { BackHeader } from '@/components/BackHeader'
import { goalApi } from '@/api'
import { getProfile, updateProfile } from '@/services/profileService'

type Mode = 'view' | 'edit'

interface Goal {
  id: number
  text: string
  completed: boolean
}

const EmptyCircle = () => (
  <svg className={styles.goalIcon} width="22" height="22" viewBox="0 0 22 22" fill="none">
    <circle cx="11" cy="11" r="10.5" stroke="#E6E6E6" strokeWidth="1" />
  </svg>
)

const FilledCircle = () => (
  <svg className={styles.goalIcon} width="22" height="22" viewBox="0 0 22 22" fill="none">
    <circle cx="11" cy="11" r="11" fill="#074ED8" />
  </svg>
)

const DismissCircle = ({ onClick }: { onClick: (e: React.MouseEvent) => void }) => (
  <button className={styles.dismissButton} onClick={onClick}>
    <svg width="22" height="22" viewBox="0 0 22 22" fill="none">
      <circle cx="11" cy="11" r="10.5" stroke="#C8C8C8" strokeWidth="1" />
      <path d="M7.5 7.5L14.5 14.5M14.5 7.5L7.5 14.5" stroke="#C8C8C8" strokeWidth="1.5" strokeLinecap="round" />
    </svg>
  </button>
)

function GoalsPage() {
  const [mode, setMode] = useState<Mode>('view')
  const [newGoalText, setNewGoalText] = useState('')
  const [goals, setGoals] = useState<Goal[]>([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const loadGoals = async () => {
      try {
        const [profileRes, goalFirstRes] = await Promise.all([
          getProfile().catch(() => null),
          goalApi.getFirst().catch(() => null),
        ])

        const currentIndex = goalFirstRes?.success ? (goalFirstRes.data?.currentIndex ?? 0) : 0

        if (profileRes?.success && profileRes.data?.mainGoals?.length > 0) {
          const apiGoals = profileRes.data.mainGoals.map((text: string, index: number) => ({
            id: index + 1,
            text,
            completed: index < currentIndex,
          }))
          setGoals(apiGoals)
        } else {
          setGoals([])
        }
      } catch (err) {
        console.error('목표 로드 실패:', err)
        setGoals([])
      } finally {
        setIsLoading(false)
      }
    }

    loadGoals()
  }, [])

  const saveGoals = async (updatedGoals: Goal[]) => {
    setGoals(updatedGoals)
    const goalTexts = updatedGoals.map(g => g.text)
    try {
      await updateProfile({ mainGoals: goalTexts })
    } catch (err) {
      console.error('목표 저장 실패:', err)
    }
  }

  const toggleComplete = (id: number) => {
    if (mode !== 'view') return
    const updatedGoals = goals.map(g =>
      g.id === id ? { ...g, completed: !g.completed } : g
    )
    saveGoals(updatedGoals)
  }

  const deleteGoal = (id: number) => {
    if (goals.length <= 1) return
    const updatedGoals = goals.filter(g => g.id !== id)
    saveGoals(updatedGoals)
  }

  const addGoal = () => {
    if (!newGoalText.trim()) return
    const newGoal: Goal = {
      id: Math.max(...goals.map(g => g.id), 0) + 1,
      text: newGoalText.trim(),
      completed: false,
    }
    const updatedGoals = [newGoal, ...goals]
    saveGoals(updatedGoals)
    setNewGoalText('')
  }

  const handleEditClick = () => {
    if (mode === 'view') {
      setMode('edit')
    } else {
      if (newGoalText.trim()) addGoal()
      setMode('view')
    }
  }

  const handleSave = () => {
    if (newGoalText.trim()) addGoal()
    setMode('view')
  }

  const handleInputKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && newGoalText.trim()) {
      addGoal()
    }
  }

  const incompleteGoals = goals.filter(g => !g.completed)
  const completedGoals = goals.filter(g => g.completed)
  const showDivider = incompleteGoals.length > 0 && completedGoals.length > 0

  if (isLoading) {
    return (
      <div className={styles.container}>
        <BackHeader title="나의 목표" />
        <div className={styles.loading}>로딩 중...</div>
      </div>
    )
  }

  return (
    <div className={styles.container}>
      <BackHeader title="나의 목표" />

      <div className={styles.heroSection}>
        <h1 className={styles.heroTitle}>
          올해 이루고 싶은<br />목표를 알려주세요
        </h1>
        <p className={styles.heroSubtitle}>
          목표를 한 문장으로 간결하게 작성해주세요.
        </p>
      </div>

      <div className={styles.goalsSection}>
        <div className={styles.goalsSectionHeader}>
          <h2 className={styles.goalsSectionTitle}>나의 목표</h2>
          <button className={styles.editButton} onClick={handleEditClick}>
            {mode === 'view' ? '편집' : '목표 추가'}
          </button>
        </div>

        <div className={styles.goalList}>
          {mode === 'edit' && (
            <div className={styles.addGoalCard}>
              <EmptyCircle />
              <input
                type="text"
                className={styles.addGoalInput}
                placeholder="새로운 목표를 입력해주세요"
                value={newGoalText}
                onChange={(e) => setNewGoalText(e.target.value)}
                onKeyDown={handleInputKeyDown}
                autoFocus
              />
            </div>
          )}

          {incompleteGoals.map(goal => (
            <div
              key={goal.id}
              className={styles.goalCard}
              onClick={() => mode === 'view' && toggleComplete(goal.id)}
            >
              {mode === 'view' ? (
                <EmptyCircle />
              ) : (
                <DismissCircle onClick={(e) => { e.stopPropagation(); deleteGoal(goal.id) }} />
              )}
              <p className={styles.goalCardText}>{goal.text}</p>
            </div>
          ))}

          {showDivider && (
            <div className={styles.divider}>
              <div className={styles.dividerLine} />
            </div>
          )}

          {completedGoals.map(goal => (
            <div
              key={goal.id}
              className={`${styles.goalCard} ${styles.goalCardCompleted}`}
              onClick={() => mode === 'view' && toggleComplete(goal.id)}
            >
              {mode === 'view' ? (
                <FilledCircle />
              ) : (
                <DismissCircle onClick={(e) => { e.stopPropagation(); deleteGoal(goal.id) }} />
              )}
              <p className={styles.goalCardText}>{goal.text}</p>
            </div>
          ))}
        </div>
      </div>

      {mode === 'edit' && (
        <div className={styles.saveButtonContainer}>
          <button className={styles.saveButton} onClick={handleSave}>
            완료
          </button>
        </div>
      )}
    </div>
  )
}

export default GoalsPage
