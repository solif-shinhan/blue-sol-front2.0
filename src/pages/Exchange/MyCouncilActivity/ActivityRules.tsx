import { useState, useEffect } from 'react'
import styles1 from './MyCouncilActivity-1.module.css'
import styles2 from './MyCouncilActivity-2.module.css'
const styles = { ...styles1, ...styles2 }
import { getCouncilRules, addCouncilRule, deleteCouncilRule, CouncilRule } from '@/services'

interface ActivityRulesProps {
  councilId: number
}

function ActivityRules({ councilId }: ActivityRulesProps) {
  const [rules, setRules] = useState<CouncilRule[]>([])
  const [isAddingRule, setIsAddingRule] = useState(false)
  const [newRuleText, setNewRuleText] = useState('')
  const [isDeletingMode, setIsDeletingMode] = useState(false)
  const [selectedForDelete, setSelectedForDelete] = useState<number[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [isSubmitting, setIsSubmitting] = useState(false)

  useEffect(() => {
    const fetchRules = async () => {
      setIsLoading(true)
      try {
        const response = await getCouncilRules(councilId)
        if (response.success) {
          setRules(response.data)
        }
      } catch (err) {
        console.error('규칙 조회 실패:', err)
      } finally {
        setIsLoading(false)
      }
    }

    fetchRules()
  }, [councilId])

  const handleAddRule = async () => {
    if (!newRuleText.trim() || isSubmitting) return

    setIsSubmitting(true)
    try {
      const response = await addCouncilRule(councilId, { content: newRuleText.trim() })
      if (response.success) {
        const rulesRes = await getCouncilRules(councilId)
        if (rulesRes.success) {
          setRules(rulesRes.data)
        }
        setNewRuleText('')
        setIsAddingRule(false)
      }
    } catch (err) {
      console.error('규칙 추가 실패:', err)
      alert('규칙 추가에 실패했습니다.')
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleDeleteSelected = async () => {
    if (selectedForDelete.length === 0 || isSubmitting) return

    setIsSubmitting(true)
    try {
      for (const ruleId of selectedForDelete) {
        await deleteCouncilRule(councilId, ruleId)
      }
      setRules(rules.filter(rule => !selectedForDelete.includes(rule.ruleId)))
      setSelectedForDelete([])
      setIsDeletingMode(false)
    } catch (err) {
      console.error('규칙 삭제 실패:', err)
      alert('규칙 삭제에 실패했습니다.')
    } finally {
      setIsSubmitting(false)
    }
  }

  const toggleDeleteSelection = (id: number) => {
    setSelectedForDelete(prev =>
      prev.includes(id) ? prev.filter(x => x !== id) : [...prev, id]
    )
  }

  if (isLoading) {
    return (
      <div className={styles.rulesSection}>
        <div style={{ padding: '20px', textAlign: 'center' }}>로딩 중...</div>
      </div>
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
              disabled={isSubmitting}
            />
          </div>
        )}
        {rules.length === 0 && !isAddingRule ? (
          <div style={{ padding: '20px', textAlign: 'center', color: '#888' }}>등록된 규칙이 없습니다.</div>
        ) : (
          rules.map((rule) => (
            <div
              key={rule.ruleId}
              className={`${styles.ruleCard} ${isDeletingMode ? styles.ruleCardDelete : ''}`}
              onClick={() => isDeletingMode && toggleDeleteSelection(rule.ruleId)}
            >
              <p className={styles.ruleCardText}>{rule.content}</p>
              {isDeletingMode && (
                <div
                  className={`${styles.ruleCardDeleteCheck} ${selectedForDelete.includes(rule.ruleId) ? styles.checked : ''}`}
                />
              )}
            </div>
          ))
        )}
      </div>

      {isAddingRule && (
        <button className={styles.bottomButton} onClick={handleAddRule} disabled={isSubmitting}>
          <span className={styles.bottomButtonText}>{isSubmitting ? '추가 중...' : '추가하기'}</span>
        </button>
      )}
      {isDeletingMode && selectedForDelete.length > 0 && (
        <button className={styles.bottomButton} onClick={handleDeleteSelected} disabled={isSubmitting}>
          <span className={styles.bottomButtonText}>{isSubmitting ? '삭제 중...' : '삭제하기'}</span>
        </button>
      )}
    </div>
  )
}

export default ActivityRules
