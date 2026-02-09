import { useState, useEffect } from 'react'
import { useNavigate, useSearchParams } from 'react-router-dom'
import styles from './MentoringApply.module.css'
import { mentoringApi } from '@/api'
import type { MentorSummary } from '@/api'

const CATEGORY_OPTIONS = [
  { label: '학업', value: 'STUDY' },
  { label: '진학', value: 'ADMISSION' },
  { label: '취업', value: 'JOB' },
  { label: '기타', value: 'ETC' },
]

const MENTORING_METHODS = [
  { id: 'MESSAGE', label: '쪽지 상담' },
  { id: 'VIDEO', label: '화상 미팅' },
  { id: 'PHONE', label: '전화 상담' },
  { id: 'FACE', label: '대면 상담' },
]

function MentoringApplyPage() {
  const navigate = useNavigate()
  const [searchParams] = useSearchParams()
  const mentorId = Number(searchParams.get('mentorId'))

  const [mentor, setMentor] = useState<MentorSummary | null>(null)
  const [selectedCategory, setSelectedCategory] = useState('STUDY')
  const [selectedMethod, setSelectedMethod] = useState<string | null>(null)
  const [content, setContent] = useState('')
  const [showCompleteModal, setShowCompleteModal] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)

  // 멘토 정보 조회
  useEffect(() => {
    const fetchMentor = async () => {
      try {
        const res = await mentoringApi.getHome()
        if (res.success && res.data) {
          const found = res.data.allMentors.find((m) => m.mentorId === mentorId)
          if (found) setMentor(found)
        }
      } catch (err) {
        console.error('멘토 정보 조회 실패:', err)
      }
    }
    if (mentorId) fetchMentor()
  }, [mentorId])

  const handleClose = () => {
    navigate(-1)
  }

  const handleSubmit = async () => {
    if (!selectedMethod || !content.trim() || !mentorId) return
    try {
      setIsSubmitting(true)
      const res = await mentoringApi.createRequest({
        mentorId,
        category: selectedCategory,
        content: content.trim(),
        method: selectedMethod,
      })
      if (res.success) {
        setShowCompleteModal(true)
      }
    } catch (err) {
      console.error('멘토링 신청 실패:', err)
      alert('멘토링 신청에 실패했습니다. 다시 시도해주세요.')
    } finally {
      setIsSubmitting(false)
    }
  }

  useEffect(() => {
    if (showCompleteModal) {
      const timer = setTimeout(() => {
        navigate('/exchange/mentoring')
      }, 3000)
      return () => clearTimeout(timer)
    }
  }, [showCompleteModal, navigate])

  const handleModalClick = () => {
    navigate('/exchange/mentoring')
  }

  const isSubmitEnabled = content.trim().length > 0 && selectedMethod !== null && !isSubmitting

  return (
    <div className={styles.container}>
      <div className={styles.profileCard}>
        <header className={styles.header}>
          <button className={styles.closeButton} onClick={handleClose}>
            <span style={{ fontSize: 20 }}>{'<'}</span>
          </button>
          <h1 className={styles.headerTitle}>멘토링 신청</h1>
        </header>

        {mentor && (
          <div className={styles.mentorInfo}>
            <div className={styles.mentorNameRow}>
              <span className={styles.mentorName}>{mentor.mentorName}</span>
              <span className={styles.mentorRole}>멘토</span>
              <span className={styles.mentorOrg}>{mentor.mentorTitle}</span>
            </div>
            <p className={styles.mentorIntro}>{mentor.mentorIntro}</p>
          </div>
        )}
      </div>

      <div className={styles.formArea}>
        <div className={styles.formSection}>
          <div className={styles.sectionHeader}>
            <h2 className={styles.sectionTitle}>고민되는 내용을 작성해주세요</h2>
          </div>
          <div className={styles.categoryTabs}>
            {CATEGORY_OPTIONS.map((cat) => (
              <button
                key={cat.value}
                className={`${styles.categoryTab} ${selectedCategory === cat.value ? styles.categoryTabActive : ''}`}
                onClick={() => setSelectedCategory(cat.value)}
              >
                {cat.label}
              </button>
            ))}
          </div>
          <div className={styles.textareaWrapper}>
            <textarea
              className={styles.textarea}
              placeholder={`자유롭게 내용을 작성해주세요.\n익명이므로 누구의 고민인지 알 수 없어요.`}
              value={content}
              onChange={(e) => setContent(e.target.value)}
            />
          </div>
        </div>

        <div className={styles.formSection}>
          <div className={styles.sectionHeader}>
            <h2 className={styles.sectionTitle}>가능한 멘토링 방식을 모두 선택해주세요</h2>
          </div>
          <div className={styles.methodsGrid}>
            {MENTORING_METHODS.map((method) => (
              <div key={method.id} className={styles.methodItem}>
                <button
                  className={`${styles.methodButton} ${selectedMethod === method.id ? styles.methodButtonActive : ''}`}
                  onClick={() => setSelectedMethod(method.id)}
                >
                </button>
                <span className={styles.methodLabel}>{method.label}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      <button
        className={`${styles.submitButton} ${isSubmitEnabled ? styles.submitButtonActive : ''}`}
        onClick={handleSubmit}
        disabled={!isSubmitEnabled}
      >
        {isSubmitting ? '신청 중...' : '신청하기'}
      </button>

      {showCompleteModal && (
        <div className={styles.modalOverlay} onClick={handleModalClick}>
          <div className={styles.modalContent}>
            <div className={styles.modalIcon} />
            <div className={styles.modalTextWrapper}>
              <div className={styles.modalSubText}>
                <p>멘토링이 배정되면</p>
                <p>알림으로 바로 알려드릴게요!</p>
              </div>
              <p className={styles.modalMainText}>멘토링 신청 완료!</p>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default MentoringApplyPage
