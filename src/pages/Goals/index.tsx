import { useState, useMemo } from 'react'
import { useNavigate } from 'react-router-dom'
import styles from './Goals.module.css'

type Mode = 'view' | 'complete' | 'delete' | 'add'

interface Goal {
  id: number
  text: string
  completed: boolean
}

function GoalsPage() {
  const navigate = useNavigate()
  const [mode, setMode] = useState<Mode>('view')
  const [newGoalText, setNewGoalText] = useState('')

  // localStorage에서 목표 데이터 로드
  const [goals, setGoals] = useState<Goal[]>(() => {
    const savedGoals = localStorage.getItem('userGoals')
    const savedCompletedGoals = localStorage.getItem('completedGoals')
    const parsedGoals = savedGoals ? JSON.parse(savedGoals) : []
    const completedIds = savedCompletedGoals ? JSON.parse(savedCompletedGoals) : []

    if (parsedGoals.length === 0) {
      return [{ id: 1, text: '목표를 설정해주세요', completed: false }]
    }

    return parsedGoals.map((text: string, index: number) => ({
      id: index + 1,
      text,
      completed: completedIds.includes(index + 1)
    }))
  })

  const completedCount = useMemo(() => goals.filter(g => g.completed).length, [goals])
  const totalCount = goals.length
  const mainGoal = goals[0]?.text || '목표를 설정해주세요'

  // 목표 저장
  const saveGoals = (updatedGoals: Goal[]) => {
    const goalTexts = updatedGoals.map(g => g.text)
    const completedIds = updatedGoals.filter(g => g.completed).map(g => g.id)
    localStorage.setItem('userGoals', JSON.stringify(goalTexts))
    localStorage.setItem('completedGoals', JSON.stringify(completedIds))
    setGoals(updatedGoals)
  }

  // 목표 달성 토글
  const toggleComplete = (id: number) => {
    if (mode !== 'complete') return
    const updatedGoals = goals.map(g =>
      g.id === id ? { ...g, completed: !g.completed } : g
    )
    saveGoals(updatedGoals)
  }

  // 목표 삭제
  const deleteGoal = (id: number) => {
    if (goals.length <= 1) return
    const updatedGoals = goals.filter(g => g.id !== id)
    saveGoals(updatedGoals)
  }

  // 목표 추가
  const addGoal = () => {
    if (!newGoalText.trim()) return
    const newGoal: Goal = {
      id: Math.max(...goals.map(g => g.id)) + 1,
      text: newGoalText.trim(),
      completed: false
    }
    const updatedGoals = [newGoal, ...goals]
    saveGoals(updatedGoals)
    setNewGoalText('')
    setMode('view')
  }

  // 모드 변경
  const handleModeChange = (newMode: Mode) => {
    if (mode === newMode) {
      setMode('view')
    } else {
      setMode(newMode)
      setNewGoalText('')
    }
  }

  // 저장 버튼 클릭
  const handleSave = () => {
    if (mode === 'add' && newGoalText.trim()) {
      addGoal()
    }
    setMode('view')
  }

  // 뒤로가기
  const handleBack = () => {
    navigate(-1)
  }

  // 메인 목표 텍스트 분리 (줄바꿈용)
  const splitMainGoal = (text: string) => {
    const words = text.split(' ')
    if (words.length <= 3) return { line1: text, line2: '' }
    const midPoint = Math.ceil(words.length / 2)
    return {
      line1: words.slice(0, midPoint).join(' '),
      line2: words.slice(midPoint).join(' ')
    }
  }

  const { line1, line2 } = splitMainGoal(mainGoal)

  return (
    <div className={styles.container}>
      {/* Status Bar */}
      <div className={styles.statusBar}>
        <div className={styles.notch} />
        <span className={styles.statusTime}>3:14</span>
      </div>

      {/* Header Navigation */}
      <div className={styles.headerNav}>
        <button className={styles.backButton} onClick={handleBack}>
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
            <path d="M15 18L9 12L15 6" stroke="#222222" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        </button>
        <div className={styles.tabIndicators}>
          <div className={styles.tabDot} />
          <div className={styles.tabDot} />
          <div className={styles.tabDot} />
          <div className={styles.tabDot} />
        </div>
      </div>

      {/* Hero Section */}
      <div className={styles.heroSection}>
        <div className={styles.heroText}>
          <div className={styles.heroSubtitle}>
            <span className={styles.solifText}>
              <span className="sol">SOL</span>
              <span className="if">IF</span>
              , 너의 꿈을 응원해
            </span>
          </div>
          <h1 className={styles.heroTitle}>
            {line1}
            {line2 && <><br />{line2}</>}
          </h1>
        </div>

        <div className={styles.goalBadge}>
          <span className={styles.goalLabel}>나의 목표</span>
          <div className={styles.goalCount}>
            <span className={styles.goalCurrent}>{String(completedCount).padStart(2, '0')}</span>
            <span className={styles.goalDivider}>/</span>
            <span className={styles.goalTotal}>{String(totalCount).padStart(2, '0')}</span>
          </div>
        </div>
      </div>

      {/* Goals Section */}
      <div className={styles.goalsSection}>
        <div className={styles.goalsSectionHeader}>
          <h2 className={styles.goalsSectionTitle}>나의 목표</h2>
          <div className={styles.goalActions}>
            <button
              className={styles.goalActionButton}
              onClick={() => handleModeChange('complete')}
              style={{ color: mode === 'complete' ? '#074ed8' : '#848484' }}
            >
              달성
            </button>
            <div className={styles.goalActionDivider} />
            <button
              className={styles.goalActionButton}
              onClick={() => handleModeChange('delete')}
              style={{ color: mode === 'delete' ? '#074ed8' : '#848484' }}
            >
              삭제
            </button>
            <div className={styles.goalActionDivider} />
            <button
              className={styles.goalActionButton}
              onClick={() => handleModeChange('add')}
              style={{ color: mode === 'add' ? '#074ed8' : '#848484' }}
            >
              추가
            </button>
          </div>
        </div>

        <div className={styles.goalList}>
          {/* 추가 모드일 때 입력 필드 표시 */}
          {mode === 'add' && (
            <div className={styles.addGoalCard}>
              <input
                type="text"
                className={styles.addGoalInput}
                placeholder="새로운 목표를 입력해주세요"
                value={newGoalText}
                onChange={(e) => setNewGoalText(e.target.value)}
                autoFocus
              />
            </div>
          )}

          {/* 목표 카드들 */}
          {goals.map((goal, index) => (
            <div
              key={goal.id}
              className={`${styles.goalCard} ${goal.completed ? styles.completed : ''} ${mode === 'delete' ? styles.deleteMode : ''}`}
              onClick={() => mode === 'complete' && toggleComplete(goal.id)}
            >
              {mode === 'delete' ? (
                <div className={styles.goalCardContent}>
                  <p className={styles.goalCardText}>{goal.text}</p>
                  {index < goals.length - 1 && (
                    <button
                      className={styles.deleteButton}
                      onClick={(e) => {
                        e.stopPropagation()
                        deleteGoal(goal.id)
                      }}
                    >
                      <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                        <circle cx="12" cy="12" r="10" fill="#E6E6E6"/>
                        <path d="M8 8L16 16M16 8L8 16" stroke="#848484" strokeWidth="2" strokeLinecap="round"/>
                      </svg>
                    </button>
                  )}
                </div>
              ) : (
                <p className={styles.goalCardText}>{goal.text}</p>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* 저장 버튼 (add, complete, delete 모드일 때 표시) */}
      {mode !== 'view' && (
        <div className={styles.saveButtonContainer}>
          <button
            className={styles.saveButton}
            onClick={handleSave}
            disabled={mode === 'add' && !newGoalText.trim()}
          >
            {mode === 'add' ? '추가하기' : '완료'}
          </button>
        </div>
      )}
    </div>
  )
}

export default GoalsPage
