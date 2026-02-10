import { useState, useEffect, useRef } from 'react'
import { useNavigate, useLocation } from 'react-router-dom'
import styles1 from './WriteReview-1.module.css'
import styles2 from './WriteReview-2.module.css'
import styles2b from './WriteReview-2b.module.css'

const styles = { ...styles1, ...styles2, ...styles2b }
import { BackHeader } from '@/components/BackHeader'

const API_BASE = import.meta.env.VITE_API_URL || 'https://stg-api.bluesol.site'
const toFullUrl = (path: string | null | undefined): string | undefined => {
  if (!path) return undefined
  if (path.startsWith('http') || path.startsWith('blob')) return path
  return `${API_BASE}/${path}`
}
import addImageIcon from '@/assets/images/writing/2d6dd2ec71c992edc2f26de66f36996d63d584d6.svg'
import cameraIcon from '@/assets/images/writing/7170b38684bc72225666196a022092a11cdc4f45.svg'

import {
  type ImageItem,
  type Participant,
  STEP_TITLES,
} from './WriteReview.constants'
import { CalendarModal } from './CalendarModal'
import { useSessionStorage, clearSessionGroup } from '@/hooks'
import { uploadFile } from '@/services/fileService'
import { councilReviewRelayApi, councilReviewPostApi } from '@/api/api-3'
import { getMyCouncil, getCouncilMembers } from '@/services'
import { userApi } from '@/api/api-2'
import refreshIcon from '@/assets/images/writing/refresh-icon.svg'

