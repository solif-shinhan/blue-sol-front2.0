import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import styles from './MentoringPostcard.module.css'

import closeIcon from '@/assets/images/exchange-mentoring/close.svg'
import addIcon from '@/assets/images/+.svg'

const CATEGORY_OPTIONS = ['학업', '취업', '금전', '기타']

const MENTORING_METHODS = [
  { id: 'note', label: '쪽지 상담' },
  { id: 'video', label: '화상 미팅' },
  { id: 'phone', label: '전화 상담' },
  { id: 'face', label: '대면 상담' },
]

function MentoringPostcardPage() {
  const navigate = useNavigate()
  const [title, setTitle] = useState('')
  const [selectedCategory, setSelectedCategory] = useState('학업')
  const [selectedMethod, setSelectedMethod] = useState<string | null>(null)
  const [content, setContent] = useState('')
  const [photos, setPhotos] = useState<string[]>([])

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
        const url = URL.createObjectURL(file)
        setPhotos((prev) => [...prev, url])
      }
    }
    input.click()
  }

  const handleRemovePhoto = (index: number) => {
    setPhotos((prev) => prev.filter((_, i) => i !== index))
  }

  const handleSubmit = () => {
    console.log({ title, category: selectedCategory, method: selectedMethod, content, photos })
    navigate(-1)
  }

  const isSubmitEnabled = title.trim().length > 0 && content.trim().length > 0 && selectedMethod !== null

  return (
    <div className={styles.container}>
      <div className={styles.topCard}>
        <header className={styles.header}>
          <button className={styles.closeButton} onClick={handleClose}>
            <img src={closeIcon} alt="닫기" />
          </button>
          <h1 className={styles.headerTitle}>맞춤 멘토링 신청 엽서</h1>
        </header>

        <div className={styles.photoSection}>
          <button className={styles.addPhotoButton} onClick={handleAddPhoto}>
            <img src={addIcon} alt="사진 추가" />
          </button>
          {photos.map((photo, index) => (
            <div key={index} className={styles.photoItem}>
              <img src={photo} alt="" className={styles.photoImage} />
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
      </div>

      <div className={styles.formArea}>
        <div className={styles.formSection}>
          <div className={styles.sectionLabelWrap}>
            <p className={styles.sectionLabel}>제목</p>
          </div>
          <input
            type="text"
            className={styles.titleInput}
            placeholder="제목을 입력해주세요"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
          />
        </div>

        <div className={styles.formSection}>
          <div className={styles.sectionLabelWrap}>
            <p className={styles.sectionLabel}>고민되는 내용을 작성해주세요</p>
          </div>
          <div className={styles.categoryTabs}>
            {CATEGORY_OPTIONS.map((category) => (
              <button
                key={category}
                className={`${styles.categoryTab} ${selectedCategory === category ? styles.categoryTabActive : ''}`}
                onClick={() => setSelectedCategory(category)}
              >
                {category}
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

        <div className={styles.formSection}>
          <div className={styles.sectionLabelWrap}>
            <p className={styles.sectionLabel}>가능한 멘토링 방식을 선택해주세요</p>
          </div>
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
        신청하기
      </button>
    </div>
  )
}

export default MentoringPostcardPage
