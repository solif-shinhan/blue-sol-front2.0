import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import styles from './MentoringPostcard.module.css'
import { mentoringApi, fileApi } from '@/api'

import addIcon from '@/assets/images/+.svg'

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

function MentoringPostcardPage() {
  const navigate = useNavigate()
  const [title, setTitle] = useState('')
  const [selectedCategory, setSelectedCategory] = useState('STUDY')
  const [selectedMethod, setSelectedMethod] = useState<string | null>(null)
  const [content, setContent] = useState('')
  const [photos, setPhotos] = useState<{ file: File; preview: string }[]>([])
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [showCompleteModal, setShowCompleteModal] = useState(false)

  const handleClose = () => {
    navigate(-1)
  }

  const handleAddPhoto = () => {
    const input = document.createElement('input')
    input.type = 'file'
    input.accept = 'image/*'
    input.onchange = (e) => {
      const file = (e.target as HTMLInputElement).files?.[0]
      if (file) {
        const preview = URL.createObjectURL(file)
        setPhotos((prev) => [...prev, { file, preview }])
      }
    }
    input.click()
  }

  const handleRemovePhoto = (index: number) => {
    setPhotos((prev) => {
      URL.revokeObjectURL(prev[index].preview)
      return prev.filter((_, i) => i !== index)
    })
  }

  const handleSubmit = async () => {
    if (!title.trim() || !content.trim() || !selectedMethod) return
    try {
      setIsSubmitting(true)

      // 1. 사진 업로드 (있으면)
      let fileIds: number[] = []
      if (photos.length > 0) {
        const files = photos.map((p) => p.file)
        const uploadRes = await fileApi.upload(files, 'MENTORING')
        if (uploadRes.data) {
          fileIds = uploadRes.data.map((f) => f.fileId)
        }
      }

      // 2. 엽서 발송
      const res = await mentoringApi.createCard({
        cardTitle: title.trim(),
        category: selectedCategory,
        method: selectedMethod,
        cardContent: content.trim(),
        fileIds: fileIds.length > 0 ? fileIds : undefined,
      })

      if (res.success) {
        setShowCompleteModal(true)
      }
    } catch (err) {
      console.error('멘토링 엽서 발송 실패:', err)
      alert('엽서 발송에 실패했습니다. 다시 시도해주세요.')
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

  // cleanup previews
  useEffect(() => {
    return () => {
      photos.forEach((p) => URL.revokeObjectURL(p.preview))
    }
  }, [])

  const isSubmitEnabled = title.trim().length > 0 && content.trim().length > 0 && selectedMethod !== null && !isSubmitting

  return (
    <div className={styles.container}>
      <header className={styles.header}>
        <button className={styles.closeButton} onClick={handleClose}>
          <span className={styles.backArrow}>{'<'}</span>
        </button>
        <h1 className={styles.headerTitle}>맞춤 멘토링 신청 엽서</h1>
      </header>

      <div className={styles.scrollArea}>
        {/* 사진 섹션 */}
        <div className={styles.photoSection}>
          <button className={styles.addPhotoButton} onClick={handleAddPhoto}>
            <img src={addIcon} alt="사진 추가" />
          </button>
          {photos.map((photo, index) => (
            <div key={index} className={styles.photoItem}>
              <img src={photo.preview} alt="" className={styles.photoImage} />
              <button
                className={styles.photoDeleteButton}
                onClick={() => handleRemovePhoto(index)}
              >
                <svg width="17" height="17" viewBox="0 0 17 17" fill="none">
                  <circle cx="8.5" cy="8.5" r="8.5" fill="#222222" fillOpacity="0.6" />
                  <path d="M5.5 5.5L11.5 11.5M5.5 11.5L11.5 5.5" stroke="white" strokeWidth="1.5" strokeLinecap="round" />
                </svg>
              </button>
            </div>
          ))}
        </div>

        {/* 제목 */}
        <div className={styles.formSection}>
          <p className={styles.sectionLabel}>제목</p>
          <input
            type="text"
            className={styles.titleInput}
            placeholder="제목을 입력해주세요"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
          />
        </div>

        {/* 고민 내용 */}
        <div className={styles.formSection}>
          <p className={styles.sectionLabel}>고민되는 내용을 작성해주세요</p>
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
          <textarea
            className={styles.textarea}
            placeholder={`자유롭게 내용을 작성해주세요.\n익명이므로 누구의 고민인지 알 수 없어요.`}
            value={content}
            onChange={(e) => setContent(e.target.value)}
          />
        </div>

        {/* 멘토링 방식 */}
        <div className={styles.formSection}>
          <p className={styles.sectionLabel}>가능한 멘토링 방식을 모두 선택해주세요</p>
          <div className={styles.methodsGrid}>
            {MENTORING_METHODS.map((method) => (
              <div key={method.id} className={styles.methodItem}>
                <button
                  className={`${styles.methodButton} ${selectedMethod === method.id ? styles.methodButtonActive : ''}`}
                  onClick={() => setSelectedMethod(method.id)}
                />
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
        {isSubmitting ? '발송 중...' : '신청하기'}
      </button>

      {showCompleteModal && (
        <div className={styles.modalOverlay} onClick={() => navigate('/exchange/mentoring')}>
          <div className={styles.modalContent}>
            <div className={styles.modalIcon} />
            <div className={styles.modalTextWrapper}>
              <div className={styles.modalSubText}>
                <p>맞춤 멘토를 찾으면</p>
                <p>알림으로 바로 알려드릴게요!</p>
              </div>
              <p className={styles.modalMainText}>엽서 발송 완료!</p>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default MentoringPostcardPage