function WriteReviewPage() {
  const navigate = useNavigate()
  const location = useLocation()
  const [step, setStep] = useSessionStorage('write-review:step', 1)
  const [title, setTitle] = useSessionStorage('write-review:title', '')
  const [dateValue, setDateValue] = useSessionStorage('write-review:date', '')
  const [locationValue, setLocationValue] = useSessionStorage('write-review:location', '')
  const [expenses, setExpenses] = useSessionStorage<string[]>('write-review:expenses', [''])
  const [reviewText, setReviewText] = useSessionStorage('write-review:review', '')
  const [images, setImages] = useState<ImageItem[]>([])
  const [participants, setParticipants] = useSessionStorage<Participant[]>('write-review:participants', [])
  const [membersLoaded, setMembersLoaded] = useSessionStorage('write-review:membersLoaded', false)
  const imageInputRef = useRef<HTMLInputElement>(null)
  const [showCalendar, setShowCalendar] = useState(false)
  const [calendarYear, setCalendarYear] = useState(new Date().getFullYear())
  const [calendarMonth, setCalendarMonth] = useState(new Date().getMonth())
  const [receiptFileId, setReceiptFileId] = useSessionStorage<number | null>('write-review:receiptFileId', null)
  const [councilId, setCouncilId] = useSessionStorage<number | null>('write-review:councilId', null)
  const [questionText, setQuestionText] = useSessionStorage('write-review:questionText', '오늘의 활동은 어땠나요?')
  const [questionId, setQuestionId] = useSessionStorage<number | null>('write-review:questionId', null)
  const [usedQuestionIds, setUsedQuestionIds] = useState<number[]>([])
  const [councilName, setCouncilName] = useSessionStorage('write-review:councilName', '')
  const [userName, setUserName] = useSessionStorage('write-review:userName', '')

  useEffect(() => {
    if (membersLoaded && councilId) return
    const loadCouncilData = async () => {
      try {
        const [councilRes, userRes] = await Promise.all([
          getMyCouncil(),
          userApi.getMe(),
        ])
        if (!councilRes.success || !councilRes.data) return
        const cId = councilRes.data.councilId
        setCouncilId(cId)
        setCouncilName(councilRes.data.councilName)
        if (userRes.success && userRes.data) {
          setUserName(userRes.data.name)
        }

        if (!membersLoaded) {
          const membersRes = await getCouncilMembers(cId)
          if (membersRes.success) {
            const list: any[] = membersRes.data?.members ?? []
            const myUserId = userRes.success ? userRes.data.userId : 0
            const memberParticipants: Participant[] = list.map((m: any) => ({
              id: m.userId,
              name: m.userId === myUserId ? '나' : (m.userName || m.name || ''),
              avatar: toFullUrl(m.characterImageUrl || m.profileImageUrl) || '',
              isMe: m.userId === myUserId,
            }))
            memberParticipants.sort((a, b) => (a.isMe ? -1 : b.isMe ? 1 : 0))
            setParticipants(memberParticipants)
            setMembersLoaded(true)
          }
        }
      } catch (err) {
        console.error('자치회/멤버 조회 실패:', err)
      }
    }
    loadCouncilData()
  }, [])

  useEffect(() => {
    const state = location.state as Record<string, unknown> | null
    if (!state) return

    if (state.receiptAmount !== undefined) {
      const receiptAmount = state.receiptAmount as number
      const expenseIndex = (state.expenseIndex as number) ?? 0
      if (state.receiptFileId) setReceiptFileId(state.receiptFileId as number)

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

  const fetchRandomQuestion = async (excludeIds: number[] = []) => {
    try {
      const res = await councilReviewRelayApi.getRandomQuestion(excludeIds)
      if (res.success && res.data) {
        setQuestionText(res.data.questionText)
        setQuestionId(res.data.questionId)
        setUsedQuestionIds((prev) => [...prev, res.data.questionId])
      }
    } catch {
      // 실패 시 기본 질문 유지
    }
  }

  useEffect(() => {
    if (step === 3 && !questionId) {
      fetchRandomQuestion()
    }
  }, [step])

  const handleRefreshQuestion = () => {
    fetchRandomQuestion(usedQuestionIds)
  }

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
    if (step === 1) return dateValue.trim() !== '' && locationValue.trim() !== '' && expenses[0]?.trim() !== ''
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

    const localUrl = URL.createObjectURL(file)
    const tempId = Date.now().toString()
    setImages((prev) => [...prev, { id: tempId, url: localUrl }])

    uploadFile(file, 'COUNCIL_REVIEW')
      .then((uploaded) => {
        setImages((prev) =>
          prev.map((img) =>
            img.id === tempId ? { ...img, url: uploaded.url } : img
          )
        )
      })
      .catch((err) => console.error('이미지 업로드 실패:', err))
  }

  const handleRemoveImage = (id: string) => {
    setImages((prev) => prev.filter((img) => img.id !== id))
  }

  const [isSubmitting, setIsSubmitting] = useState(false)

  const handleNext = async () => {
    if (step < 3) {
      setStep(step + 1)
      return
    }
    if (isSubmitting) return
    setIsSubmitting(true)
    try {
      if (!councilId) {
        alert('자치회 정보를 불러오지 못했습니다.')
        setIsSubmitting(false)
        return
      }
      if (!questionId) {
        alert('질문을 불러오지 못했습니다. 다시 시도해주세요.')
        setIsSubmitting(false)
        return
      }
      const costNum = parseInt((expenses[0] || '0').replace(/[^0-9]/g, ''), 10) || 0
      const res = await councilReviewPostApi.create(councilId, {
        postTitle: title,
        activityDate: dateValue.replace(/\./g, '-'),
        activityLocation: locationValue,
        totalCost: costNum,
        participantUserIds: participants.filter(p => !p.isMe).map(p => p.id),
        receiptFileId: receiptFileId || undefined,
        questionId,
        relayContent: reviewText,
      })
      if (res.success && res.data) {
        const savedImages = images.map(img => img.url)
        clearSessionGroup('write-review:')
        navigate(`/exchange/council/review/${res.data.councilReviewPostId}`, {
          state: { title, dateValue, questionText, reviewText, imageUrls: savedImages },
        })
      }
    } catch (err) {
      console.error('후기 업로드 실패:', err)
      alert('업로드에 실패했습니다.')
    } finally {
      setIsSubmitting(false)
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

  const DimmedRow = ({ label, value }: { label: string; value: string }) => (
    <div className={styles.formRow} style={{ opacity: 0.5 }}>
      <span className={styles.formLabel}>{label}</span>
      <div className={styles.formInputDisplay}>
        <span className={styles.formInputText}>{value}</span>
      </div>
    </div>
  )

  const DimmedExpenseRow = () => (
    <div className={styles.formRow} style={{ opacity: 0.5 }}>
      <span className={styles.formLabel}>지출 내역</span>
      <div className={styles.receiptRow}>
        <span className={styles.receiptButton} style={{ color: '#222222', fontWeight: 700 }}>{expenses[0] || ''}</span>
        <div className={styles.cameraButton}>
          <img src={cameraIcon} alt="카메라" className={styles.cameraIcon} />
        </div>
      </div>
    </div>
  )

  return (
    <div className={styles.container}>
      <input ref={imageInputRef} type="file" accept="image/*" onChange={handleImageFileSelect} style={{ display: 'none' }} />
      <div className={styles.upperCard}>
        <BackHeader
          title="자치회 활동 후기"
          onBack={() => step > 1 ? setStep(step - 1) : navigate('/exchange')}
          rightContent={<span className={styles.councilName}>{councilName}</span>}
        />
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
          <input type="text" className={styles.titleInput} placeholder="제목을 입력해주세요" value={title} onChange={(e) => setTitle(e.target.value)} />
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
              <button type="button" className={styles.dateInputButton} onClick={() => setShowCalendar(true)}>
                {dateValue ? <span>{dateValue}</span> : <span className={styles.dateInputPlaceholder}>입력해주세요</span>}
              </button>
            </div>
            <div className={styles.formRow}>
              <span className={styles.formLabel}>진행장소</span>
              <input type="text" className={styles.formInput} placeholder="입력해주세요" value={locationValue} onChange={(e) => setLocationValue(e.target.value)} />
            </div>
            <div className={styles.formRow}>
              <span className={styles.formLabel}>지출 내역</span>
              <div className={styles.receiptRow}>
                <button type="button" className={styles.receiptButton} onClick={() => navigateToReceipt(0)}>{expenses[0] || '영수증 첨부하기'}</button>
                <button type="button" className={styles.cameraButton} onClick={() => navigateToReceipt(0)}>
                  <img src={cameraIcon} alt="카메라" className={styles.cameraIcon} />
                </button>
              </div>
            </div>
            <p className={styles.receiptHelper}>사진을 첨부하면 자동으로 금액이 인식됩니다.</p>
          </div>
        )}

        {step === 2 && (
          <div className={styles.formFields}>
            <DimmedRow label="진행일시" value={dateValue} />
            <DimmedRow label="진행장소" value={locationValue} />
            <DimmedExpenseRow />
            <div className={styles.formRow}>
              <span className={styles.formLabel}>참여 인원</span>
              <div className={styles.formInputDisplay} style={{ borderColor: '#074ED8' }}>
                <span className={styles.formInputText}>{participants.length} 명</span>
              </div>
            </div>
            <div className={styles.participantsSection}>
              {participants.map((p) => (
                <div key={p.id} className={styles.participantItem}>
                  <div className={styles.participantAvatarWrap}>
                    {p.avatar ? (
                      <img src={p.avatar} alt={p.name} className={styles.participantAvatar} />
                    ) : (
                      <div className={`${styles.participantAvatar} ${p.isMe ? styles.participantAvatarMe : ''}`} />
                    )}
                    {!p.isMe && (
                      <button className={styles.participantRemoveBtn} onClick={() => setParticipants((prev) => prev.filter((x) => x.id !== p.id))}>
                        <span className={styles.participantRemoveX}>✕</span>
                      </button>
                    )}
                  </div>
                  <span className={`${styles.participantName} ${p.isMe ? styles.participantNameMe : ''}`}>{p.name}</span>
                </div>
              ))}
              <div className={styles.participantItem}>
                <div className={styles.participantAvatarWrap} style={{ cursor: 'pointer' }} onClick={() => navigate('/exchange/write/review/participants')}>
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
              <p className={styles.reviewQuestion}>{questionText}</p>
              <button type="button" className={styles.refreshButton} onClick={handleRefreshQuestion}>
                <img src={refreshIcon} alt="질문 변경" className={styles.refreshIcon} />
              </button>
            </div>
            <div className={styles.reviewCard}>
              <div className={styles.reviewUserInfo}>
                <div className={styles.reviewAvatar} />
                <span className={styles.reviewUserName}>{userName}</span>
              </div>
              <textarea className={styles.reviewTextarea} placeholder={'친구들과 공유할 후기를 알려주세요.\n친구들이 이어쓸 수 있어요.'} value={reviewText} onChange={(e) => setReviewText(e.target.value)} />
            </div>
          </div>
        )}
      </div>

      <div className={styles.footer}>
        <button className={`${styles.nextButton} ${isStepValid() ? styles.nextButtonActive : ''}`} onClick={handleNext}>
          {step === 3 ? (isSubmitting ? '업로드 중...' : '업로드 하기') : '다음'}
        </button>
      </div>

      {showCalendar && (
        <CalendarModal calendarYear={calendarYear} calendarMonth={calendarMonth} dateValue={dateValue} onSelectDate={handleSelectDate} onPrevMonth={handlePrevMonth} onNextMonth={handleNextMonth} onClose={() => setShowCalendar(false)} />
      )}
    </div>
  )
}

export default WriteReviewPage
