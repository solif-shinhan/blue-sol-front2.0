import { useState, useEffect } from 'react'
import { useNavigate, useLocation } from 'react-router-dom'
import styles1 from './WriteReview-1.module.css'
import styles2 from './WriteReview-2.module.css'

const styles = { ...styles1, ...styles2 }
import backArrowIcon from '@/assets/images/writing/Glyph_ undefined.svg'
import dividerIcon from '@/assets/images/writing/Vector 12.svg'

interface ImageItem {
  id: string
  url: string
}

const STEP_TITLES = [
  '기본 내용을 입력해주세요',
  '지출 내역을 입력해주세요',
  '공유할 후기를 적어주세요',
]

function WriteReviewPage() {
  const navigate = useNavigate()
  const location = useLocation()
  const [step, setStep] = useState(1)
  const [title, setTitle] = useState('')
  const [locationValue, setLocationValue] = useState('')
  const [expenses, setExpenses] = useState<string[]>([''])
  const [reviewText, setReviewText] = useState('')
  const [images, setImages] = useState<ImageItem[]>([])

  // 영수증 첨부 결과 수신
  useEffect(() => {
    if (location.state?.receiptAmount !== undefined) {
      const { receiptAmount, expenseIndex } = location.state as { receiptAmount: number; expenseIndex: number }
      setExpenses((prev) => {
        const updated = [...prev]
        updated[expenseIndex] = `${receiptAmount.toLocaleString()}원`
        return updated
      })
      window.history.replaceState({}, '')
    }
  }, [location.state])

  const isStepValid = () => {
    if (step === 1) return locationValue.trim() !== ''
    if (step === 2) return expenses.some((e) => e.trim() !== '')
    if (step === 3) return reviewText.trim() !== ''
    return false
  }

  const handleAddImage = () => {
    const newImage: ImageItem = { id: Date.now().toString(), url: '/placeholder-image.jpg' }
    setImages((prev) => [...prev, newImage])
  }

  const handleRemoveImage = (id: string) => {
    setImages((prev) => prev.filter((img) => img.id !== id))
  }

  const handleNext = () => {
    if (step < 3) {
      setStep(step + 1)
    } else {
      navigate('/exchange')
    }
  }

  return (
    <div className={styles.container}>
      {/* Upper Card */}
      <div className={styles.upperCard}>
        <div className={styles.header}>
          <button className={styles.backButton} onClick={() => step > 1 ? setStep(step - 1) : navigate(-1)}>
            <img src={backArrowIcon} alt="뒤로가기" />
          </button>
          <span className={styles.headerTitle}>자치회 활동 후기</span>
        </div>

        <div className={styles.imageSection}>
          <button className={styles.addImageButton} onClick={handleAddImage}>
            <span className={styles.addImagePlus}>+</span>
          </button>
          {images.length > 0 && (
            <div className={styles.imageList}>
              {images.map((img) => (
                <div key={img.id} className={styles.imageItem}>
                  <img src={img.url} alt="" className={styles.imageThumb} />
                  <button className={styles.imageRemoveButton} onClick={() => handleRemoveImage(img.id)}>
                    <span className={styles.imageRemoveX}>✕</span>
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>

        <div className={styles.titleSection}>
          <p className={styles.titleLabel}>제목</p>
          <input
            type="text"
            className={styles.titleInput}
            placeholder="제목을 입력해주세요"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
          />
        </div>
      </div>

      {/* Form Section */}
      <div className={styles.formSection}>
        <div className={styles.formHeader}>
          <p className={styles.formTitle}>{STEP_TITLES[step - 1]}</p>
          <div className={styles.stepIndicator}>
            {[1, 2, 3].map((s) => (
              <div key={s} className={`${styles.stepDot} ${s <= step ? styles.stepDotActive : ''}`} />
            ))}
          </div>
        </div>

        {/* Step 1 & 2: Form fields */}
        {step <= 2 && (
          <>
            <div className={styles.formFields}>
              {/* 진행장소 */}
              <div className={styles.formRow} style={{ opacity: step === 1 ? 1 : 0.5 }}>
                <span className={styles.formLabel}>진행장소</span>
                {step === 1 ? (
                  <input
                    type="text"
                    className={styles.formInput}
                    placeholder="입력해주세요"
                    value={locationValue}
                    onChange={(e) => setLocationValue(e.target.value)}
                  />
                ) : (
                  <div className={styles.formInputDisplay}>
                    <span className={styles.formInputText}>{locationValue}</span>
                  </div>
                )}
              </div>

              {/* 지출 내역 */}
              {step >= 2 && (
                <div className={styles.formRow}>
                  <span className={styles.formLabel}>지출 내역</span>
                  <button
                    type="button"
                    className={styles.receiptButton}
                    onClick={() => navigate('/exchange/write/review/receipt', { state: { expenseIndex: 0 } })}
                  >
                    {expenses[0] || '영수증 첨부하기'}
                  </button>
                </div>
              )}
            </div>

            {/* Step 2: 지출 내역 상세 */}
            {step === 2 && (
              <>
                <div className={styles.divider}>
                  <img src={dividerIcon} alt="" />
                </div>
                <div className={styles.expenseSection}>
                  <span className={styles.expenseLabel}>지출 내역</span>
                  <div className={styles.expenseInputs}>
                    {expenses.map((expense, index) => (
                      <button
                        key={index}
                        type="button"
                        className={styles.receiptButton}
                        onClick={() => navigate('/exchange/write/review/receipt', { state: { expenseIndex: index } })}
                      >
                        {expense || '영수증 첨부하기'}
                      </button>
                    ))}
                    <button className={styles.addExpenseButton} onClick={() => setExpenses((prev) => [...prev, ''])}>
                      <span className={styles.addExpensePlus}>+</span>
                    </button>
                  </div>
                </div>
              </>
            )}
          </>
        )}

        {/* Step 3: 후기 작성 */}
        {step === 3 && (
          <div className={styles.reviewSection}>
            <div className={styles.reviewQuestionRow}>
              <p className={styles.reviewQuestion}>오늘의 활동은 어땠나요?</p>
            </div>
            <div className={styles.reviewCard}>
              <div className={styles.reviewUserInfo}>
                <div className={styles.reviewAvatar} />
                <span className={styles.reviewUserName}>김신한</span>
              </div>
              <textarea
                className={styles.reviewTextarea}
                placeholder={'친구들과 공유할 후기를 알려주세요.\n친구들이 이어쓸 수 있어요.'}
                value={reviewText}
                onChange={(e) => setReviewText(e.target.value)}
              />
            </div>
          </div>
        )}
      </div>

      {/* Footer Button */}
      <div className={styles.footer}>
        <button
          className={`${styles.nextButton} ${isStepValid() ? styles.nextButtonActive : ''}`}
          onClick={handleNext}
        >
          {step === 3 ? '업로드 하기' : '다음'}
        </button>
      </div>
    </div>
  )
}

export default WriteReviewPage
