import { useState } from 'react'
import styles1 from './MyCouncilActivity-1.module.css'
import styles2 from './MyCouncilActivity-2.module.css'
const styles = { ...styles1, ...styles2 }

const INITIAL_RULES = [
  { id: 1, text: "공지 올라오면 '체크 이모티콘' 남겨주기" },
  { id: 2, text: '부득이한 불참은 최소 24시간 전에 알려주기' },
  { id: 3, text: '서로가 아는 찐맛집 데이터 공유하기' },
]

function ActivityRules() {
  const [rules, setRules] = useState(INITIAL_RULES)
  const [isAddingRule, setIsAddingRule] = useState(false)
  const [newRuleText, setNewRuleText] = useState('')
  const [isDeletingMode, setIsDeletingMode] = useState(false)
  const [selectedForDelete, setSelectedForDelete] = useState<number[]>([])

  const handleAddRule = () => {
    if (newRuleText.trim()) {
      setRules([{ id: Date.now(), text: newRuleText.trim() }, ...rules])
      setNewRuleText('')
      setIsAddingRule(false)
    }
  }

  const handleDeleteSelected = () => {
    if (selectedForDelete.length > 0) {
      setRules(rules.filter(rule => !selectedForDelete.includes(rule.id)))
      setSelectedForDelete([])
      setIsDeletingMode(false)
    }
  }

  const toggleDeleteSelection = (id: number) => {
    setSelectedForDelete(prev =>
      prev.includes(id) ? prev.filter(x => x !== id) : [...prev, id]
    )
  }

  return (
    <div className={styles.rulesSection}>
      <div className={styles.rulesSectionHeader}>
        <h2 className={styles.rulesSectionTitle}>자치회 활동 규칙</h2>
        <div className={styles.rulesSectionActions}>
          <button
            className={styles.ruleActionButton}
            onClick={() => {
              if (isDeletingMode) {
                setIsDeletingMode(false)
                setSelectedForDelete([])
              } else {
                setIsDeletingMode(true)
                setIsAddingRule(false)
              }
            }}
          >
            삭제
          </button>
          <div className={styles.ruleActionDivider} />
          <button
            className={styles.ruleActionButton}
            onClick={() => {
              if (isAddingRule) {
                setIsAddingRule(false)
                setNewRuleText('')
              } else {
                setIsAddingRule(true)
                setIsDeletingMode(false)
                setSelectedForDelete([])
              }
            }}
          >
            추가
          </button>
        </div>
      </div>
      <div className={styles.rulesList}>
        {isAddingRule && (
          <div className={`${styles.ruleCard} ${styles.ruleCardNew}`}>
            <input
              type="text"
              className={styles.ruleCardInput}
              placeholder="새로운 규칙을 입력해주세요"
              value={newRuleText}
              onChange={(e) => setNewRuleText(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter') handleAddRule()
                if (e.key === 'Escape') {
                  setIsAddingRule(false)
                  setNewRuleText('')
                }
              }}
              autoFocus
            />
          </div>
        )}
        {rules.map((rule) => (
          <div
            key={rule.id}
            className={`${styles.ruleCard} ${isDeletingMode ? styles.ruleCardDelete : ''}`}
            onClick={() => isDeletingMode && toggleDeleteSelection(rule.id)}
          >
            <p className={styles.ruleCardText}>{rule.text}</p>
            {isDeletingMode && (
              <div
                className={`${styles.ruleCardDeleteCheck} ${selectedForDelete.includes(rule.id) ? styles.checked : ''}`}
              />
            )}
          </div>
        ))}
      </div>

      {/* 하단 버튼 */}
      {isAddingRule && (
        <button className={styles.bottomButton} onClick={handleAddRule}>
          <span className={styles.bottomButtonText}>추가하기</span>
        </button>
      )}
      {isDeletingMode && selectedForDelete.length > 0 && (
        <button className={styles.bottomButton} onClick={handleDeleteSelected}>
          <span className={styles.bottomButtonText}>삭제하기</span>
        </button>
      )}
    </div>
  )
}

export default ActivityRules
