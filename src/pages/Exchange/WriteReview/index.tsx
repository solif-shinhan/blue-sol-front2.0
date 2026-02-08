import { useState, useEffect, useRef } from 'react'
import { useNavigate, useLocation } from 'react-router-dom'
import styles1 from './WriteReview-1.module.css'
import styles2 from './WriteReview-2.module.css'
import styles2b from './WriteReview-2b.module.css'

const styles = { ...styles1, ...styles2, ...styles2b }
import backArrowIcon from '@/assets/images/writing/Glyph_ undefined.svg'
import addImageIcon from '@/assets/images/writing/2d6dd2ec71c992edc2f26de66f36996d63d584d6.svg'
import cameraIcon from '@/assets/images/writing/7170b38684bc72225666196a022092a11cdc4f45.svg'

import {
  type ImageItem,
  type Participant,
  INITIAL_PARTICIPANTS,
  STEP_TITLES,
} from './WriteReview.constants'
import { CalendarModal } from './CalendarModal'
import { useSessionStorage, clearSessionGroup } from '@/hooks'

function WriteReviewPage() {
  const navigate = useNavigate()
  const location = useLocation()
  const [step, setStep] = useSessionStorage('write-review:step', 1)
  const [title, setTitle] = useSessionStorage('write-review:title', '')
  const [dateValue, setDateValue] = useSessionStorage('write-review:date', '')
  const [locationValue, setLocationValue] = useSessionStorage('write-review:location', '')
  const [expenses, setExpenses] = useSessionStorage<string[]>('write-review:expenses', [''])
  const [reviewText, setReviewText] = useSessionStorage('write-review:review', '')
  const [images, setImages] = useSessionStorage<ImageItem[]>('write-review:images', [])
  const [participants, setParticipants] = useSessionStorage<Participant[]>('write-review:participants', INITIAL_PARTICIPANTS)
  const [participantCount, setParticipantCount] = useSessionStorage('write-review:pcount', '6')
  const imageInputRef = useRef<HTMLInputElement>(null)
  const [showCalendar, setShowCalendar] = useState(false)
  const [calendarYear, setCalendarYear] = useState(new Date().getFullYear())
  const [calendarMonth, setCalendarMonth] = useState(new Date().getMonth())

  useEffect(() => {
    const state = location.state as Record<string, unknown> | null
    if (!state) return

    if (state.receiptAmount !== undefined) {
      const receiptAmount = state.receiptAmount as number
      const expenseIndex = (state.expenseIndex as number) ?? 0

      if (state.prevTitle) setTitle(state.prevTitle as string)
      if (state.prevDateTime) setDateValue(state.prevDateTime as string)
      if (state.prevLocation) setLocationValue(state.prevLocation as string)
      if (state.prevExpenses) {
        const prev = state.prevExpenses as string[]
        const updated = [...prev]
        updated[expenseIndex] = `${receiptAmount.toLocaleString()}원`
        setExpenses(updated)
      } else {
        setExpenses((prev) => {
          const updated = [...prev]
          updated[expenseIndex] = `${receiptAmount.toLocaleString()}원`
          return updated
        })
      }
      if (state.prevStep) setStep(state.prevStep as number)
      if (state.prevImages) setImages(state.prevImages as ImageItem[])

      window.history.replaceState({}, '')
    }
  }, [location.state])

  const navigateToReceipt = (expenseIndex: number) => {
    navigate('/exchange/write/review/receipt', {
      state: {
        expenseIndex,
        prevTitle: title,
        prevDateTime: dateValue,
        prevLocation: locationValue,
        prevExpenses: expenses,
        prevStep: step,
        prevImages: images,
      },
    })
  }

  const isStepValid = () => {
    if (step === 1) return dateValue.trim() !== '' && locationValue.trim() !== ''
    if (step === 2) return participants.length > 0
    if (step === 3) return reviewText.trim() !== ''
    return false
  }

  const handleAddImage = () => {
    if (imageInputRef.current) {
      imageInputRef.current.value = ''
      imageInputRef.current.click()
    }
  }

  const handleImageFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return
    e.target.value = ''
    const url = URL.createObjectURL(file)
    const newImage: ImageItem = { id: Date.now().toString(), url }
    setImages((prev) => [...prev, newImage])
  }

  const handleRemoveImage = (id: string) => {
    setImages((prev) => prev.filter((img) => img.id !== id))
  }

  const handleNext = () => {
    if (step < 3) {
      setStep(step + 1)
    } else {
      clearSessionGroup('write-review:')
      navigate('/exchange')
    }
  }

  const handleSelectDate = (day: number) => {
    const y = calendarYear
    const m = String(calendarMonth + 1).padStart(2, '0')
    const d = String(day).padStart(2, '0')
    setDateValue(`${y}.${m}.${d}`)
    setShowCalendar(false)
  }

  const handlePrevMonth = () => {
    if (calendarMonth === 0) {
      setCalendarYear(calendarYear - 1)
      setCalendarMonth(11)
    } else {
      setCalendarMonth(calendarMonth - 1)
    }
  }

  const handleNextMonth = () => {
    if (calendarMonth === 11) {
      setCalendarYear(calendarYear + 1)
      setCalendarMonth(0)
    } else {
      setCalendarMonth(calendarMonth + 1)
    }
  }

  return (
    <div className={styles.container}>
      <input
        ref={imageInputRef}
        type="file"
        accept="image/*"
        onChange={handleImageFileSelect}
        style={{ display: 'none' }}
      />
      <div className={styles.upperCard}>
        <div className={styles.header}>
          <div className={styles.headerLeft}>
            <button className={styles.backButton} onClick={() => step > 1 ? setStep(step - 1) : navigate(-1)}>
              <img src={backArrowIcon} alt="뒤로가기" />
            </button>
            <span className={styles.headerTitle}>자치회 활동 후기</span>
          </div>
          <span className={styles.councilName}>제주최강신한이들</span>
        </div>

        <div className={styles.imageSection}>
          <button className={styles.addImageButton} onClick={handleAddImage}>
            <img src={addImageIcon} alt="이미지 추가" className={styles.addImageIcon} />
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

      <div className={styles.formSection}>
        <div className={styles.formHeader}>
          <p className={styles.formTitle}>{STEP_TITLES[step - 1]}</p>
          <div className={styles.stepIndicator}>
            {[1, 2, 3].map((s) => (
              <div key={s} className={`${styles.stepDot} ${s <= step ? styles.stepDotActive : ''}`} />
            ))}
          </div>
        </div>

        {step === 1 && (
          <div className={styles.formFields}>
            <div className={styles.formRow}>
              <span className={styles.formLabel}>진행일시</span>
              <button
                type="button"
                className={styles.dateInputButton}
                onClick={() => setShowCalendar(true)}
              >
                {dateValue ? (
                  <span>{dateValue}</span>
                ) : (
                  <span className={styles.dateInputPlaceholder}>입력해주세요</span>
                )}
              </button>
            </div>
            <div className={styles.formRow}>
              <span className={styles.formLabel}>진행장소</span>
              <input
                type="text"
                className={styles.formInput}
                placeholder="입력해주세요"
                value={locationValue}
                onChange={(e) => setLocationValue(e.target.value)}
              />
            </div>
            <div className={styles.formRow}>
              <span className={styles.formLabel}>지출 내역</span>
              <div className={styles.receiptRow}>
                <button
                  type="button"
                  className={styles.receiptButton}
                  onClick={() => navigateToReceipt(0)}
                >
                  {expenses[0] || '영수증 첨부하기'}
                </button>
                <button
                  type="button"
                  className={styles.cameraButton}
                  onClick={() => navigateToReceipt(0)}
                >
                  <img src={cameraIcon} alt="카메라" className={styles.cameraIcon} />
                </button>
              </div>
            </div>
            <p className={styles.receiptHelper}>사진을 첨부하면 자동으로 금액이 인식됩니다.</p>
          </div>
        )}

        {step === 2 && (
          <div className={styles.formFields}>
            <div className={styles.formRow} style={{ opacity: 0.5 }}>
              <span className={styles.formLabel}>진행장소</span>
              <div className={styles.formInputDisplay}>
                <span className={styles.formInputText}>{locationValue}</span>
              </div>
            </div>
            <div className={styles.formRow} style={{ opacity: 0.5 }}>
              <span className={styles.formLabel}>지출 내역</span>
              <div className={styles.receiptRow}>
                <span className={styles.receiptButton} style={{ color: '#222222', fontWeight: 700 }}>
                  {expenses[0] || ''}
                </span>
                <div className={styles.cameraButton}>
                  <img src={cameraIcon} alt="카메라" className={styles.cameraIcon} />
                </div>
              </div>
            </div>
            <div className={styles.formRow}>
              <span className={styles.formLabel}>참여 인원</span>
              <input
                type="text"
                className={styles.formInput}
                style={{ borderColor: '#074ED8' }}
                value={participantCount}
                onChange={(e) => setParticipantCount(e.target.value)}
                placeholder="0 명"
              />
            </div>
            <div className={styles.participantsSection}>
              {participants.map((p) => (
                <div key={p.id} className={styles.participantItem}>
                  <div className={styles.participantAvatarWrap}>
                    <img
                      src={p.avatar}
                      alt={p.name}
                      className={styles.participantAvatar}
                    />
                    {!p.isMe && (
                      <button
                        className={styles.participantRemoveBtn}
                        onClick={() => setParticipants((prev) => prev.filter((x) => x.id !== p.id))}
                      >
                        <span className={styles.participantRemoveX}>✕</span>
                      </button>
                    )}
                  </div>
                  <span className={`${styles.participantName} ${p.isMe ? styles.participantNameMe : ''}`}>
                    {p.name}
                  </span>
                </div>
              ))}
              <div className={styles.participantItem}>
                <div
                  className={`${styles.participantAvatarWrap}`}
                  style={{ cursor: 'pointer' }}
                  onClick={() => navigate('/exchange/write/review/participant-edit')}
                >
                  <div className={`${styles.participantAvatar} ${styles.participantAvatarMe}`} />
                </div>
                <span className={styles.participantName}>추가하기</span>
              </div>
            </div>
          </div>
        )}

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

      <div className={styles.footer}>
        <button
          className={`${styles.nextButton} ${isStepValid() ? styles.nextButtonActive : ''}`}
          onClick={handleNext}
        >
          {step === 3 ? '업로드 하기' : '다음'}
        </button>
      </div>

      {showCalendar && (
        <CalendarModal
          calendarYear={calendarYear}
          calendarMonth={calendarMonth}
          dateValue={dateValue}
          onSelectDate={handleSelectDate}
          onPrevMonth={handlePrevMonth}
          onNextMonth={handleNextMonth}
          onClose={() => setShowCalendar(false)}
        />
      )}
    </div>
  )
}

export default WriteReviewPage
